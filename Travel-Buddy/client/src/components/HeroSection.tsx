import { Link } from "wouter";
import SearchForm from "./SearchForm";

const HeroSection = () => {
  return (
    <section className="relative bg-primary text-white">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80" 
          alt="Scenic travel destination" 
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      
      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-accent text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Personalized Travel Experiences
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Connect with experienced travel agents who create customized itineraries based on your preferences, interests, and budget.
          </p>
          
          <SearchForm />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
