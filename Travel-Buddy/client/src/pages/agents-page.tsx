import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AgentCard from "@/components/AgentCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import TravelStyleSelector from "@/components/TravelStyleSelector";
import { AgentProfile, User } from "@shared/schema";
import { Loader2, Search, X } from "lucide-react";
import { budgetRanges } from "@/assets/destinations";

type AgentWithProfile = AgentProfile & User;

const AgentsPage = () => {
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("any");
  const [filteredAgents, setFilteredAgents] = useState<AgentWithProfile[]>([]);
  
  // Get search params from URL
  const search = useSearch();
  const params = new URLSearchParams(search);
  const urlDestination = params.get("destination") || "";
  const urlBudget = params.get("budget") || "any";
  
  // Fetch all agents
  const { data: agents, isLoading, isError } = useQuery<AgentWithProfile[]>({
    queryKey: ["/api/agents"],
  });
  
  // Set initial filter values from URL params
  useEffect(() => {
    if (urlBudget) {
      setSelectedBudget(urlBudget);
    }
    if (urlDestination) {
      setSearchQuery(urlDestination);
    }
  }, [urlDestination, urlBudget]);
  
  // Filter agents based on search and filters
  useEffect(() => {
    if (!agents) return;
    
    let filtered = [...agents];
    
    // Filter by search query (name, specialization, regions)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        agent =>
          agent.fullName.toLowerCase().includes(query) ||
          agent.specialization.toLowerCase().includes(query) ||
          agent.regions.some(region => region.toLowerCase().includes(query))
      );
    }
    
    // Filter by travel styles
    if (selectedStyles.length > 0) {
      filtered = filtered.filter(agent =>
        agent.travelStyles.some(style =>
          selectedStyles.includes(style.toLowerCase())
        )
      );
    }
    
    // Filter by budget (this would be more meaningful with actual budget data)
    // For now, just simulate filtering
    if (selectedBudget && selectedBudget !== "any") {
      // Just a placeholder logic - in a real app, this would filter based on agent's price range
      filtered = filtered.filter(agent => {
        if (selectedBudget === "budget") return agent.experience <= 3;
        if (selectedBudget === "moderate") return agent.experience > 3 && agent.experience <= 7;
        if (selectedBudget === "luxury") return agent.experience > 7;
        return true;
      });
    }
    
    setFilteredAgents(filtered);
  }, [agents, searchQuery, selectedStyles, selectedBudget]);
  
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedStyles([]);
    setSelectedBudget("any");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-neutral-light py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-heading font-bold mb-2">Travel Agents</h1>
              <p className="text-neutral-dark">
                Find the perfect travel expert to create your dream trip
              </p>
            </div>
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search by name, specialization, or region..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 w-full md:w-80"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setSearchQuery("")}
                >
                  <X size={16} />
                </Button>
              )}
            </div>
          </div>
          
          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="w-full md:w-1/3">
                <label className="block text-sm font-medium text-neutral-dark mb-1">Travel Style</label>
                <TravelStyleSelector
                  selectedStyles={selectedStyles}
                  onStylesChange={setSelectedStyles}
                />
              </div>
              <div className="w-full md:w-1/4">
                <label className="block text-sm font-medium text-neutral-dark mb-1">Budget Range</label>
                <Select value={selectedBudget} onValueChange={setSelectedBudget}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any budget</SelectItem>
                    {budgetRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full md:w-auto"
                disabled={!searchQuery && !selectedStyles.length && selectedBudget === "any"}
              >
                Clear Filters
              </Button>
            </div>
          </div>
          
          {/* Results */}
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="text-center py-16">
              <p className="text-red-500">Failed to load agents. Please try again later.</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          ) : filteredAgents.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-medium mb-2">No travel agents found</h3>
              <p className="text-neutral-dark mb-6">
                Try adjusting your filters or search criteria
              </p>
              <Button onClick={clearFilters}>Clear All Filters</Button>
            </div>
          ) : (
            <>
              <p className="mb-6 text-neutral-dark">
                Found {filteredAgents.length} travel agent{filteredAgents.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAgents.map((agent) => (
                  <AgentCard key={agent.id} agent={agent} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AgentsPage;
