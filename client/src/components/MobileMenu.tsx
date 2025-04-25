import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { User } from "@shared/schema";
import { X, MapPin } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onLogout: () => void;
}

const MobileMenu = ({ isOpen, onClose, user, onLogout }: MobileMenuProps) => {
  const getDashboardLink = () => {
    return user?.role === "agent" ? "/dashboard/agent" : "/dashboard/traveler";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50">
      <div className="bg-white h-full w-4/5 max-w-sm py-8 px-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="flex items-center">
            <MapPin className="h-7 w-7 text-primary" />
            <span className="ml-2 text-lg font-heading font-bold text-neutral-dark">Wanderwise</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6 text-neutral-dark" />
          </Button>
        </div>
        
        <nav className="mb-8">
          <ul className="space-y-4">
            <li>
              <Link href="/">
                <a onClick={onClose} className="block py-2 text-lg font-medium text-neutral-dark hover:text-primary transition-colors">
                  Home
                </a>
              </Link>
            </li>
            <li>
              <Link href="/agents">
                <a onClick={onClose} className="block py-2 text-lg font-medium text-neutral-dark hover:text-primary transition-colors">
                  Find Agents
                </a>
              </Link>
            </li>
            {user && (
              <>
                <li>
                  <Link href={getDashboardLink()}>
                    <a onClick={onClose} className="block py-2 text-lg font-medium text-neutral-dark hover:text-primary transition-colors">
                      Dashboard
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/messages">
                    <a onClick={onClose} className="block py-2 text-lg font-medium text-neutral-dark hover:text-primary transition-colors">
                      Messages
                    </a>
                  </Link>
                </li>
              </>
            )}
            <li>
              <a href="#" className="block py-2 text-lg font-medium text-neutral-dark hover:text-primary transition-colors">
                About Us
              </a>
            </li>
          </ul>
        </nav>
        
        <div className="space-y-4">
          {user ? (
            <Button className="w-full" onClick={() => { onLogout(); onClose(); }}>
              Log Out
            </Button>
          ) : (
            <>
              <Link href="/auth">
                <Button variant="outline" onClick={onClose} className="w-full">
                  Log In
                </Button>
              </Link>
              <Link href="/auth">
                <Button onClick={onClose} className="w-full">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
