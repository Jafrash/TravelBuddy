import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import AgentsPage from "@/pages/agents-page";
import AgentDetailsPage from "@/pages/agent-details-page";
import { ProtectedRoute } from "./lib/protected-route";
import TravelerDashboardPage from "@/pages/traveler-dashboard-page";
import AgentDashboardPage from "@/pages/agent-dashboard-page";
import ItineraryPage from "@/pages/itinerary-page";
import MessagingPage from "@/pages/messaging-page";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/agents" component={AgentsPage} />
      <Route path="/agents/:id" component={AgentDetailsPage} />
      
      {/* Protected routes */}
      <ProtectedRoute path="/dashboard/traveler" component={TravelerDashboardPage} />
      <ProtectedRoute path="/dashboard/agent" component={AgentDashboardPage} />
      <ProtectedRoute path="/itinerary/:id" component={ItineraryPage} />
      <ProtectedRoute path="/messages/:receiverId?" component={MessagingPage} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;
