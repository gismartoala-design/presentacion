import { Suspense, useEffect, useRef, type ComponentType, type ReactNode } from "react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";

declare global {
  interface Window {
    fbq?: ((action: string, eventName: string) => void) & {
      callMethod?: (...args: unknown[]) => void;
      queue?: unknown[];
      loaded?: boolean;
      version?: string;
      push?: (...args: unknown[]) => number;
    };
  }
}

function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

interface AppFrameProps {
  Routes: ComponentType;
  fallback?: ReactNode;
}

export function AppFrame({ Routes, fallback = <RouteFallback /> }: AppFrameProps) {
  const [location] = useLocation();
  const hasTrackedInitialPageView = useRef(false);
  const hideNavbar = location === "/checkout" || location === "/payment-gateway" || location === "/payment-result";

  useEffect(() => {
    if (!hasTrackedInitialPageView.current) {
      hasTrackedInitialPageView.current = true;
      return;
    }

    if (typeof window.fbq !== "function") return;

    window.fbq("track", "PageView");
  }, [location]);

  return (
    <div className="relative min-h-screen text-foreground selection:bg-[#5A3F73] selection:text-white">
      <div className="relative z-10">
        {!hideNavbar && <Navbar />}
        <Suspense fallback={fallback}>
          <Routes />
        </Suspense>
      </div>
      <Toaster />
    </div>
  );
}
