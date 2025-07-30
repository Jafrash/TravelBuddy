import React from "react";
import Header from "@/components/Header";
import SimpleFooter from "@/components/SimpleFooter";
import ItineraryGenerator from "@/components/itinerary/ItineraryGenerator";

export default function AIItineraryPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow p-4 md:p-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">AI Itinerary Generator</h1>
          <ItineraryGenerator />
        </div>
      </main>
      <SimpleFooter />
    </div>
  );
}
