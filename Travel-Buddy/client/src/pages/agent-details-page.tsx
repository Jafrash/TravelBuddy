import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Star, 
  Calendar, 
  MessageCircle,
  Languages,
  Award,
  Briefcase,
  Globe,
  CheckCircle,
} from "lucide-react";
import { AgentProfile, User, Review } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AgentWithProfile = AgentProfile & User;
type ReviewWithTraveler = Review & { traveler: Pick<User, 'fullName' | 'profilePicture'> };

const AgentDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [messageDraft, setMessageDraft] = useState("");

  // Fetch agent details
  const { 
    data: agent, 
    isLoading: isLoadingAgent, 
    isError: isAgentError 
  } = useQuery<AgentWithProfile>({
    queryKey: [`/api/agents/${id}`],
  });

  // Fetch agent reviews
  const {
    data: reviews,
    isLoading: isLoadingReviews,
    isError: isReviewsError
  } = useQuery<ReviewWithTraveler[]>({
    queryKey: [`/api/reviews/agent/${id}`],
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to contact this agent",
        variant: "destructive"
      });
      return;
    }

    if (!messageDraft.trim()) {
      toast({
        title: "Message required",
        description: "Please enter a message",
        variant: "destructive"
      });
      return;
    }

    try {
      await apiRequest("POST", "/api/messages", {
        receiverId: parseInt(id),
        content: messageDraft
      });

      toast({
        title: "Message sent",
        description: "Your message has been sent to the agent"
      });
      
      setMessageDraft("");
      
      // Invalidate messages cache
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const renderRatingStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star 
        key={index} 
        className={`h-5 w-5 ${index < rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}`} 
      />
    ));
  };

  const getInitials = (name: string = "") => {
    return name.split(" ")
      .map(part => part.charAt(0))
      .join("")
      .toUpperCase();
  };

  if (isLoadingAgent) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isAgentError || !agent) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="pt-6 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Agent Not Found</h1>
              <p className="mb-6">The travel agent you're looking for doesn't exist or has been removed.</p>
              <Link href="/agents">
                <Button>View All Agents</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-neutral-light py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Agent Profile Sidebar */}
            <div className="lg:col-span-1">
              <Card className="overflow-hidden">
                <div className="relative h-48 bg-primary">
                  <div className="absolute left-0 right-0 -bottom-16 flex justify-center">
                    <Avatar className="h-32 w-32 ring-4 ring-white bg-white">
                      {agent.profilePicture ? (
                        <AvatarImage src={agent.profilePicture} alt={agent.fullName} />
                      ) : (
                        <AvatarFallback className="text-4xl">{getInitials(agent.fullName)}</AvatarFallback>
                      )}
                    </Avatar>
                  </div>
                </div>
                <CardContent className="pt-20 pb-6">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold mb-1">{agent.fullName}</h1>
                    <p className="text-neutral-dark mb-2">{agent.specialization}</p>
                    <div className="flex justify-center items-center">
                      {agent.rating ? (
                        <>
                          <span className="font-semibold mr-2">{agent.rating}</span>
                          <div className="flex">
                            {renderRatingStars(agent.rating)}
                          </div>
                          <span className="text-sm text-neutral-dark ml-2">({agent.reviewCount})</span>
                        </>
                      ) : (
                        <span className="text-sm text-neutral-dark">New Travel Agent</span>
                      )}
                    </div>
                    
                    {agent.isVerified && (
                      <div className="flex items-center justify-center mt-2 text-secondary">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">Verified Agent</span>
                      </div>
                    )}
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Briefcase className="h-5 w-5 text-primary mr-3" />
                      <div>
                        <div className="text-sm text-neutral-dark">Experience</div>
                        <div>{agent.experience} years</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Languages className="h-5 w-5 text-primary mr-3" />
                      <div>
                        <div className="text-sm text-neutral-dark">Languages</div>
                        <div>{agent.languages.join(", ")}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Globe className="h-5 w-5 text-primary mr-3" />
                      <div>
                        <div className="text-sm text-neutral-dark">Regions</div>
                        <div>{agent.regions.join(", ")}</div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="space-y-3">
                    <h3 className="font-medium">Travel Styles</h3>
                    <div className="flex flex-wrap gap-2">
                      {agent.travelStyles.map((style, index) => (
                        <Badge key={index} variant="secondary">{style}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  {user && user.role === "traveler" && (
                    <>
                      <Separator className="my-6" />
                      
                      <form onSubmit={handleSendMessage} className="space-y-3">
                        <h3 className="font-medium">Contact Agent</h3>
                        <textarea 
                          value={messageDraft}
                          onChange={(e) => setMessageDraft(e.target.value)}
                          className="w-full h-24 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Describe your travel plans and questions for this agent..."
                        ></textarea>
                        <div className="grid grid-cols-2 gap-3">
                          <Button type="submit" className="w-full">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Send Message
                          </Button>
                          <Link href="/messages">
                            <Button variant="outline" className="w-full">
                              <MessageCircle className="h-4 w-4 mr-2" />
                              View Messages
                            </Button>
                          </Link>
                        </div>
                      </form>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="about">
                <TabsList className="mb-6">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="itineraries">Sample Itineraries</TabsTrigger>
                </TabsList>
                
                <TabsContent value="about" className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold mb-4">About {agent.fullName}</h2>
                      <p className="text-neutral-dark whitespace-pre-line">
                        {agent.bio || `${agent.fullName} is a travel specialist with ${agent.experience} years of experience, focusing on ${agent.specialization}. 
                        
Specializing in destinations across ${agent.regions.join(", ")}, they create personalized travel experiences tailored to your preferences and budget.

Their expertise in ${agent.travelStyles.join(", ")} travel ensures you'll get a customized itinerary that matches exactly what you're looking for in your next adventure.`}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Why Choose {agent.fullName}</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start">
                          <div className="bg-primary/10 p-2 rounded-full mr-3">
                            <MapPin className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium mb-1">Local Expertise</h3>
                            <p className="text-sm text-neutral-dark">Insider knowledge of destinations across {agent.regions.join(", ")}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="bg-primary/10 p-2 rounded-full mr-3">
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium mb-1">Personalized Planning</h3>
                            <p className="text-sm text-neutral-dark">Custom itineraries based on your unique preferences</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="bg-primary/10 p-2 rounded-full mr-3">
                            <Award className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium mb-1">Experience</h3>
                            <p className="text-sm text-neutral-dark">{agent.experience} years of professional travel planning expertise</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="bg-primary/10 p-2 rounded-full mr-3">
                            <MessageCircle className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium mb-1">Direct Communication</h3>
                            <p className="text-sm text-neutral-dark">Continuous support before, during, and after your trip</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="reviews">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Traveler Reviews</h2>
                        {agent.rating ? (
                          <div className="flex items-center">
                            <span className="font-semibold text-lg mr-2">{agent.rating}</span>
                            <div className="flex">
                              {renderRatingStars(agent.rating)}
                            </div>
                            <span className="text-sm text-neutral-dark ml-2">({agent.reviewCount} reviews)</span>
                          </div>
                        ) : (
                          <span className="text-sm text-neutral-dark">No reviews yet</span>
                        )}
                      </div>

                      {isLoadingReviews ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      ) : isReviewsError ? (
                        <div className="text-center py-6">
                          <p className="text-neutral-dark">Failed to load reviews. Please try again later.</p>
                        </div>
                      ) : reviews && reviews.length > 0 ? (
                        <div className="space-y-6">
                          {reviews.map((review, index) => (
                            <div key={index} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                              <div className="flex items-start">
                                <Avatar className="h-10 w-10 mr-3">
                                  {review.traveler.profilePicture ? (
                                    <AvatarImage src={review.traveler.profilePicture} alt={review.traveler.fullName} />
                                  ) : (
                                    <AvatarFallback>{getInitials(review.traveler.fullName)}</AvatarFallback>
                                  )}
                                </Avatar>
                                <div>
                                  <div className="flex items-center mb-1">
                                    <h3 className="font-medium mr-2">{review.traveler.fullName}</h3>
                                    <div className="flex">
                                      {renderRatingStars(review.rating)}
                                    </div>
                                  </div>
                                  <p className="text-sm text-neutral-dark mb-2">
                                    {new Date(review.createdAt).toLocaleDateString('en-US', { 
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric' 
                                    })}
                                  </p>
                                  <p className="text-neutral-dark">{review.comment}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 bg-neutral-light rounded-lg">
                          <p className="text-neutral-dark">No reviews yet for this travel agent.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="itineraries">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold mb-6">Sample Itineraries</h2>
                      
                      {/* Sample Itineraries - in a production app, these would come from the API */}
                      <div className="space-y-6">
                        <div className="bg-neutral-light rounded-lg overflow-hidden border border-gray-200">
                          <div className="relative h-40">
                            <img 
                              src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                              alt="Italy itinerary" 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                              <h3 className="font-bold text-lg">{agent.regions.includes("Europe") ? "Classic Italian Journey" : "Cultural Exploration"}</h3>
                              <p className="text-sm">10 Days | Custom Experience</p>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex justify-between items-center mb-3">
                              <span className="font-medium">Highlights</span>
                              <span className="text-sm text-neutral-dark">From $3,200/person</span>
                            </div>
                            <ul className="text-sm text-neutral-dark space-y-2 mb-4">
                              <li className="flex items-start">
                                <CheckCircle className="h-4 w-4 text-secondary mr-2 flex-shrink-0" />
                                <span>Private guided tours of major attractions</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle className="h-4 w-4 text-secondary mr-2 flex-shrink-0" />
                                <span>Authentic local dining experiences</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle className="h-4 w-4 text-secondary mr-2 flex-shrink-0" />
                                <span>Boutique accommodations in prime locations</span>
                              </li>
                            </ul>
                            {user && user.role === "traveler" && (
                              <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" className="w-full" onClick={() => setMessageDraft(`Hi ${agent.fullName}, I'm interested in your ${agent.regions.includes("Europe") ? "Classic Italian Journey" : "Cultural Exploration"} itinerary. Can you tell me more about it?`)}>
                                  Request Itinerary
                                </Button>
                                <Link href="/messages">
                                  <Button variant="secondary" className="w-full">
                                    <MessageCircle className="h-4 w-4 mr-2" />
                                    Messages
                                  </Button>
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="bg-neutral-light rounded-lg overflow-hidden border border-gray-200">
                          <div className="relative h-40">
                            <img 
                              src="https://images.unsplash.com/photo-1513581166391-887a96ddeafd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                              alt="Adventure itinerary" 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                              <h3 className="font-bold text-lg">{agent.travelStyles.includes("Adventure") ? "Adventure Expedition" : "Natural Discovery"}</h3>
                              <p className="text-sm">12 Days | Active Experience</p>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex justify-between items-center mb-3">
                              <span className="font-medium">Highlights</span>
                              <span className="text-sm text-neutral-dark">From $3,800/person</span>
                            </div>
                            <ul className="text-sm text-neutral-dark space-y-2 mb-4">
                              <li className="flex items-start">
                                <CheckCircle className="h-4 w-4 text-secondary mr-2 flex-shrink-0" />
                                <span>Off-the-beaten-path destinations</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle className="h-4 w-4 text-secondary mr-2 flex-shrink-0" />
                                <span>Exciting outdoor activities and excursions</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle className="h-4 w-4 text-secondary mr-2 flex-shrink-0" />
                                <span>Balance of adventure and comfort</span>
                              </li>
                            </ul>
                            {user && user.role === "traveler" && (
                              <Button variant="outline" className="w-full" onClick={() => setMessageDraft(`Hi ${agent.fullName}, I'm interested in your ${agent.travelStyles.includes("Adventure") ? "Adventure Expedition" : "Natural Discovery"} itinerary. Can you tell me more about it?`)}>
                                Request Similar Itinerary
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center mt-6">
                        <p className="text-neutral-dark mb-4">
                          These are just examples of what {agent.fullName} can create for you. 
                          Contact them to discuss your personalized travel plan.
                        </p>
                        {user && user.role === "traveler" ? (
                          <Button onClick={() => setMessageDraft(`Hi ${agent.fullName}, I'm interested in creating a custom itinerary with you. Can we discuss my travel plans?`)}>
                            Start Planning My Trip
                          </Button>
                        ) : !user ? (
                          <Link href="/auth">
                            <Button>Sign Up to Start Planning</Button>
                          </Link>
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AgentDetailsPage;
