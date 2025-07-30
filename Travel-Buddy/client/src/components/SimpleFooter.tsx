import { Link } from "wouter";
import { MapPin, Github, Twitter, Instagram, Facebook } from "lucide-react";

export default function SimpleFooter() {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <MapPin className="h-6 w-6 text-blue-400" />
              <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">TravelBuddy</span>
            </div>
            <p className="text-gray-400">
              Connecting travelers with expert agents for personalized trip planning and memorable experiences.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/agents" className="text-gray-400 hover:text-white transition-colors">Find Agents</Link></li>
              <li><Link href="/auth" className="text-gray-400 hover:text-white transition-colors">Sign Up</Link></li>
              <li><Link href="/auth" className="text-gray-400 hover:text-white transition-colors">Login</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Destinations</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Tokyo, Japan</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Paris, France</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Bali, Indonesia</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">New York, USA</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6">
          <p className="text-center text-gray-400">
            &copy; {new Date().getFullYear()} TravelBuddy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}