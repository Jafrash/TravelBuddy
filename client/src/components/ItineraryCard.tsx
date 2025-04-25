import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check } from "lucide-react";

interface ItineraryHighlight {
  text: string;
}

interface ItineraryProps {
  itinerary: {
    id: number;
    title: string;
    subtitle: string;
    image: string;
    agentName: string;
    agentImage: string;
    price: string;
    description: string;
    highlights: string[];
  };
}

const ItineraryCard = ({ itinerary }: ItineraryProps) => {
  return (
    <div className="bg-neutral-light rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="relative">
        <img 
          src={itinerary.image}
          alt={itinerary.title} 
          className="w-full h-64 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
          <h3 className="font-accent text-2xl font-bold">{itinerary.title}</h3>
          <p className="text-sm">{itinerary.subtitle}</p>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Avatar className="mr-3">
              <AvatarImage src={itinerary.agentImage} alt={itinerary.agentName} />
              <AvatarFallback>{itinerary.agentName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-medium">By {itinerary.agentName}</span>
          </div>
          <span className="text-sm text-neutral-dark">{itinerary.price}</span>
        </div>
        
        <p className="text-neutral-dark mb-4">
          {itinerary.description}
        </p>
        
        <div className="border-t border-neutral-medium pt-4">
          <h4 className="font-medium mb-2">Highlights:</h4>
          <ul className="text-sm text-neutral-dark space-y-1">
            {itinerary.highlights.map((highlight, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 mr-2 h-5 w-5 bg-secondary rounded-full flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </span>
                {highlight}
              </li>
            ))}
          </ul>
        </div>
        
        <Button className="w-full mt-6 bg-accent hover:bg-accent/90 text-white">
          View Full Itinerary
        </Button>
      </div>
    </div>
  );
};

export default ItineraryCard;
