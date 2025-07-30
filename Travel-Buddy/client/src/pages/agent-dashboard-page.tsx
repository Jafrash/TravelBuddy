import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Redirect } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import {
  MessageCircle,
  CalendarDays,
  Package,
  Users,
  FileEdit,
  BarChart3,
  CreditCard,
  Plus,
  Pencil,
  Trash2,
  Filter,
  Search,
  AlertCircle,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Itinerary, TripPreference } from "@shared/schema";

export default function AgentDashboardPage() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch agent's itineraries
  const {
    data: itineraries,
    isLoading: isLoadingItineraries,
    isError: isItinerariesError,
  } = useQuery<Itinerary[]>({
    queryKey: ["/api/itineraries/agent"],
    enabled: !!user && user.role === "agent",
  });

  // Fetch message counts (unread)
  const {
    data: messages,
    isLoading: isLoadingMessages,
  } = useQuery({
    queryKey: ["/api/messages"],
    enabled: !!user,
  });

  // Calculate unread messages count
  const unreadMessagesCount = messages?.filter(
    (msg) => msg.receiverId === user?.id && !msg.isRead
  ).length || 0;

  // Fetch trip preferences (matching opportunities)
  const {
    data: tripPreferences,
    isLoading: isLoadingPreferences,
  } = useQuery<TripPreference[]>({
    queryKey: ["/api/trip-preferences"],
    enabled: !!user && user.role === "agent",
  });

  // Redirect if not an agent
  if (user && user.role !== "agent") {
    return <Redirect to="/traveler-dashboard" />;
  }

  // Redirect if not logged in
  if (!user) {
    return <Redirect to="/auth" />;
  }

  // Mock data for demonstration purposes (remaining unchanged)
  const recentBookings = [
    {
      id: 1,
      travelerName: "Emma Watson",
      destination: "Tokyo, Japan",
      startDate: "2025-05-10",
      endDate: "2025-05-20",
      status: "Confirmed",
      amount: 3250,
    },
    {
      id: 2,
      travelerName: "Michael Chen",
      destination: "Paris, France",
      startDate: "2025-06-15",
      endDate: "2025-06-22",
      status: "Pending",
      amount: 2870,
    },
    {
      id: 3,
      travelerName: "Sarah Johnson",
      destination: "Bali, Indonesia",
      startDate: "2025-07-01",
      endDate: "2025-07-12",
      status: "Confirmed",
      amount: 3600,
    },
  ];

  const travelPackages = [
    {
      id: 1,
      title: "Japanese Cultural Immersion",
      duration: "10 days",
      destinations: ["Tokyo", "Kyoto", "Osaka"],
      price: 3200,
      bookings: 12,
    },
    {
      id: 2,
      title: "European Highlights Tour",
      duration: "14 days",
      destinations: ["Paris", "Rome", "Barcelona"],
      price: 4500,
      bookings: 8,
    },
    {
      id: 3,
      title: "Tropical Paradise Getaway",
      duration: "7 days",
      destinations: ["Bali", "Lombok"],
      price: 2200,
      bookings: 15,
    },
  ];

  const upcomingTasks = [
    {
      id: 1,
      title: "Confirm reservation for Emma Watson",
      dueDate: "2025-04-30",
      priority: "High",
    },
    {
      id: 2,
      title: "Send itinerary details to Michael Chen",
      dueDate: "2025-05-05",
      priority: "Medium",
    },
    {
      id: 3,
      title: "Book tour guide for Bali trip",
      dueDate: "2025-05-15",
      priority: "Medium",
    },
    {
      id: 4,
      title: "Prepare custom Tokyo itinerary",
      dueDate: "2025-05-02",
      priority: "High",
    },
  ];

  const revenueData = {
    total: 28750,
    pending: 5400,
    thisMonth: 9600,
    lastMonth: 8200,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Agent Dashboard</h1>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="packages">Packages</TabsTrigger>
            <TabsTrigger value="itineraries">Itineraries</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Statistics Cards */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{recentBookings.length}</div>
                  <p className="text-xs text-neutral-dark mt-1">
                    3 new in last 30 days
                  </p>
                  <Progress value={75} className="h-1 mt-3" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">${revenueData.total}</div>
                  <p className="text-xs text-neutral-dark mt-1">
                    +17% from last month
                  </p>
                  <Progress value={65} className="h-1 mt-3" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Clients
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">12</div>
                  <p className="text-xs text-neutral-dark mt-1">
                    5 new inquiries
                  </p>
                  <Progress value={85} className="h-1 mt-3" />
                </CardContent>
              </Card>
            </div>

            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>
                  Your latest travel bookings and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left pb-3 font-medium">Client</th>
                        <th className="text-left pb-3 font-medium">Destination</th>
                        <th className="text-left pb-3 font-medium">Date</th>
                        <th className="text-left pb-3 font-medium">Status</th>
                        <th className="text-left pb-3 font-medium">Amount</th>
                        <th className="text-right pb-3 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((booking) => (
                        <tr key={booking.id} className="border-b last:border-0">
                          <td className="py-3">{booking.travelerName}</td>
                          <td className="py-3">{booking.destination}</td>
                          <td className="py-3">
                            {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                          </td>
                          <td className="py-3">
                            <Badge
                              variant={
                                booking.status === "Confirmed"
                                  ? "success"
                                  : "warning"
                              }
                            >
                              {booking.status}
                            </Badge>
                          </td>
                          <td className="py-3">${booking.amount}</td>
                          <td className="py-3 text-right">
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Tasks */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Tasks</CardTitle>
                <CardDescription>
                  Tasks and deadlines that require your attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start justify-between p-3 bg-background rounded-lg"
                    >
                      <div className="flex items-start">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                            task.priority === "High"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }`}
                        ></div>
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <div className="flex items-center mt-1 text-sm text-neutral-dark">
                            <Clock className="h-3 w-3 mr-1" />
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Complete
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Manage Bookings</CardTitle>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Booking
                  </Button>
                </div>
                <CardDescription>
                  Add, modify, or cancel client bookings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-dark" />
                      <input
                        type="text"
                        placeholder="Search bookings..."
                        className="pl-9 pr-4 py-2 border rounded-md w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      Export
                    </Button>
                    <Button variant="outline" size="sm">
                      Print
                    </Button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left pb-3 font-medium">ID</th>
                        <th className="text-left pb-3 font-medium">Client</th>
                        <th className="text-left pb-3 font-medium">Destination</th>
                        <th className="text-left pb-3 font-medium">Travel Dates</th>
                        <th className="text-left pb-3 font-medium">Status</th>
                        <th className="text-left pb-3 font-medium">Payment</th>
                        <th className="text-right pb-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((booking) => (
                        <tr key={booking.id} className="border-b last:border-0">
                          <td className="py-3">#{booking.id}</td>
                          <td className="py-3">{booking.travelerName}</td>
                          <td className="py-3">{booking.destination}</td>
                          <td className="py-3">
                            {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                          </td>
                          <td className="py-3">
                            <Badge
                              variant={
                                booking.status === "Confirmed"
                                  ? "success"
                                  : "warning"
                              }
                            >
                              {booking.status}
                            </Badge>
                          </td>
                          <td className="py-3">${booking.amount}</td>
                          <td className="py-3 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button variant="ghost" size="icon">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Client List</CardTitle>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Client
                  </Button>
                </div>
                <CardDescription>
                  Access traveller details, preferences, and travel history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-dark" />
                      <input
                        type="text"
                        placeholder="Search clients..."
                        className="pl-9 pr-4 py-2 border rounded-md w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recentBookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center mb-4 mt-2">
                          <Avatar className="h-12 w-12 mr-4">
                            <AvatarFallback>
                              {booking.travelerName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{booking.travelerName}</h3>
                            <p className="text-sm text-neutral-dark">
                              Client since 2023
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-neutral-dark">Email:</span>
                            <span>client{booking.id}@example.com</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-dark">Phone:</span>
                            <span>+1 (555) 123-45{booking.id}8</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-dark">Last Trip:</span>
                            <span>{booking.destination}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-dark">Total Trips:</span>
                            <span>{booking.id + 1}</span>
                          </div>
                        </div>
                        <div className="flex justify-between mt-4">
                          <Link href={`/client/${booking.id}`}>
                            <Button variant="outline" size="sm">
                              View Profile
                            </Button>
                          </Link>
                          <Link href={`/messages?userId=${booking.id}`}>
                            <Button size="sm">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Message
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="packages" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Package Creation</CardTitle>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Package
                  </Button>
                </div>
                <CardDescription>
                  Create and customize travel packages for your clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {travelPackages.map((pkg) => (
                    <Card key={pkg.id}>
                      <CardContent className="p-0">
                        <div className="relative h-40 bg-primary/10">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Package className="h-16 w-16 text-primary" />
                          </div>
                          <div className="absolute top-3 right-3">
                            <Badge>
                              {pkg.bookings} booking{pkg.bookings !== 1 && "s"}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold mb-2">
                            {pkg.title}
                          </h3>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-neutral-dark">Duration:</span>
                            <span>{pkg.duration}</span>
                          </div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-neutral-dark">Price:</span>
                            <span>${pkg.price}/person</span>
                          </div>
                          <div className="flex justify-between text-sm mb-4">
                            <span className="text-neutral-dark">Destinations:</span>
                            <span>{pkg.destinations.join(", ")}</span>
                          </div>
                          <div className="flex justify-between">
                            <Button variant="outline" size="sm">
                              <Pencil className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="itineraries" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Itinerary Builder</CardTitle>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Itinerary
                  </Button>
                </div>
                <CardDescription>
                  Build detailed day-wise plans with activities and logistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingItineraries ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : isItinerariesError ? (
                  <div className="text-center py-6">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-2" />
                    <p className="text-neutral-dark">Failed to load itineraries. Please try again.</p>
                    <Button variant="outline" className="mt-4">
                      Retry
                    </Button>
                  </div>
                ) : itineraries && itineraries.length > 0 ? (
                  <div className="space-y-6">
                    {itineraries.map((itinerary) => (
                      <Card key={itinerary.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg mb-1">
                                {itinerary.title}
                              </h3>
                              <p className="text-sm text-neutral-dark mb-2">
                                {itinerary.destination} • {itinerary.days} days
                              </p>
                              <div className="flex items-center text-xs text-neutral-dark">
                                <CalendarDays className="h-3 w-3 mr-1" />
                                {new Date(itinerary.startDate).toLocaleDateString()} - {new Date(itinerary.endDate).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Link href={`/itinerary/${itinerary.id}/edit`}>
                                <Button variant="outline" size="sm">
                                  <Pencil className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                              </Link>
                              <Link href={`/itinerary/${itinerary.id}`}>
                                <Button size="sm">View</Button>
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Package className="h-16 w-16 text-neutral-dark/30 mx-auto mb-4" />
                    <p className="text-neutral-dark mb-4">No itineraries created yet.</p>
                    <Link href="/itinerary/new">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Itinerary
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Client Communication</CardTitle>
                  <Link href="/messages">
                    <Button>
                      Open Message Center
                    </Button>
                  </Link>
                </div>
                <CardDescription>
                  Chat with travelers, send updates and notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingMessages ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : messages && messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.slice(0, 5).map((message, index) => (
                      <div key={index} className="flex items-start p-3 bg-background rounded-lg">
                        <Avatar className="h-10 w-10 mr-3 mt-1">
                          <AvatarFallback>
                            {message.senderId === user?.id ? "Me" : "C" + message.senderId}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="font-medium">
                              {message.senderId === user?.id
                                ? `You → Client #${message.receiverId}`
                                : `Client #${message.senderId}`}
                            </div>
                            <div className="text-xs text-neutral-dark">
                              {new Date(message.sentAt).toLocaleString()}
                            </div>
                          </div>
                          <p className="text-sm text-neutral-dark">
                            {message.content}
                          </p>
                          {!message.isRead && message.receiverId === user?.id && (
                            <Badge variant="secondary" className="mt-2">
                              Unread
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <MessageCircle className="h-16 w-16 text-neutral-dark/30 mx-auto mb-4" />
                    <p className="text-neutral-dark">No messages yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reports & Analytics</CardTitle>
                <CardDescription>
                  View revenue, booking trends, and most popular packages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="text-sm font-medium text-neutral-dark mb-2">
                        Total Revenue
                      </h3>
                      <p className="text-2xl font-bold">${revenueData.total}</p>
                      <Progress value={85} className="h-1 mt-2" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="text-sm font-medium text-neutral-dark mb-2">
                        This Month
                      </h3>
                      <p className="text-2xl font-bold">${revenueData.thisMonth}</p>
                      <div className="flex items-center mt-2">
                        <Progress value={65} className="h-1 flex-1" />
                        <span className="text-xs text-emerald-600 ml-2">
                          +17%
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="text-sm font-medium text-neutral-dark mb-2">
                        Last Month
                      </h3>
                      <p className="text-2xl font-bold">${revenueData.lastMonth}</p>
                      <Progress value={55} className="h-1 mt-2" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="text-sm font-medium text-neutral-dark mb-2">
                        Pending
                      </h3>
                      <p className="text-2xl font-bold">${revenueData.pending}</p>
                      <Progress value={35} className="h-1 mt-2" />
                    </CardContent>
                  </Card>
                </div>

                <h3 className="font-semibold text-lg mb-4">Popular Packages</h3>
                <div className="space-y-4">
                  {travelPackages
                    .sort((a, b) => b.bookings - a.bookings)
                    .map((pkg) => (
                      <div
                        key={pkg.id}
                        className="flex items-center justify-between py-3 border-b last:border-0"
                      >
                        <div className="flex items-center">
                          <div className="bg-primary/10 p-2 rounded-full mr-3">
                            <Package className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{pkg.title}</h4>
                            <p className="text-sm text-neutral-dark">
                              {pkg.duration} • ${pkg.price}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{pkg.bookings}</div>
                          <div className="text-xs text-neutral-dark">
                            bookings
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payments Tracking</CardTitle>
                <CardDescription>
                  Track received and pending payments from travelers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-dark" />
                      <input
                        type="text"
                        placeholder="Search payments..."
                        className="pl-9 pr-4 py-2 border rounded-md w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      Download Report
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left pb-3 font-medium">ID</th>
                        <th className="text-left pb-3 font-medium">Client</th>
                        <th className="text-left pb-3 font-medium">Package</th>
                        <th className="text-left pb-3 font-medium">Amount</th>
                        <th className="text-left pb-3 font-medium">Date</th>
                        <th className="text-left pb-3 font-medium">Status</th>
                        <th className="text-right pb-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((booking, i) => (
                        <tr key={i} className="border-b last:border-0">
                          <td className="py-3">PAY-{1000 + i}</td>
                          <td className="py-3">{booking.travelerName}</td>
                          <td className="py-3">
                            {travelPackages[i % travelPackages.length].title}
                          </td>
                          <td className="py-3">${booking.amount}</td>
                          <td className="py-3">
                            {new Date(booking.startDate).toLocaleDateString()}
                          </td>
                          <td className="py-3">
                            <Badge
                              variant={
                                i === 1 ? "warning" : "success"
                              }
                            >
                              {i === 1 ? "Pending" : "Completed"}
                            </Badge>
                          </td>
                                                    <td className="py-3 text-right">
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}