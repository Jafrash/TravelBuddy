import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { AgentProfile, User } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface AgentCardProps {
  agent: AgentProfile & User;
}

const AgentCard = ({ agent }: AgentCardProps) => {
  const getInitials = (name: string) => {
    return name.split(" ")
      .map(part => part.charAt(0))
      .join("")
      .toUpperCase();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="relative">
        {/* Default background image for agent profile */}
        <img 
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
          alt={`${agent.fullName}'s profile`} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
          <Badge variant="secondary" className="bg-primary/90 text-white">
            {agent.specialization}
          </Badge>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-semibold text-xl">{agent.fullName}</h3>
          <div className="flex items-center">
            <span className="text-yellow-500 mr-1">{agent.rating || "New"}</span>
            <div className="flex">
              {agent.rating ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <Star 
                    key={index} 
                    className={`h-4 w-4 ${index < (agent.rating || 0) ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}`} 
                  />
                ))
              ) : (
                <span className="text-xs text-gray-500 ml-1">No ratings yet</span>
              )}
            </div>
          </div>
        </div>
        <p className="text-neutral-dark mb-4">{agent.bio || `Specialist in ${agent.specialization} with ${agent.experience}+ years of planning custom itineraries.`}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {agent.travelStyles.slice(0, 3).map((style, index) => (
            <span key={index} className="px-2 py-1 bg-neutral-medium rounded-full text-xs">
              {style}
            </span>
          ))}
        </div>
        <div className="flex items-center text-sm text-neutral-dark mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          <span>{agent.languages.join(", ")}</span>
        </div>
        <Link href={`/agents/${agent.id}`}>
          <Button className="w-full bg-primary hover:bg-primary/90 text-white">View Profile</Button>
        </Link>
      </div>
    </div>
  );
};

export default AgentCard;
