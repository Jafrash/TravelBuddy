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
              <a href="#" className="text-white hover:text-accent transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-accent transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-accent transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-accent transition-colors">
                <Compass size={20} />
              </a>
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
                <a href="#" className="text-neutral-medium hover:text-white transition-colors">Browse Destinations</a>
              </li>
              <li>
                <a href="#" className="text-neutral-medium hover:text-white transition-colors">Travel Inspiration</a>
              </li>
              <li>
                <a href="#" className="text-neutral-medium hover:text-white transition-colors">Customer Reviews</a>
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
                <a href="#" className="text-neutral-medium hover:text-white transition-colors">Resources</a>
              </li>
              <li>
                <a href="#" className="text-neutral-medium hover:text-white transition-colors">Success Stories</a>
              </li>
              <li>
                <a href="#" className="text-neutral-medium hover:text-white transition-colors">Agent FAQ</a>
              </li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-neutral-medium hover:text-white transition-colors">About Us</a>
              </li>
              <li>
                <a href="#" className="text-neutral-medium hover:text-white transition-colors">Careers</a>
              </li>
              <li>
                <a href="#" className="text-neutral-medium hover:text-white transition-colors">Press</a>
              </li>
              <li>
                <a href="#" className="text-neutral-medium hover:text-white transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-neutral-medium hover:text-white transition-colors">Terms of Service</a>
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
