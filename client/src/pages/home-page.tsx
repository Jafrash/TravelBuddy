import Header from "@/components/Header";
import SimpleFooter from "@/components/SimpleFooter";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import FeaturedAgents from "@/components/FeaturedAgents";
import SampleItineraries from "@/components/SampleItineraries";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <HowItWorks />
        <FeaturedAgents />
        <SampleItineraries />
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <SimpleFooter />
    </div>
  );
};

export default HomePage;
