import { Link } from "wouter";
import { MapPin, Facebook, Twitter, Instagram, Compass } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-neutral-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <MapPin className="h-8 w-8 text-white" />
              <span className="ml-2 text-xl font-heading font-bold">Wanderwise</span>
            </div>
            <p className="text-neutral-medium mb-4">
              Connecting travelers with expert travel agents to create personalized, unforgettable travel experiences.
            </p>
            <div className="flex space-x-4">
              <span className="text-white hover:text-accent transition-colors cursor-pointer">
                <Facebook size={20} />
              </span>
              <span className="text-white hover:text-accent transition-colors cursor-pointer">
                <Twitter size={20} />
              </span>
              <span className="text-white hover:text-accent transition-colors cursor-pointer">
                <Instagram size={20} />
              </span>
              <span className="text-white hover:text-accent transition-colors cursor-pointer">
                <Compass size={20} />
              </span>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">For Travelers</h3>
            <ul className="space-y-2">
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
              <li>
                <span className="text-neutral-medium hover:text-white transition-colors cursor-pointer">Browse Destinations</span>
              </li>
              <li>
                <span className="text-neutral-medium hover:text-white transition-colors cursor-pointer">Travel Inspiration</span>
              </li>
              <li>
                <span className="text-neutral-medium hover:text-white transition-colors cursor-pointer">Customer Reviews</span>
              </li>
            </ul>
          </div>
          
          {/* For Agents */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">For Agents</h3>
            <ul className="space-y-2">
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
              <li>
                <span className="text-neutral-medium hover:text-white transition-colors cursor-pointer">Resources</span>
              </li>
              <li>
                <span className="text-neutral-medium hover:text-white transition-colors cursor-pointer">Success Stories</span>
              </li>
              <li>
                <span className="text-neutral-medium hover:text-white transition-colors cursor-pointer">Agent FAQ</span>
              </li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-neutral-medium hover:text-white transition-colors cursor-pointer">About Us</span>
              </li>
              <li>
                <span className="text-neutral-medium hover:text-white transition-colors cursor-pointer">Careers</span>
              </li>
              <li>
                <span className="text-neutral-medium hover:text-white transition-colors cursor-pointer">Press</span>
              </li>
              <li>
                <span className="text-neutral-medium hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
              </li>
              <li>
                <span className="text-neutral-medium hover:text-white transition-colors cursor-pointer">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-10 pt-8 text-center text-neutral-medium text-sm">
          <p>&copy; {new Date().getFullYear()} Wanderwise. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
