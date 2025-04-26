import Header from "@/components/Header";
import SimpleFooter from "@/components/SimpleFooter";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { GlobeIcon, Compass, Users, Sparkles, Users2, CalendarClock, MapPin, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import SearchForm from "@/components/SearchForm";
import { AgentProfile, User } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";

const HomePage = () => {
  // Get user authentication status
  const { user } = useAuth();
  
  // Fetch featured agents
  const { data: agents } = useQuery<(AgentProfile & User)[]>({
    queryKey: ['/api/agents'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Featured destinations
  const destinations = [
    {
      name: "Tokyo, Japan",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      description: "Explore the blend of traditional culture and modern technology"
    },
    {
      name: "Paris, France",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      description: "Experience the city of love and its iconic landmarks"
    },
    {
      name: "Bali, Indonesia",
      image: "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      description: "Relax on pristine beaches and immerse in rich cultural heritage"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 px-4 overflow-hidden bg-gradient-to-b from-blue-50 to-white">
          <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/70 to-purple-600/50" />
          </div>
          
          <div className="container mx-auto relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Your Personal AI Travel Assistant
              </h1>
              <p className="text-lg md:text-xl text-gray-800 mb-8">
                Connect with expert travel agents who craft personalized itineraries using AI-powered recommendations. Experience travel planning reimagined.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/agents">
                  <Button size="lg" className="px-8 font-medium">
                    Find Travel Agents
                  </Button>
                </Link>
                {!user && (
                  <Link href="/auth">
                    <Button size="lg" variant="outline" className="px-8 font-medium">
                      Log In / Sign Up
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Search Form */}
        <section className="py-14 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 -mt-20 relative z-20">
              <h2 className="text-2xl font-bold mb-6 text-center">Find Your Perfect Travel Experience</h2>
              <SearchForm />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How TravelBuddy Works</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our AI-powered platform makes travel planning simple, personalized, and stress-free.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Connect with Agents</h3>
                <p className="text-gray-600">
                  Browse profiles of expert travel agents specializing in your desired destinations.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">AI-Powered Planning</h3>
                <p className="text-gray-600">
                  Get personalized recommendations based on your preferences and travel style.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Compass className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Enjoy Your Journey</h3>
                <p className="text-gray-600">
                  Travel with confidence using your custom itinerary and 24/7 support.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Destinations */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Destinations</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover amazing places around the world with expert-crafted itineraries
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {destinations.map((destination, index) => (
                <div key={index} className="group overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-xl">
                  <div className="aspect-w-16 aspect-h-10 overflow-hidden">
                    <img 
                      src={destination.image} 
                      alt={destination.name} 
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                      {destination.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{destination.description}</p>
                    <Link href="/agents">
                      <Button variant="outline" size="sm">
                        Find Specialists
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Agents */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Expert Travel Agents</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Meet our expert travel specialists who will craft your perfect trip
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {agents && agents.length > 0 ? agents.slice(0, 3).map((agent: AgentProfile & User) => (
                <div key={agent.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <Users2 className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{agent.fullName || 'Expert Agent'}</h3>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-gray-600 text-sm">{agent.rating || 5} ({agent.reviewCount || 0} reviews)</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{agent.specialization || 'Travel Expert'}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {agent.regions && agent.regions.length > 0 && agent.regions.slice(0, 3).map((region: string, idx: number) => (
                        <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                          {region}
                        </span>
                      ))}
                    </div>
                    
                    <Link href={`/agents/${agent.id}`}>
                      <Button className="w-full" variant="outline">View Profile</Button>
                    </Link>
                  </div>
                </div>
              )) : (
                <div className="col-span-1 md:col-span-3 text-center py-8">
                  <p className="text-gray-500">Loading agents...</p>
                </div>
              )}
            </div>
            
            <div className="text-center mt-12">
              <Link href="/agents">
                <Button variant="outline" size="lg">
                  View All Agents
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Plan Your Dream Trip?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join TravelBuddy today and connect with expert travel agents who will create your perfect itinerary.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              {!user && (
                <Link href="/auth">
                  <Button size="lg" className="px-8 font-medium bg-white text-blue-600 hover:bg-gray-100">
                    Get Started
                  </Button>
                </Link>
              )}
              <Link href="/agents">
                <Button size="lg" variant="outline" className="px-8 font-medium border-white text-white hover:bg-blue-700">
                  Browse Agents
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SimpleFooter />
    </div>
  );
};

export default HomePage;
