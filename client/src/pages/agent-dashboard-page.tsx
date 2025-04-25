import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Calendar, 
  MessageCircle, 
  Users, 
  DollarSign, 
  BarChart2, 
  ClipboardList,
  Clock,
  Loader2,
  Plus,
  User,
  CreditCard,
  MapPin,
  Check
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { z } from "zod";
import { TripPreference, Itinerary, Message, InsertItinerary } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Schema for creating a new itinerary
const createItinerarySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  totalPrice: z.coerce.number().positive("Price must be positive"),
  status: z.string().min(1, "Status is required"),
  tripPreferenceId: z.coerce.number().positive("Trip preference is required"),
  travelerId: z.coerce.number().positive("Traveler is required"),
  details: z.any(), // This will be handled separately as a JSON object
});

type CreateItineraryValues = z.infer<typeof createItinerarySchema>;

const AgentDashboardPage = () => {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedTripPreference, setSelectedTripPreference] = useState<TripPreference | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [itineraryDetails, setItineraryDetails] = useState([
    { day: 1, activities: "", accommodation: "", meals: "", transportation: "" }
  ]);
  
  // Fetch trip preferences (available to all agents)
  const { 
    data: tripPreferences, 
    isLoading: isLoadingPreferences,
    isError: isPreferencesError
  } = useQuery<TripPreference[]>({
    queryKey: ["/api/trip-preferences"],
    enabled: !!user,
  });
  
  // Fetch agent's itineraries
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
  
  const form = useForm<CreateItineraryValues>({
    resolver: zodResolver(createItinerarySchema),
    defaultValues: {
      title: "",
      description: "",
      totalPrice: 0,
      status: "draft",
      tripPreferenceId: 0,
      travelerId: 0,
      details: [],
    },
  });
  
  // If user not loaded yet or not an agent, show loading or redirect
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
  
  if (user.role !== "agent") {
    setLocation("/dashboard/traveler");
    return null;
  }
  
  const getInitials = (name: string = "") => {
    return name.split(" ")
      .map(part => part.charAt(0))
      .join("")
      .toUpperCase();
  };
  
  const draftItineraries = itineraries?.filter(itinerary => itinerary.status === "draft") || [];
  const proposedItineraries = itineraries?.filter(itinerary => itinerary.status === "proposed") || [];
  const confirmedItineraries = itineraries?.filter(itinerary => 
    itinerary.status === "confirmed" || itinerary.status === "completed"
  ) || [];
  
  const unreadMessages = messages?.filter(message => 
    !message.isRead && message.receiverId === user.id
  ) || [];
  
  const handleCreateItinerary = async (data: CreateItineraryValues) => {
    try {
      const itineraryData: InsertItinerary = {
        ...data,
        agentId: user.id,
        details: itineraryDetails,
      };
      
      await apiRequest("POST", "/api/itineraries", itineraryData);
      
      toast({
        title: "Itinerary created",
        description: "Your itinerary has been created successfully",
      });
      
      // Invalidate itineraries query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/itineraries"] });
      
      // Reset form and close dialog
      form.reset();
      setItineraryDetails([
        { day: 1, activities: "", accommodation: "", meals: "", transportation: "" }
      ]);
      setIsCreateDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error creating itinerary",
        description: "There was an error creating your itinerary. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleTripPreferenceSelect = (preference: TripPreference) => {
    setSelectedTripPreference(preference);
    
    // Set form values based on selected preference
    form.setValue("title", `${preference.destination} - Custom Itinerary`);
    form.setValue("tripPreferenceId", preference.id);
    form.setValue("travelerId", preference.travelerId);
    
    // Generate a description based on the preference
    const styles = preference.travelStyles.join(", ");
    const description = `Custom ${preference.destination} itinerary designed for ${styles} travel styles, planned for ${preference.startDate} to ${preference.endDate} with a ${preference.budget} budget.`;
    form.setValue("description", description);
    
    // Show the create itinerary dialog
    setIsCreateDialogOpen(true);
  };
  
  const addItineraryDay = () => {
    const nextDay = itineraryDetails.length + 1;
    setItineraryDetails([
      ...itineraryDetails,
      { day: nextDay, activities: "", accommodation: "", meals: "", transportation: "" }
    ]);
  };
  
  const updateItineraryDay = (index: number, field: string, value: string) => {
    const updated = [...itineraryDetails];
    updated[index] = { ...updated[index], [field]: value };
    setItineraryDetails(updated);
  };
  
  const removeItineraryDay = (index: number) => {
    if (itineraryDetails.length <= 1) return;
    
    const updated = itineraryDetails.filter((_, i) => i !== index)
      .map((day, i) => ({ ...day, day: i + 1 }));
    setItineraryDetails(updated);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-neutral-light py-8">
        <div className="container mx-auto px-4">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold mb-2">Agent Dashboard</h1>
            <p className="text-neutral-dark">Manage your itineraries, messages, and client preferences</p>
          </div>
          
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6 flex items-center">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <ClipboardList className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-neutral-dark">Active Itineraries</p>
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
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-neutral-dark">New Requests</p>
                  <h3 className="text-2xl font-semibold">
                    {isLoadingPreferences ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      tripPreferences?.filter(p => 
                        !itineraries?.some(i => i.tripPreferenceId === p.id)
                      ).length || 0
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
            
            <Card>
              <CardContent className="p-6 flex items-center">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-neutral-dark">Total Revenue</p>
                  <h3 className="text-2xl font-semibold">
                    {isLoadingItineraries ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      `$${confirmedItineraries.reduce((sum, itinerary) => sum + itinerary.totalPrice, 0).toLocaleString()}`
                    )}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="requests">
            <TabsList className="mb-6">
              <TabsTrigger value="requests">Trip Requests</TabsTrigger>
              <TabsTrigger value="itineraries">My Itineraries</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>
            
            {/* Trip Requests Tab */}
            <TabsContent value="requests">
              <Card>
                <CardHeader>
                  <CardTitle>New Trip Requests</CardTitle>
                  <CardDescription>
                    Travelers looking for customized itineraries matching your expertise
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingPreferences || isLoadingItineraries ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : isPreferencesError ? (
                    <div className="text-center py-6">
                      <p className="text-neutral-dark">Failed to load trip requests. Please try again later.</p>
                    </div>
                  ) : tripPreferences && tripPreferences.length > 0 ? (
                    <div className="space-y-6">
                      {tripPreferences
                        .filter(preference => !itineraries?.some(i => i.tripPreferenceId === preference.id))
                        .map((preference, index) => (
                          <div key={index} className="border rounded-lg p-5 hover:border-primary transition-colors cursor-pointer" onClick={() => handleTripPreferenceSelect(preference)}>
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="font-medium text-lg">{preference.destination} Trip Request</h3>
                              <Badge variant="outline">
                                {preference.budget.charAt(0).toUpperCase() + preference.budget.slice(1)}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-neutral-dark">Travel Dates</p>
                                <p className="font-medium">
                                  {new Date(preference.startDate).toLocaleDateString()} - {new Date(preference.endDate).toLocaleDateString()}
                                </p>
                              </div>
                              
                              <div>
                                <p className="text-sm text-neutral-dark">Traveler</p>
                                <p className="font-medium">ID: {preference.travelerId}</p>
                              </div>
                              
                              <div>
                                <p className="text-sm text-neutral-dark">Requested</p>
                                <p className="font-medium">
                                  {new Date(preference.createdAt).toLocaleDateString()}
                                </p>
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
                              <div className="mb-4">
                                <p className="text-sm text-neutral-dark mb-1">Additional Information</p>
                                <p className="text-neutral-dark">{preference.additionalInfo}</p>
                              </div>
                            )}
                            
                            <div className="flex justify-end">
                              <Button onClick={(e) => {
                                e.stopPropagation();
                                handleTripPreferenceSelect(preference);
                              }}>
                                Create Itinerary
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-neutral-light rounded-lg">
                      <p className="text-neutral-dark">No new trip requests at the moment.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Itineraries Tab */}
            <TabsContent value="itineraries">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>Active Itineraries</CardTitle>
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
                                    <User className="h-4 w-4 mr-1" />
                                    <span>Traveler ID: {itinerary.travelerId}</span>
                                  </div>
                                  <span className="hidden sm:inline mx-2">•</span>
                                  <div className="flex items-center mt-1 sm:mt-0">
                                    <CreditCard className="h-4 w-4 mr-1" />
                                    <span>${itinerary.totalPrice.toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <Badge variant={itinerary.status === "completed" ? "secondary" : "default"}>
                                  {itinerary.status.charAt(0).toUpperCase() + itinerary.status.slice(1)}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-neutral-light rounded-lg">
                          <p className="text-neutral-dark">No active itineraries at the moment.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Pending Proposals</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isLoadingItineraries ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      ) : isItinerariesError ? (
                        <div className="text-center py-6">
                          <p className="text-neutral-dark">Failed to load proposals. Please try again later.</p>
                        </div>
                      ) : proposedItineraries.length > 0 ? (
                        <div className="space-y-4">
                          {proposedItineraries.map((itinerary, index) => (
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
                                    <span>Proposed {new Date(itinerary.updatedAt).toLocaleDateString()}</span>
                                  </div>
                                  <span className="hidden sm:inline mx-2">•</span>
                                  <div className="flex items-center mt-1 sm:mt-0">
                                    <CreditCard className="h-4 w-4 mr-1" />
                                    <span>${itinerary.totalPrice.toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                Awaiting Response
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-neutral-light rounded-lg">
                          <p className="text-neutral-dark">No pending proposals at the moment.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <div className="lg:col-span-1">
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>Drafts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isLoadingItineraries ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      ) : isItinerariesError ? (
                        <div className="text-center py-6">
                          <p className="text-neutral-dark">Failed to load drafts. Please try again later.</p>
                        </div>
                      ) : draftItineraries.length > 0 ? (
                        <div className="space-y-4">
                          {draftItineraries.map((itinerary, index) => (
                            <div 
                              key={index} 
                              className="bg-neutral-light rounded-lg p-4 cursor-pointer hover:bg-neutral-medium/50 transition-colors"
                              onClick={() => setLocation(`/itinerary/${itinerary.id}`)}
                            >
                              <div className="flex justify-between items-center mb-2">
                                <h3 className="font-medium">{itinerary.title}</h3>
                                <Badge variant="outline">Draft</Badge>
                              </div>
                              <p className="text-sm text-neutral-dark mb-3 line-clamp-2">{itinerary.description}</p>
                              <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1 text-neutral-dark" />
                                  <span className="text-neutral-dark">
                                    {new Date(itinerary.updatedAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <span className="text-primary font-medium">Continue Editing</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 bg-neutral-light rounded-lg">
                          <p className="text-neutral-dark">No draft itineraries.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-primary/10 p-2 rounded-full mr-3">
                              <Check className="h-4 w-4 text-primary" />
                            </div>
                            <span>Acceptance Rate</span>
                          </div>
                          <span className="font-medium">
                            {itineraries && itineraries.length > 0 
                              ? `${Math.round((confirmedItineraries.length / proposedItineraries.length) * 100) || 0}%` 
                              : "N/A"}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-primary/10 p-2 rounded-full mr-3">
                              <BarChart2 className="h-4 w-4 text-primary" />
                            </div>
                            <span>Average Trip Value</span>
                          </div>
                          <span className="font-medium">
                            {confirmedItineraries.length > 0 
                              ? `$${Math.round(confirmedItineraries.reduce((sum, i) => sum + i.totalPrice, 0) / confirmedItineraries.length).toLocaleString()}` 
                              : "$0"}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-primary/10 p-2 rounded-full mr-3">
                              <Clock className="h-4 w-4 text-primary" />
                            </div>
                            <span>Response Time</span>
                          </div>
                          <span className="font-medium">24 hrs</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Messages Tab */}
            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Traveler Messages</CardTitle>
                    <Button onClick={() => setLocation('/messages')}>Open Inbox</Button>
                  </div>
                  <CardDescription>
                    Messages from travelers interested in your services
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
                                  <h3 className="font-medium mr-2">Traveler #{contactId}</h3>
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
                      <p className="text-neutral-dark">You don't have any messages yet.</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => setLocation('/messages')}>
                    View All Messages
                  </Button>
                </CardFooter>
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
                        <p className="text-neutral-dark mb-2">{user.email}</p>
                        <Badge className="mb-4 capitalize">{user.role}</Badge>
                        <Button variant="outline" className="w-full mb-4">Edit Profile</Button>
                        <Button variant="outline" className="w-full">View Public Profile</Button>
                      </div>
                      
                      <Separator className="my-6" />
                      
                      {/* Quick Stats */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-dark">Completed Trips</span>
                          <span className="font-medium">
                            {confirmedItineraries.filter(i => i.status === "completed").length}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-dark">Active Itineraries</span>
                          <span className="font-medium">
                            {confirmedItineraries.filter(i => i.status === "confirmed").length}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-dark">Pending Proposals</span>
                          <span className="font-medium">{proposedItineraries.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-dark">Drafts</span>
                          <span className="font-medium">{draftItineraries.length}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="lg:col-span-2">
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>Agent Profile Details</CardTitle>
                      <CardDescription>Update your professional profile information</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Basic Information */}
                        <div>
                          <h3 className="font-medium mb-4">Basic Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm text-neutral-dark mb-1">Full Name</label>
                              <Input defaultValue={user.fullName} />
                            </div>
                            <div>
                              <label className="block text-sm text-neutral-dark mb-1">Email</label>
                              <Input defaultValue={user.email} />
                            </div>
                            <div>
                              <label className="block text-sm text-neutral-dark mb-1">Specialization</label>
                              <Input placeholder="e.g., Luxury Travel, Adventure Tours" />
                            </div>
                            <div>
                              <label className="block text-sm text-neutral-dark mb-1">Years of Experience</label>
                              <Input type="number" min="0" placeholder="e.g., 5" />
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        {/* Professional Details */}
                        <div>
                          <h3 className="font-medium mb-4">Professional Details</h3>
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <label className="block text-sm text-neutral-dark mb-1">Bio</label>
                              <Textarea 
                                placeholder="Tell travelers about your expertise and experience..."
                                className="min-h-24"
                                defaultValue={user.bio || ""}
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-neutral-dark mb-1">Languages</label>
                              <Input placeholder="e.g., English, Spanish, French" />
                            </div>
                            <div>
                              <label className="block text-sm text-neutral-dark mb-1">Regions of Expertise</label>
                              <Input placeholder="e.g., Europe, Southeast Asia, Caribbean" />
                            </div>
                            <div>
                              <label className="block text-sm text-neutral-dark mb-1">Travel Styles</label>
                              <Input placeholder="e.g., Adventure, Luxury, Family, Cultural" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button>Save Profile Changes</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Notification Settings */}
                        <div>
                          <h3 className="font-medium mb-4">Notification Preferences</h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Email Notifications</p>
                                <p className="text-sm text-neutral-dark">Receive updates about new trip requests</p>
                              </div>
                              <input type="checkbox" defaultChecked className="toggle toggle-primary" />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Message Alerts</p>
                                <p className="text-sm text-neutral-dark">Get notified about new messages</p>
                              </div>
                              <input type="checkbox" defaultChecked className="toggle toggle-primary" />
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        {/* Security Settings */}
                        <div>
                          <h3 className="font-medium mb-4">Security</h3>
                          <Button variant="outline">Change Password</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
      
      {/* Create Itinerary Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Itinerary</DialogTitle>
            <DialogDescription>
              {selectedTripPreference && (
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Badge variant="outline">
                    <MapPin className="h-3 w-3 mr-1" />
                    {selectedTripPreference.destination}
                  </Badge>
                  <Badge variant="outline">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(selectedTripPreference.startDate).toLocaleDateString()} - {new Date(selectedTripPreference.endDate).toLocaleDateString()}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    <CreditCard className="h-3 w-3 mr-1" />
                    {selectedTripPreference.budget}
                  </Badge>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateItinerary)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Itinerary Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., European Adventure - 10 Days" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="totalPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Total cost in USD" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the itinerary and its highlights..."
                        className="min-h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="proposed">Propose to Traveler</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Save as draft to edit later, or propose to send to the traveler for review
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div>
                <h3 className="font-medium mb-4">Daily Itinerary</h3>
                <div className="space-y-6">
                  {itineraryDetails.map((day, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Day {day.day}</h4>
                        {itineraryDetails.length > 1 && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeItineraryDay(index)}
                          >
                            Remove Day
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm text-neutral-dark mb-1">Activities</label>
                          <Textarea
                            placeholder="Describe the day's activities, sightseeing, experiences..."
                            value={day.activities}
                            onChange={(e) => updateItineraryDay(index, 'activities', e.target.value)}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm text-neutral-dark mb-1">Accommodation</label>
                            <Input
                              placeholder="Where will they stay?"
                              value={day.accommodation}
                              onChange={(e) => updateItineraryDay(index, 'accommodation', e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm text-neutral-dark mb-1">Meals</label>
                            <Input
                              placeholder="e.g., Breakfast included"
                              value={day.meals}
                              onChange={(e) => updateItineraryDay(index, 'meals', e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm text-neutral-dark mb-1">Transportation</label>
                            <Input
                              placeholder="e.g., Private transfer"
                              value={day.transportation}
                              onChange={(e) => updateItineraryDay(index, 'transportation', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addItineraryDay}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Day
                  </Button>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Itinerary</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgentDashboardPage;
