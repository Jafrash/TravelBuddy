import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import TestPage from "@/pages/test-page";
import HeaderTestPage from "@/pages/header-test-page";

function Router() {
  return (
    <Switch>
      {/* Test routes for debugging recursion issues */}
      <Route path="/" component={HeaderTestPage} />
      <Route path="/simple" component={TestPage} />
      <Route path="/:rest*" component={HeaderTestPage} />
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
