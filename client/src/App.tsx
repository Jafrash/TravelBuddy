import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import TestPage from "@/pages/test-page";
import HeaderTestPage from "@/pages/header-test-page";
import FullLayoutTestPage from "@/pages/full-layout-test-page";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Test routes for development */}
      <Route path="/" component={FullLayoutTestPage} />
      <Route path="/header" component={HeaderTestPage} />
      <Route path="/simple" component={TestPage} />
      <Route path="/notfound" component={NotFound} />
      <Route path="*" component={FullLayoutTestPage} />
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
