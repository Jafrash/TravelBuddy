import { useState, useEffect, useRef } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
//import { useWebSocket } from "../hooks/use-websocket";
// Temporary mock until WebSocket is fixed
const useWebSocket = (userId: number | null) => {
  return {
    isConnected: false,
    isConnecting: false,
    messages: [],
    sendMessage: (receiverId: number, content: string) => false,
    connect: () => {}
  };
};
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Message, User } from "@shared/schema";
import { Loader2, Send, User as UserIcon, Clock, MailOpen, Mail, WifiOff } from "lucide-react";

const MessagingPage = () => {
  const { receiverId } = useParams<{ receiverId?: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageText, setMessageText] = useState("");
  const [activeContact, setActiveContact] = useState<number | null>(
    receiverId ? parseInt(receiverId) : null
  );
  
  // Initialize WebSocket connection if user is authenticated
  const { isConnected, sendMessage } = useWebSocket(user?.id || null);

  // Fetch messages
  const {
    data: messages,
    isLoading: isLoadingMessages,
    isError: isMessagesError,
    refetch: refetchMessages
  } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
    enabled: !!user,
  });

  // Scroll to bottom of messages when new ones arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeContact]);

  // Mark messages as read when opening a conversation
  useEffect(() => {
    const markMessagesAsRead = async () => {
      if (!activeContact || !messages) return;

      const unreadMessages = messages.filter(
        msg => msg.receiverId === user?.id && msg.senderId === activeContact && !msg.isRead
      );

      if (unreadMessages.length > 0) {
        try {
          // In a real implementation, you would have an API endpoint to mark messages as read
          // This is a simplified version that would be replaced with an actual API call
          for (const msg of unreadMessages) {
            await apiRequest("PATCH", `/api/messages/${msg.id}`, { isRead: true });
          }
          // Refresh messages after marking as read
          refetchMessages();
        } catch (error) {
          console.error("Failed to mark messages as read:", error);
        }
      }
    };

    markMessagesAsRead();
  }, [activeContact, messages, user?.id, refetchMessages]);

  // Group messages by contact (sender/receiver)
  const getContacts = () => {
    if (!messages || !user) return [];

    const contactIds = new Set<number>();
    
    messages.forEach(msg => {
      const contactId = msg.senderId === user.id ? msg.receiverId : msg.senderId;
      contactIds.add(contactId);
    });

    return Array.from(contactIds).map(contactId => {
      const contactMessages = messages.filter(msg => 
        msg.senderId === contactId || msg.receiverId === contactId
      );
      
      // Safe date comparison 
      const sortedMessages = [...contactMessages].sort((a, b) => {
        const dateA = a.sentAt ? new Date(a.sentAt).getTime() : 0;
        const dateB = b.sentAt ? new Date(b.sentAt).getTime() : 0;
        return dateB - dateA;
      });
      
      const lastMessage = sortedMessages[0];
      const unreadCount = contactMessages.filter(msg => 
        !msg.isRead && msg.receiverId === user.id
      ).length;

      return {
        id: contactId,
        lastMessage,
        unreadCount,
        messages: [...contactMessages].sort((a, b) => {
          const dateA = a.sentAt ? new Date(a.sentAt).getTime() : 0;
          const dateB = b.sentAt ? new Date(b.sentAt).getTime() : 0;
          return dateA - dateB;
        })
      };
    });
  };

  const contacts = getContacts();

  // Handle sending a new message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !activeContact || !messageText.trim()) return;

    try {
      // If WebSocket is connected, send via WebSocket for real-time delivery
      if (isConnected && user.id) {
        const success = sendMessage(activeContact, messageText);
        if (success) {
          setMessageText("");
          
          // Refresh messages to see the new message immediately
          setTimeout(() => refetchMessages(), 500);
          return;
        }
      }
      
      // Fallback to REST API if WebSocket fails or is not connected
      await apiRequest("POST", "/api/messages", {
        receiverId: activeContact,
        content: messageText
      });

      setMessageText("");
      refetchMessages();
      
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "There was an error sending your message",
        variant: "destructive",
      });
    }
  };

  const formatMessageTime = (dateString: string | Date | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatMessageDate = (dateString: string | Date | null) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  // Get the active contact's messages
  const activeContactData = activeContact 
    ? contacts.find(contact => contact.id === activeContact) 
    : null;
  const activeMessages = activeContactData?.messages || [];

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="pt-6 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
              <p className="mb-6">Please log in to access your messages.</p>
              <Button asChild>
                <a href="/auth">Log In</a>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const getInitials = (id: number) => {
    return `${id}`.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-neutral-light py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-heading font-bold mb-6">Messages</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Contacts Sidebar */}
            <div className="lg:col-span-1">
              <Card className="h-[calc(100vh-12rem)] flex flex-col">
                <CardHeader className="px-4 py-3 border-b">
                  <CardTitle>Conversations</CardTitle>
                </CardHeader>
                <CardContent className="p-0 overflow-y-auto flex-grow">
                  {isLoadingMessages ? (
                    <div className="flex justify-center items-center h-full">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : isMessagesError ? (
                    <div className="text-center py-10">
                      <p className="text-neutral-dark">Failed to load messages. Please try again.</p>
                      <Button variant="outline" className="mt-4" onClick={() => refetchMessages()}>
                        Retry
                      </Button>
                    </div>
                  ) : contacts.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-neutral-dark">No conversations yet.</p>
                      <p className="text-sm text-neutral-dark mt-2">
                        Start messaging travel agents to plan your trip!
                      </p>
                    </div>
                  ) : (
                    <ul className="divide-y">
                      {contacts.map((contact) => (
                        <li 
                          key={contact.id}
                          className={`p-4 cursor-pointer hover:bg-neutral-medium/30 transition-colors ${
                            activeContact === contact.id ? 'bg-neutral-medium/50' : ''
                          }`}
                          onClick={() => setActiveContact(contact.id)}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>
                                {getInitials(contact.id)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center">
                                <p className="font-medium truncate">
                                  {user.role === "traveler" ? `Agent #${contact.id}` : `Traveler #${contact.id}`}
                                </p>
                                <span className="text-xs text-neutral-dark">
                                  {formatMessageDate(contact.lastMessage.sentAt)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center mt-1">
                                <p className="text-sm text-neutral-dark truncate">
                                  {contact.lastMessage.content.length > 30 
                                    ? `${contact.lastMessage.content.substring(0, 30)}...` 
                                    : contact.lastMessage.content}
                                </p>
                                {contact.unreadCount > 0 && (
                                  <Badge className="bg-primary text-white ml-2">
                                    {contact.unreadCount}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Messages Area */}
            <div className="lg:col-span-3">
              <Card className="h-[calc(100vh-12rem)] flex flex-col">
                {activeContact ? (
                  <>
                    <CardHeader className="px-6 py-4 border-b flex-shrink-0">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          <Avatar className="mr-3">
                            <AvatarFallback>
                              {getInitials(activeContact)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle>
                              {user.role === "traveler" ? `Agent #${activeContact}` : `Traveler #${activeContact}`}
                            </CardTitle>
                            <p className="text-sm text-neutral-dark">
                              {activeMessages.length > 0 
                                ? `${activeMessages.length} messages` 
                                : "Start a conversation"}
                            </p>
                          </div>
                        </div>
                        
                        {/* Connection status indicator */}
                        <div className="flex items-center">
                          {isConnected ? (
                            <div className="flex items-center text-xs text-emerald-600">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 mr-1"></div>
                              <span>Real-time</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-xs text-gray-500">
                              <WifiOff className="w-3 h-3 mr-1" />
                              <span>Standard</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-6 overflow-y-auto flex-grow">
                      <div className="space-y-6">
                        {activeMessages.length === 0 ? (
                          <div className="text-center py-10">
                            <p className="text-neutral-dark">No messages yet.</p>
                            <p className="text-sm text-neutral-dark mt-2">
                              Start the conversation by sending a message below.
                            </p>
                          </div>
                        ) : (
                          <>
                            {/* Group messages by date */}
                            {(() => {
                              const messagesByDate: Record<string, Message[]> = {};
                              
                              activeMessages.forEach(message => {
                                const dateStr = formatMessageDate(message.sentAt);
                                if (!messagesByDate[dateStr]) {
                                  messagesByDate[dateStr] = [];
                                }
                                messagesByDate[dateStr].push(message);
                              });
                              
                              return Object.entries(messagesByDate).map(([date, messages]) => (
                                <div key={date}>
                                  <div className="relative flex items-center py-4">
                                    <div className="flex-grow border-t border-gray-200"></div>
                                    <span className="flex-shrink-0 mx-4 text-sm text-neutral-dark">
                                      {date}
                                    </span>
                                    <div className="flex-grow border-t border-gray-200"></div>
                                  </div>
                                  
                                  <div className="space-y-4">
                                    {messages.map((message) => (
                                      <div 
                                        key={message.id}
                                        className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                                      >
                                        <div 
                                          className={`max-w-[80%] md:max-w-[70%] rounded-lg px-4 py-2 ${
                                            message.senderId === user.id 
                                              ? 'bg-primary text-white rounded-br-none' 
                                              : 'bg-neutral-medium rounded-bl-none'
                                          }`}
                                        >
                                          <p className="whitespace-pre-wrap break-words mb-1">
                                            {message.content}
                                          </p>
                                          <div 
                                            className={`text-xs flex items-center ${
                                              message.senderId === user.id ? 'text-white/80 justify-end' : 'text-neutral-dark'
                                            }`}
                                          >
                                            <span>{formatMessageTime(message.sentAt)}</span>
                                            {message.senderId === user.id && (
                                              <span className="ml-2">
                                                {message.isRead ? (
                                                  <MailOpen className="h-3 w-3" />
                                                ) : (
                                                  <Mail className="h-3 w-3" />
                                                )}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ));
                            })()}
                            <div ref={messagesEndRef} />
                          </>
                        )}
                      </div>
                    </CardContent>
                    
                    <div className="border-t p-4 flex-shrink-0">
                      <form onSubmit={handleSendMessage} className="flex gap-2">
                        <Input
                          placeholder="Type your message..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          className="flex-grow"
                        />
                        <Button type="submit" disabled={!messageText.trim()}>
                          <Send className="h-4 w-4 mr-2" />
                          Send
                        </Button>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                      <MessageIcon className="h-12 w-12 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Select a Conversation</h2>
                    <p className="text-neutral-dark max-w-md">
                      Choose a conversation from the list to view your messages. 
                      {user.role === "traveler" 
                        ? " You can message agents to ask questions about your trips or get travel advice."
                        : " Respond to travelers' inquiries and help them plan their perfect trip."}
                    </p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Message icon component
const MessageIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

export default MessagingPage;
