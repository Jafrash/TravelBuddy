import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AgentProfile, User } from "@shared/schema";
import AgentCard from "./AgentCard";
import { ChevronRight } from "lucide-react";

type AgentWithProfile = AgentProfile & User;

const FeaturedAgents = () => {
  const { data: agents, isLoading, isError } = useQuery<AgentWithProfile[]>({
    queryKey: ["/api/agents"],
  });

  return (
    <section className="py-16 md:py-24 bg-neutral-light">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Featured Travel Experts
            </h2>
            <p className="text-neutral-dark max-w-2xl">
              Connect with our top-rated travel agents who create exceptional experiences.
            </p>
          </div>
          <Link href="/agents" className="hidden md:block text-primary font-medium hover:underline">
            View All Agents
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-soft overflow-hidden h-96 animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-8 bg-gray-200 rounded w-full mt-auto"></div>
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-10">
            <p className="text-red-500">Failed to load agents. Please try again later.</p>
          </div>
        ) : agents && agents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {agents.slice(0, 3).map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p>No travel agents available at the moment. Please check back later.</p>
          </div>
        )}
        
        <div className="text-center mt-10 md:hidden">
          <Link href="/agents">
            <Button variant="link" className="text-primary font-medium">
              View All Agents <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedAgents;
