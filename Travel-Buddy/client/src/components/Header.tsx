import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin } from "lucide-react";
import MobileMenu from "./MobileMenu";

const Header = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Try to use AuthProvider but don't crash if it's not available
  let user = null;
  let logoutMutation = { mutate: () => {} };
  
  try {
    const auth = useAuth();
    user = auth.user;
    logoutMutation = auth.logoutMutation;
  } catch (e) {
    // Auth provider not available, gracefully handle this
    console.log("Auth provider not available, showing unauthenticated state");
  }

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getInitials = (name: string) => {
    return name.split(" ")
      .map(part => part.charAt(0))
      .join("")
      .toUpperCase();
  };

  const getDashboardLink = () => {
    return user?.role === "agent" ? "/dashboard/agent" : "/dashboard/traveler";
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <MapPin className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">TravelBuddy</span>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className={`font-medium ${location === "/" ? "text-primary" : "text-neutral-dark hover:text-primary"} transition-colors`}>
              Home
            </Link>
            <Link href="/explore" className={`font-medium ${location === "/explore" ? "text-primary" : "text-neutral-dark hover:text-primary"} transition-colors`}>
              Explore Places
            </Link>
            <Link href="/ai-itinerary" className={`font-medium ${location === "/ai-itinerary" ? "text-primary" : "text-neutral-dark hover:text-primary"} transition-colors`}>
              AI Itinerary
            </Link>
            {/* Only show "Find Agents" link for travelers or non-logged in users */}
            {(!user || user.role === "traveler") && (
              <Link href="/agents" className={`font-medium ${location === "/agents" ? "text-primary" : "text-neutral-dark hover:text-primary"} transition-colors`}>
                Find Agents
              </Link>
            )}
            {user && (
              <>
                <Link href={getDashboardLink()} className={`font-medium ${location.startsWith("/dashboard") ? "text-primary" : "text-neutral-dark hover:text-primary"} transition-colors`}>
                  Dashboard
                </Link>
                <Link href="/messages" className={`font-medium ${location.startsWith("/messages") ? "text-primary" : "text-neutral-dark hover:text-primary"} transition-colors`}>
                  Messages
                </Link>
              </>
            )}
          </nav>
          
          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link href={getDashboardLink()} className="block">
                  <Avatar>
                    {user.profilePicture ? (
                      <AvatarImage src={user.profilePicture} alt={user.fullName} />
                    ) : (
                      <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
                    )}
                  </Avatar>
                </Link>
                <Button variant="outline" onClick={handleLogout} className="hidden md:inline-flex">
                  Log Out
                </Button>
              </div>
            ) : (
              <Link href="/auth" className="inline-flex">
                <Button>Log In / Sign Up</Button>
              </Link>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden" 
              onClick={() => setMobileMenuOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </header>

      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
        user={user} 
        onLogout={handleLogout}
      />
    </>
  );
};

export default Header;
