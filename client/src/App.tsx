import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

// Test pages
import TestPage from "@/pages/test-page";
import HeaderTestPage from "@/pages/header-test-page";
import FullLayoutTestPage from "@/pages/full-layout-test-page";
import AppTest from "@/pages/app-test";
import BasicTest from "@/pages/basic-test";

// Main application pages
import HomePage from "@/pages/home-page";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import AgentsPage from "@/pages/agents-page";
import AgentDetailsPage from "@/pages/agent-details-page";
import TravelerDashboardPage from "@/pages/traveler-dashboard-page";
import AgentDashboardPage from "@/pages/agent-dashboard-page";
import ItineraryPage from "@/pages/itinerary-page";
import MessagingPage from "@/pages/messaging-page";

function Router() {
  return (
    <Switch>
      {/* Main application routes */}
      <Route path="/" component={BasicTest} />
      <Route path="/app-test" component={AppTest} />
      <Route path="/home" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/agents" component={AgentsPage} />
      <Route path="/agents/:id" component={AgentDetailsPage} />
      <ProtectedRoute path="/dashboard/traveler" component={TravelerDashboardPage} />
      <ProtectedRoute path="/dashboard/agent" component={AgentDashboardPage} />
      <ProtectedRoute path="/itinerary/:id" component={ItineraryPage} />
      <ProtectedRoute path="/messages" component={MessagingPage} />
      
      {/* Development test routes */}
      <Route path="/test" component={FullLayoutTestPage} />
      <Route path="/test/header" component={HeaderTestPage} />
      <Route path="/test/simple" component={TestPage} />
      
      {/* 404 fallback */}
      <Route path="*" component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-4">TravelBuddy</h1>
        <p className="text-lg mb-8 text-center">Welcome to our travel planning application</p>
        <div className="flex justify-center">
          <a href="/app-test" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Launch App
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
