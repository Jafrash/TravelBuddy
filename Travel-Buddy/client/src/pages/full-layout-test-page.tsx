import React from "react";
import Header from "@/components/Header";
import SimpleFooter from "@/components/SimpleFooter";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function FullLayoutTestPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="p-8 flex-grow">
        <h1 className="text-2xl font-bold mb-4">Component Testing Page</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Navigation Tests</h2>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => navigate("/header")}>Header Test Page</Button>
            <Button onClick={() => navigate("/simple")}>Minimal Test Page</Button>
            <Button onClick={() => navigate("/")}>This Page</Button>
            <Button onClick={() => navigate("/notfound")}>Not Found Page</Button>
            <Button onClick={() => navigate("/auth")}>Auth Page</Button>

          </div>
        </div>
          
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Component Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-md bg-green-50">
              <h3 className="font-medium text-green-800">Working Components</h3>
              <ul className="list-disc pl-5 mt-2 text-green-600">
                <li>Header component</li>
                <li>SimpleFooter component</li>
                <li>Basic navigation</li>
                <li>Auth context</li>
              </ul>
            </div>
            
            <div className="p-4 border rounded-md bg-amber-50">
              <h3 className="font-medium text-amber-800">Components with Issues</h3>
              <ul className="list-disc pl-5 mt-2 text-amber-600">
                <li>Footer component (using SimpleFooter instead)</li>
                <li>SelectItem component (value prop issue)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <SimpleFooter />
    </div>
  );
}