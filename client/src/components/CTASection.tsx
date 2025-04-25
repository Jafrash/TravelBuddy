import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="relative py-16 md:py-24 bg-primary text-white">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80" 
          alt="Scenic travel backdrop" 
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-accent text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience Travel, Personalized?
          </h2>
          <p className="text-lg mb-8">
            Connect with expert travel agents who will design your perfect trip, tailored to your preferences.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/agents">
              <Button className="w-full sm:w-auto bg-white text-primary hover:bg-neutral-light">
                Find Your Travel Agent
              </Button>
            </Link>
            <Button variant="outline" className="w-full sm:w-auto border-2 border-white text-white hover:bg-white/10">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
