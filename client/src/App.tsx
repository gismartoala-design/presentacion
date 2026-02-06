import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Scene } from "@/components/Scene";
import { Navbar } from "@/components/Navbar";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import Contact from "@/pages/Contact";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop" component={Shop} />
      <Route path="/contact" component={Contact} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative min-h-screen text-foreground selection:bg-accent selection:text-white">
        {/* 3D Background - Persistent across pages but interactive via scroll */}
        <Scene />
        
        {/* Foreground Content */}
        <div className="relative z-10">
          <Navbar />
          <Router />
        </div>
        
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
