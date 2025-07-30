import { Button } from "@/components/ui/button";
import ItineraryCard from "./ItineraryCard";

const SampleItineraries = () => {
  // Sample itineraries data (in a real app, this would come from the API)
  const sampleItineraries = [
    {
      id: 1,
      title: "Classic Italian Journey",
      subtitle: "10 Days | Rome, Florence, Venice",
      image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      agentName: "Sarah Johnson",
      agentImage: "https://images.unsplash.com/photo-1534470190292-e4e3fd7e1a56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
      price: "From $3,200/person",
      description: "Experience Italy's cultural highlights with this perfect blend of guided tours and free time to explore. Visit iconic landmarks, enjoy authentic cuisine, and immerse yourself in Italian culture.",
      highlights: [
        "Private guided tour of the Vatican Museums and Colosseum",
        "Tuscan cooking class and wine tasting in Florence",
        "Sunset gondola ride in Venice with a local serenade"
      ]
    },
    {
      id: 2,
      title: "Thailand Adventure",
      subtitle: "12 Days | Bangkok, Chiang Mai, Phuket",
      image: "https://images.unsplash.com/photo-1513581166391-887a96ddeafd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      agentName: "David Chen",
      agentImage: "https://images.unsplash.com/photo-1507152832244-10d45c7eda57?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
      price: "From $2,800/person",
      description: "The perfect mix of culture, adventure, and relaxation. Explore bustling markets, ancient temples, lush jungles, and pristine beaches in this comprehensive Thai experience.",
      highlights: [
        "Street food tour with a local chef in Bangkok",
        "Ethical elephant sanctuary visit in Chiang Mai",
        "Island hopping tour by private longtail boat in Phuket"
      ]
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Sample Itineraries
          </h2>
          <p className="text-neutral-dark max-w-2xl mx-auto">
            Browse through some of our hand-crafted travel experiences.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sampleItineraries.map((itinerary) => (
            <ItineraryCard key={itinerary.id} itinerary={itinerary} />
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
            Browse More Itineraries
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SampleItineraries;
