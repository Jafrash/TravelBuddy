import { Edit3, Users, ClipboardList } from "lucide-react";

const HowItWorks = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            How Wanderwise Works
          </h2>
          <p className="text-neutral-dark max-w-2xl mx-auto">
            We connect you with experienced travel agents who create personalized itineraries matching your preferences.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Edit3 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-heading font-semibold text-xl mb-3">
              Share Your Travel Preferences
            </h3>
            <p className="text-neutral-dark">
              Tell us where you want to go, when you're traveling, and what experiences you're looking for.
            </p>
          </div>
          
          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-heading font-semibold text-xl mb-3">
              Connect with Travel Experts
            </h3>
            <p className="text-neutral-dark">
              We'll match you with verified travel agents who specialize in your desired destination and travel style.
            </p>
          </div>
          
          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <ClipboardList className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-heading font-semibold text-xl mb-3">
              Get Your Perfect Itinerary
            </h3>
            <p className="text-neutral-dark">
              Collaborate with your agent to finalize your personalized travel plan with all bookings managed in one place.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
