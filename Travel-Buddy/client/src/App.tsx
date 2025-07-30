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
import ExplorePlacesPage from "@/pages/explore-places-page";
import AIItineraryPage from "@/pages/ai-itinerary-page";

function Router() {
  return (
    <Switch>
      {/* Main application routes */}
      <Route path="/" component={HomePage} />
      <Route path="/home" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/agents" component={AgentsPage} />
      <Route path="/agents/:id" component={AgentDetailsPage} />
      <Route path="/explore" component={ExplorePlacesPage} />
      <Route path="/ai-itinerary" component={AIItineraryPage} />
      <ProtectedRoute path="/dashboard/traveler" component={TravelerDashboardPage} />
      <ProtectedRoute path="/dashboard/agent" component={AgentDashboardPage} />
      <ProtectedRoute path="/itinerary/:id" component={ItineraryPage} />
      <ProtectedRoute path="/messages" component={MessagingPage} />
      
      {/* Development test routes */}
      <Route path="/test" component={FullLayoutTestPage} />
      <Route path="/test/header" component={HeaderTestPage} />
      <Route path="/test/simple" component={TestPage} />
      <Route path="/app-test" component={AppTest} />
      <Route path="/basic-test" component={BasicTest} />
      
      {/* 404 fallback */}
      <Route path="*" component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
