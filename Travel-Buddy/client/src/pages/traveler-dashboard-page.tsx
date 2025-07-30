import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  PlusCircle,
  Calendar,
  MapPin,
  ClipboardList,
  MessageCircle,
  Clock,
  ArrowRight,
  Loader2,
  User,
  CreditCard,
  Star,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { TripPreference, Itinerary, Message } from "@shared/schema";

const TravelerDashboardPage = () => {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  
  // Fetch trip preferences
  const { 
    data: tripPreferences, 
    isLoading: isLoadingPreferences,
    isError: isPreferencesError
  } = useQuery<TripPreference[]>({
    queryKey: ["/api/trip-preferences"],
    enabled: !!user,
  });
  
  // Fetch itineraries
  const {
    data: itineraries,
    isLoading: isLoadingItineraries,
    isError: isItinerariesError
  } = useQuery<Itinerary[]>({
    queryKey: ["/api/itineraries"],
    enabled: !!user,
  });
  
  // Fetch messages
  const {
    data: messages,
    isLoading: isLoadingMessages,
    isError: isMessagesError
  } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
    enabled: !!user,
  });
  
  // If user not loaded yet or not a traveler, show loading or redirect
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }
  
  if (user.role !== "traveler") {
    setLocation("/dashboard/agent");
    return null;
  }
  
  const pendingItineraries = itineraries?.filter(itinerary => 
    itinerary.status === "proposed" || itinerary.status === "draft"
  ) || [];
  
  const confirmedItineraries = itineraries?.filter(itinerary => 
    itinerary.status === "confirmed" || itinerary.status === "completed"
  ) || [];

  const unreadMessages = messages?.filter(message => 
    !message.isRead && message.receiverId === user.id
  ) || [];
  
  const getInitials = (name: string = "") => {
    return name.split(" ")
      .map(part => part.charAt(0))
      .join("")
      .toUpperCase();
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-neutral-light py-8">
        <div className="container mx-auto px-4">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold mb-2">Traveler Dashboard</h1>
            <p className="text-neutral-dark">Manage your trips, messages, and preferences</p>
          </div>
          
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-6 flex items-center">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <ClipboardList className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-neutral-dark">Active Trips</p>
                  <h3 className="text-2xl font-semibold">
                    {isLoadingItineraries ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      confirmedItineraries.length
                    )}
                  </h3>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex items-center">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-neutral-dark">Pending Itineraries</p>
                  <h3 className="text-2xl font-semibold">
                    {isLoadingItineraries ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      pendingItineraries.length
                    )}
                  </h3>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex items-center">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-neutral-dark">Unread Messages</p>
                  <h3 className="text-2xl font-semibold">
                    {isLoadingMessages ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      unreadMessages.length
                    )}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="trips">
            <TabsList className="mb-6">
              <TabsTrigger value="trips">My Trips</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="preferences">Trip Preferences</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>
            
            {/* Trips Tab */}
            <TabsContent value="trips">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card className="mb-8">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Upcoming Trips</CardTitle>
                        <Link href="/agents">
                          <Button>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Plan New Trip
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {isLoadingItineraries ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      ) : isItinerariesError ? (
                        <div className="text-center py-6">
                          <p className="text-neutral-dark">Failed to load itineraries. Please try again later.</p>
                        </div>
                      ) : confirmedItineraries.length > 0 ? (
                        <div className="space-y-4">
                          {confirmedItineraries.map((itinerary, index) => (
                            <div 
                              key={index} 
                              className="bg-neutral-light rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer hover:bg-neutral-medium/50 transition-colors"
                              onClick={() => setLocation(`/itinerary/${itinerary.id}`)}
                            >
                              <div className="mb-3 md:mb-0">
                                <h3 className="font-medium">{itinerary.title}</h3>
                                <div className="flex flex-col sm:flex-row sm:items-center text-sm text-neutral-dark mt-1">
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {/* Here we'd ideally use the start and end dates from the itinerary details */}
                                    <span>
                                      {new Date(itinerary.createdAt).toLocaleDateString('en-US', { 
                                        month: 'short', 
                                        year: 'numeric' 
                                      })}
                                    </span>
                                  </div>
                                  <span className="hidden sm:inline mx-2">•</span>
                                  <div className="flex items-center mt-1 sm:mt-0">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    <span>{itinerary.title.split(" - ")[0] || "Custom Trip"}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <Badge variant={itinerary.status === "completed" ? "secondary" : "default"}>
                                  {itinerary.status.charAt(0).toUpperCase() + itinerary.status.slice(1)}
                                </Badge>
                                <ArrowRight className="h-4 w-4 ml-2 text-neutral-dark" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 bg-neutral-light rounded-lg">
                          <p className="text-neutral-dark mb-4">You don't have any confirmed trips yet.</p>
                          <Link href="/agents">
                            <Button>Find an Agent & Start Planning</Button>
                          </Link>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Pending Itineraries</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isLoadingItineraries ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      ) : isItinerariesError ? (
                        <div className="text-center py-6">
                          <p className="text-neutral-dark">Failed to load pending itineraries. Please try again later.</p>
                        </div>
                      ) : pendingItineraries.length > 0 ? (
                        <div className="space-y-4">
                          {pendingItineraries.map((itinerary, index) => (
                            <div 
                              key={index} 
                              className="bg-neutral-light rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer hover:bg-neutral-medium/50 transition-colors"
                              onClick={() => setLocation(`/itinerary/${itinerary.id}`)}
                            >
                              <div className="mb-3 md:mb-0">
                                <h3 className="font-medium">{itinerary.title}</h3>
                                <div className="flex flex-col sm:flex-row sm:items-center text-sm text-neutral-dark mt-1">
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    <span>Created {new Date(itinerary.createdAt).toLocaleDateString()}</span>
                                  </div>
                                  <span className="hidden sm:inline mx-2">•</span>
                                  <div className="flex items-center mt-1 sm:mt-0">
                                    <CreditCard className="h-4 w-4 mr-1" />
                                    <span>${itinerary.totalPrice.toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                  {itinerary.status.charAt(0).toUpperCase() + itinerary.status.slice(1)}
                                </Badge>
                                <ArrowRight className="h-4 w-4 ml-2 text-neutral-dark" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-neutral-light rounded-lg">
                          <p className="text-neutral-dark">No pending itineraries at the moment.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isLoadingItineraries && isLoadingMessages ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      ) : (itineraries && itineraries.length > 0) || (messages && messages.length > 0) ? (
                        <div className="space-y-4">
                          {itineraries?.slice(0, 3).map((itinerary, index) => (
                            <div key={`itinerary-${index}`} className="flex items-start py-2">
                              <div className="bg-blue-100 p-1 rounded-full mr-3">
                                <ClipboardList className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">New itinerary: {itinerary.title}</p>
                                <p className="text-xs text-neutral-dark">
                                  {new Date(itinerary.createdAt).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </p>
                              </div>
                            </div>
                          ))}
                          
                          {messages?.slice(0, 3).map((message, index) => (
                            <div key={`message-${index}`} className="flex items-start py-2">
                              <div className="bg-green-100 p-1 rounded-full mr-3">
                                <MessageCircle className="h-4 w-4 text-green-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">
                                  {message.senderId === user.id ? "You sent a message" : "New message received"}
                                </p>
                                <p className="text-xs text-neutral-dark">
                                  {new Date(message.sentAt).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-neutral-dark">No recent activity to display.</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" onClick={() => setLocation('/messages')}>
                        View All Messages
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Messages Tab */}
            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Messages</CardTitle>
                    <Button onClick={() => setLocation('/messages')}>View Full Inbox</Button>
                  </div>
                  <CardDescription>
                    Your recent conversations with travel agents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingMessages ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : isMessagesError ? (
                    <div className="text-center py-6">
                      <p className="text-neutral-dark">Failed to load messages. Please try again later.</p>
                    </div>
                  ) : messages && messages.length > 0 ? (
                    <div className="space-y-4">
                      {/* Group messages by sender/receiver for a conversation view */}
                      {Array.from(new Set(messages.map(m => 
                        m.senderId === user.id ? m.receiverId : m.senderId
                      ))).slice(0, 5).map((contactId) => {
                        const contactMessages = messages.filter(m => 
                          m.senderId === contactId || m.receiverId === contactId
                        ).sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
                        
                        const latestMessage = contactMessages[0];
                        const unreadCount = contactMessages.filter(m => 
                          !m.isRead && m.receiverId === user.id
                        ).length;
                        
                        return (
                          <div 
                            key={contactId} 
                            className="bg-neutral-light rounded-lg p-4 flex justify-between items-center cursor-pointer hover:bg-neutral-medium/50 transition-colors"
                            onClick={() => setLocation(`/messages/${contactId}`)}
                          >
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarFallback>
                                  {/* In a real app, we would fetch the contact's details */}
                                  {contactId.toString().charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center">
                                  <h3 className="font-medium mr-2">Agent #{contactId}</h3>
                                  {unreadCount > 0 && (
                                    <Badge className="bg-primary text-white">{unreadCount}</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-neutral-dark line-clamp-1">
                                  {latestMessage.content.length > 40 
                                    ? `${latestMessage.content.substring(0, 40)}...` 
                                    : latestMessage.content}
                                </p>
                              </div>
                            </div>
                            <div className="text-xs text-neutral-dark">
                              {new Date(latestMessage.sentAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-neutral-light rounded-lg">
                      <p className="text-neutral-dark mb-4">You don't have any messages yet.</p>
                      <Link href="/agents">
                        <Button>Connect with Travel Agents</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Trip Preferences Tab */}
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>My Trip Preferences</CardTitle>
                    <Link href="/agents">
                      <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create New Preference
                      </Button>
                    </Link>
                  </div>
                  <CardDescription>
                    Your saved travel preferences that help agents create personalized itineraries
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingPreferences ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : isPreferencesError ? (
                    <div className="text-center py-6">
                      <p className="text-neutral-dark">Failed to load preferences. Please try again later.</p>
                    </div>
                  ) : tripPreferences && tripPreferences.length > 0 ? (
                    <div className="space-y-6">
                      {tripPreferences.map((preference, index) => (
                        <div key={index} className="border rounded-lg p-5">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium text-lg">{preference.destination} Trip</h3>
                            <Badge variant="outline">
                              {preference.budget.charAt(0).toUpperCase() + preference.budget.slice(1)}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center">
                              <MapPin className="h-5 w-5 text-primary mr-2" />
                              <div>
                                <p className="text-sm text-neutral-dark">Destination</p>
                                <p className="font-medium">{preference.destination}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center">
                              <Calendar className="h-5 w-5 text-primary mr-2" />
                              <div>
                                <p className="text-sm text-neutral-dark">Travel Dates</p>
                                <p className="font-medium">
                                  {formatDate(preference.startDate)} - {formatDate(preference.endDate)}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center">
                              <CreditCard className="h-5 w-5 text-primary mr-2" />
                              <div>
                                <p className="text-sm text-neutral-dark">Budget</p>
                                <p className="font-medium capitalize">{preference.budget}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <p className="text-sm text-neutral-dark mb-2">Travel Styles</p>
                            <div className="flex flex-wrap gap-2">
                              {preference.travelStyles.map((style, i) => (
                                <Badge key={i} variant="secondary">{style}</Badge>
                              ))}
                            </div>
                          </div>
                          
                          {preference.additionalInfo && (
                            <div>
                              <p className="text-sm text-neutral-dark mb-1">Additional Information</p>
                              <p className="text-neutral-dark">{preference.additionalInfo}</p>
                            </div>
                          )}
                          
                          <div className="flex justify-end mt-4">
                            <p className="text-xs text-neutral-dark">
                              Created: {new Date(preference.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-neutral-light rounded-lg">
                      <p className="text-neutral-dark mb-4">You haven't saved any trip preferences yet.</p>
                      <Link href="/agents">
                        <Button>Create Your First Preference</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Profile Tab */}
            <TabsContent value="profile">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center">
                        <Avatar className="h-24 w-24 mb-4">
                          {user.profilePicture ? (
                            <AvatarImage src={user.profilePicture} alt={user.fullName} />
                          ) : (
                            <AvatarFallback className="text-2xl">{getInitials(user.fullName)}</AvatarFallback>
                          )}
                        </Avatar>
                        <h2 className="text-xl font-bold mb-1">{user.fullName}</h2>
                        <p className="text-neutral-dark mb-4">{user.email}</p>
                        <Badge className="mb-4 capitalize">{user.role}</Badge>
                        <Button variant="outline" className="w-full">Edit Profile</Button>
                      </div>
                      
                      <Separator className="my-6" />
                      
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <User className="h-5 w-5 text-primary mr-3" />
                          <div>
                            <div className="text-sm text-neutral-dark">Username</div>
                            <div>{user.username}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-primary mr-3" />
                          <div>
                            <div className="text-sm text-neutral-dark">Member Since</div>
                            <div>{new Date(user.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="lg:col-span-2">
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-medium mb-2">Personal Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm text-neutral-dark mb-1">Full Name</label>
                              <input 
                                type="text" 
                                value={user.fullName} 
                                readOnly
                                className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-neutral-dark mb-1">Email</label>
                              <input 
                                type="email" 
                                value={user.email} 
                                readOnly
                                className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="font-medium mb-2">Notification Preferences</h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Email Notifications</p>
                                <p className="text-sm text-neutral-dark">Receive updates about your trips via email</p>
                              </div>
                              <input type="checkbox" defaultChecked className="toggle toggle-primary" />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">New Message Alerts</p>
                                <p className="text-sm text-neutral-dark">Get notified when you receive new messages</p>
                              </div>
                              <input type="checkbox" defaultChecked className="toggle toggle-primary" />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Marketing Communications</p>
                                <p className="text-sm text-neutral-dark">Receive travel deals and promotions</p>
                              </div>
                              <input type="checkbox" className="toggle toggle-primary" />
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="font-medium mb-2">Account Security</h3>
                          <Button variant="outline">Change Password</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {itineraries && itineraries.length > 0 ? (
                        <div className="space-y-6">
                          {itineraries.filter(itinerary => itinerary.status === "completed").map((itinerary, index) => (
                            <div key={index} className="border rounded-lg p-4">
                              <div className="flex justify-between items-center mb-3">
                                <h3 className="font-medium">{itinerary.title}</h3>
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                      key={star} 
                                      className="h-5 w-5 text-gray-300 cursor-pointer hover:text-yellow-500" 
                                    />
                                  ))}
                                </div>
                              </div>
                              <div className="mb-3">
                                <textarea 
                                  className="w-full p-3 border border-gray-300 rounded-md" 
                                  placeholder="Write a review for this trip..."
                                  rows={3}
                                ></textarea>
                              </div>
                              <div className="flex justify-end">
                                <Button>Submit Review</Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-neutral-dark">You don't have any completed trips to review yet.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TravelerDashboardPage;
