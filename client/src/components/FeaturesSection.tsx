import { Shield, Clock, MessageSquare, LayoutDashboard, Map, CreditCard } from "lucide-react";

const features = [
  {
    icon: <Shield className="h-6 w-6 text-primary" />,
    title: "Verified Travel Experts",
    description: "All our travel agents are thoroughly vetted for their expertise, credentials, and customer service. We only work with the best."
  },
  {
    icon: <Clock className="h-6 w-6 text-primary" />,
    title: "Save Time Planning",
    description: "Skip hours of research and comparing options. Our experts do the hard work for you based on your preferences and budget."
  },
  {
    icon: <MessageSquare className="h-6 w-6 text-primary" />,
    title: "Direct Communication",
    description: "Chat or video call with your travel agent to co-create your perfect trip, ensuring all your needs and preferences are met."
  },
  {
    icon: <LayoutDashboard className="h-6 w-6 text-primary" />,
    title: "All-in-One Dashboard",
    description: "Access your complete itinerary, bookings, travel documents, and real-time updates in one convenient dashboard."
  },
  {
    icon: <Map className="h-6 w-6 text-primary" />,
    title: "Local Expertise",
    description: "Our agents provide insider knowledge and access to hidden gems, local favorites, and authentic experiences not found in guidebooks."
  },
  {
    icon: <CreditCard className="h-6 w-6 text-primary" />,
    title: "Transparent Pricing",
    description: "No hidden fees or surprise costs. You'll see clear pricing for all services, with the ability to adjust based on your budget."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-neutral-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Why Choose Wanderwise
          </h2>
          <p className="text-neutral-dark max-w-2xl mx-auto">
            Our platform offers unique advantages to make your travel planning seamless and exceptional.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="font-heading font-semibold text-xl mb-3">
                {feature.title}
              </h3>
              <p className="text-neutral-dark">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
