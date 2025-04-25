import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import TestPage from "@/pages/test-page";

function Router() {
  return (
    <Switch>
      {/* Test route only for debugging recursion issues */}
      <Route path="/" component={TestPage} />
      <Route path="/:rest*" component={TestPage} />
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
