import { Link } from "wouter";
import { MapPin, Facebook, Twitter, Instagram, Compass } from "lucide-react";

// Greatly simplified Footer component to avoid recursion issues
const Footer = () => {
  return (
    <footer className="bg-neutral-dark text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-3">
              <MapPin className="h-6 w-6 text-white" />
              <span className="ml-2 text-lg font-heading font-bold">Wanderwise</span>
            </div>
            <p className="text-neutral-medium mb-3 text-sm">
              Connecting travelers with expert travel agents.
            </p>
            <div className="flex space-x-3">
              <span className="text-white hover:text-accent transition-colors cursor-pointer">
                <Facebook size={16} />
              </span>
              <span className="text-white hover:text-accent transition-colors cursor-pointer">
                <Twitter size={16} />
              </span>
              <span className="text-white hover:text-accent transition-colors cursor-pointer">
                <Instagram size={16} />
              </span>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-base mb-3">For Travelers</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href="/" className="text-neutral-medium hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/agents" className="text-neutral-medium hover:text-white transition-colors">
                  Find an Agent
                </Link>
              </li>
            </ul>
          </div>
          
          {/* For Agents */}
          <div>
            <h3 className="font-heading font-semibold text-base mb-3">For Agents</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href="/auth" className="text-neutral-medium hover:text-white transition-colors">
                  Join Our Network
                </Link>
              </li>
              <li>
                <Link href="/dashboard/agent" className="text-neutral-medium hover:text-white transition-colors">
                  Agent Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-6 pt-4 text-center text-neutral-medium text-xs">
          <p>&copy; {new Date().getFullYear()} Wanderwise. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
