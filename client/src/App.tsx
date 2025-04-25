import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "@/pages/home-page";
import AgentsPage from "@/pages/agents-page";
import AgentDetailsPage from "@/pages/agent-details-page";
import ItineraryPage from "@/pages/itinerary-page";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";
import TravelerDashboardPage from "@/pages/traveler-dashboard-page";
import AgentDashboardPage from "@/pages/agent-dashboard-page";
import MessagingPage from "@/pages/messaging-page";
import { ProtectedRoute } from "@/lib/protected-route";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={HomePage} />
      <Route path="/agents" component={AgentsPage} />
      <Route path="/agents/:id" component={AgentDetailsPage} />
      <Route path="/itinerary/:id" component={ItineraryPage} />
      <Route path="/auth" component={AuthPage} />

      {/* Protected routes */}
      <Route path="/dashboard/traveler">
        {() => <ProtectedRoute path="/dashboard/traveler" component={TravelerDashboardPage} />}
      </Route>
      <Route path="/dashboard/agent">
        {() => <ProtectedRoute path="/dashboard/agent" component={AgentDashboardPage} />}
      </Route>
      <Route path="/messaging">
        {() => <ProtectedRoute path="/messaging" component={MessagingPage} />}
      </Route>
      
      {/* Fallback route */}
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
