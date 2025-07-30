import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Itinerary, Review } from "@shared/schema";
import {
  Calendar,
  CreditCard,
  Clock,
  MapPin,
  MessageCircle,
  Loader2,
  CheckCircle,
  ThumbsUp,
  Star,
  Clipboard,
  ChevronRight,
  User
} from "lucide-react";

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  proposed: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800"
};

const ItineraryPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  // Fetch itinerary
  const {
    data: itinerary,
    isLoading,
    isError,
    refetch
  } = useQuery<Itinerary>({
    queryKey: [`/api/itineraries/${id}`],
    enabled: !!id,
  });

  const handleStatusChange = async (newStatus: string) => {
    if (!itinerary) return;

    try {
      await apiRequest("PATCH", `/api/itineraries/${id}`, { status: newStatus });
      toast({
        title: "Status updated",
        description: `Itinerary status changed to ${newStatus}`,
      });
      refetch();
    } catch (error) {
      toast({
        title: "Failed to update status",
        description: "There was an error updating the itinerary status.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitReview = async () => {
    if (!user || !itinerary) return;

    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating from 1 to 5 stars.",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiRequest("POST", "/api/reviews", {
        agentId: itinerary.agentId,
        itineraryId: itinerary.id,
        rating,
        comment: commentText,
      });

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });

      setCommentText("");
      setRating(0);
      refetch();
    } catch (error) {
      toast({
        title: "Failed to submit review",
        description: "There was an error submitting your review.",
        variant: "destructive",
      });
    }
  };

  const handleContactAgent = async () => {
    if (!user || !itinerary) return;

    try {
      await apiRequest("POST", "/api/messages", {
        receiverId: itinerary.agentId,
        content: `Hi, I have a question about my itinerary "${itinerary.title}" (ID: ${itinerary.id})`,
      });

      toast({
        title: "Message sent",
        description: "Your message has been sent to the agent.",
      });

      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "There was an error sending your message.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
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

  if (isError || !itinerary) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="pt-6 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Itinerary Not Found</h1>
              <p className="mb-6">The itinerary you're looking for doesn't exist or you don't have permission to view it.</p>
              <Button onClick={() => window.history.back()}>Go Back</Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const isTraveler = user?.role === "traveler";
  const isAgent = user?.role === "agent";
  const canReview = isTraveler && itinerary.status === "completed";
  const canConfirm = isTraveler && itinerary.status === "proposed";
  const canPropose = isAgent && itinerary.status === "draft";
  const canComplete = isAgent && itinerary.status === "confirmed";

  const renderStarRating = (count: number, interactive = false) => {
    return (
      <div 
        className="flex" 
        onMouseLeave={() => {
          if (interactive) {
            setIsHovering(false);
            setHoverRating(0);
          }
        }}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              (interactive && ((isHovering && star <= hoverRating) || (!isHovering && star <= rating))) ||
              (!interactive && star <= count)
                ? "fill-yellow-500 text-yellow-500"
                : "text-gray-300"
            } ${interactive ? "cursor-pointer" : ""}`}
            onMouseEnter={() => {
              if (interactive) {
                setIsHovering(true);
                setHoverRating(star);
              }
            }}
            onClick={() => {
              if (interactive) {
                setRating(star);
                setIsHovering(false);
              }
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-neutral-light py-8">
        <div className="container mx-auto px-4">
          {/* Itinerary Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-heading font-bold">{itinerary.title}</h1>
                  <Badge className={statusColors[itinerary.status as keyof typeof statusColors] || "bg-gray-100"}>
                    {itinerary.status.charAt(0).toUpperCase() + itinerary.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-neutral-dark">{itinerary.description}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                {canConfirm && (
                  <Button onClick={() => handleStatusChange("confirmed")}>
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Confirm Itinerary
                  </Button>
                )}
                {canPropose && (
                  <Button onClick={() => handleStatusChange("proposed")}>
                    <Clipboard className="h-4 w-4 mr-2" />
                    Propose to Traveler
                  </Button>
                )}
                {canComplete && (
                  <Button onClick={() => handleStatusChange("completed")}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Completed
                  </Button>
                )}
                {isTraveler && (
                  <Button variant="outline" onClick={handleContactAgent}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Agent
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-primary mr-2" />
                <div>
                  <p className="text-sm text-neutral-dark">Total Price</p>
                  <p className="font-medium">${itinerary.totalPrice.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center">
                <User className="h-5 w-5 text-primary mr-2" />
                <div>
                  <p className="text-sm text-neutral-dark">
                    {isTraveler ? "Agent ID" : "Traveler ID"}
                  </p>
                  <p className="font-medium">
                    {isTraveler ? itinerary.agentId : itinerary.travelerId}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <Clock className="h-5 w-5 text-primary mr-2" />
                <div>
                  <p className="text-sm text-neutral-dark">Created</p>
                  <p className="font-medium">
                    {new Date(itinerary.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-primary mr-2" />
                <div>
                  <p className="text-sm text-neutral-dark">Last Updated</p>
                  <p className="font-medium">
                    {new Date(itinerary.updatedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="details">
            <TabsList className="mb-6">
              <TabsTrigger value="details">Itinerary Details</TabsTrigger>
              {canReview && <TabsTrigger value="review">Write Review</TabsTrigger>}
            </TabsList>

            <TabsContent value="details">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  {/* Daily Itinerary Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Daily Itinerary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-8">
                        {Array.isArray(itinerary.details) && itinerary.details.map((day, index) => (
                          <div key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                            <h3 className="font-bold text-lg mb-4 flex items-center">
                              <Badge variant="outline" className="mr-2 bg-primary/10">
                                Day {day.day}
                              </Badge>
                              {day.title || `Day ${day.day}`}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                              {day.activities && (
                                <div className="col-span-2">
                                  <h4 className="font-medium mb-2">Activities</h4>
                                  <p className="text-neutral-dark whitespace-pre-line">{day.activities}</p>
                                </div>
                              )}

                              {day.accommodation && (
                                <div>
                                  <div className="flex items-center mb-2">
                                    <MapPin className="h-4 w-4 text-primary mr-2" />
                                    <h4 className="font-medium">Accommodation</h4>
                                  </div>
                                  <p className="text-neutral-dark">{day.accommodation}</p>
                                </div>
                              )}

                              {day.meals && (
                                <div>
                                  <h4 className="font-medium mb-2">Meals</h4>
                                  <p className="text-neutral-dark">{day.meals}</p>
                                </div>
                              )}

                              {day.transportation && (
                                <div>
                                  <h4 className="font-medium mb-2">Transportation</h4>
                                  <p className="text-neutral-dark">{day.transportation}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-1">
                  {/* Notes & Information */}
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Trip Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium text-sm mb-1">Destination</h3>
                          <p className="text-neutral-dark">
                            {itinerary.title.split(" - ")[0] || "Custom destination"}
                          </p>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="font-medium text-sm mb-1">Contact Information</h3>
                          <div className="space-y-2">
                            {isTraveler ? (
                              <div className="flex items-center">
                                <User className="h-4 w-4 text-primary mr-2" />
                                <span>Agent ID: {itinerary.agentId}</span>
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <User className="h-4 w-4 text-primary mr-2" />
                                <span>Traveler ID: {itinerary.travelerId}</span>
                              </div>
                            )}
                            <div className="flex items-center">
                              <MessageCircle className="h-4 w-4 text-primary mr-2" />
                              <Link href={`/messages/${isTraveler ? itinerary.agentId : itinerary.travelerId}`}>
                                <a className="text-primary hover:underline">
                                  View Messages <ChevronRight className="inline h-3 w-3" />
                                </a>
                              </Link>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="font-medium text-sm mb-1">Booking Status</h3>
                          <Badge className={statusColors[itinerary.status as keyof typeof statusColors] || "bg-gray-100"}>
                            {itinerary.status.charAt(0).toUpperCase() + itinerary.status.slice(1)}
                          </Badge>
                        </div>
                      </div>

                      {isTraveler && itinerary.status === "proposed" && (
                        <div className="mt-6">
                          <Button className="w-full" onClick={() => handleStatusChange("confirmed")}>
                            <ThumbsUp className="h-4 w-4 mr-2" />
                            Confirm This Itinerary
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Payment Information Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-dark">Total Cost</span>
                          <span className="font-bold text-xl">${itinerary.totalPrice.toLocaleString()}</span>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="font-medium text-sm mb-2">Payment Status</h3>
                          <Badge variant={itinerary.status === "confirmed" || itinerary.status === "completed" ? "default" : "outline"}>
                            {itinerary.status === "confirmed" || itinerary.status === "completed" 
                              ? "Paid" 
                              : itinerary.status === "proposed" 
                                ? "Awaiting Confirmation" 
                                : "Not Paid"}
                          </Badge>
                        </div>

                        {isTraveler && itinerary.status === "proposed" && (
                          <Button className="w-full mt-4" variant="outline">
                            <CreditCard className="h-4 w-4 mr-2" />
                            View Payment Options
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {canReview && (
              <TabsContent value="review">
                <Card>
                  <CardHeader>
                    <CardTitle>Write a Review for This Trip</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-2">Rate Your Experience</h3>
                        <div className="flex items-center">
                          {renderStarRating(rating, true)}
                          <span className="ml-2 text-neutral-dark">
                            {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Click to rate'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">Share Your Experience</h3>
                        <Textarea
                          placeholder="Tell us about your trip experience and the agent's service..."
                          className="min-h-32"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                        />
                      </div>

                      <Button onClick={handleSubmitReview}>
                        Submit Review
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ItineraryPage;
