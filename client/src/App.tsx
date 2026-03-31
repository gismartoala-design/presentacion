import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Scene } from "@/components/Scene";
import { Navbar } from "@/components/Navbar";
import { IntroScreen } from "@/components/IntroScreen";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/not-found";
import ProductDetails from "@/pages/ProductDetails";
import Checkout from "@/pages/Checkout";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/product/:id" component={ProductDetails} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative min-h-screen text-foreground selection:bg-[#5A3F73] selection:text-white">
        <AnimatePresence>
          {showIntro ? (
            <IntroScreen key="intro" onEnter={() => setShowIntro(false)} />
          ) : (
            <div key="content" className="relative z-10 transition-opacity duration-1000">
              <Navbar />
              <Router />
            </div>
          )}
        </AnimatePresence>
        
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
