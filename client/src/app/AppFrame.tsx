import { Suspense, lazy, useEffect, useRef, useState, type CSSProperties, type ComponentType, type ReactNode } from "react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { useCompany } from "@/hooks/useCompany";

const Toaster = lazy(() =>
  import("@/components/ui/toaster").then((module) => ({ default: module.Toaster })),
);

const FACEBOOK_PIXEL_ID = "1783051885578047";

type FacebookPixel = ((action: string, eventName: string) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  loaded?: boolean;
  version?: string;
  push?: (...args: unknown[]) => number;
};

declare global {
  interface Window {
    fbq?: FacebookPixel;
    _fbq?: typeof window.fbq;
  }
}

function initFacebookPixel() {
  if (typeof window === "undefined" || typeof document === "undefined" || typeof window.fbq === "function") {
    return;
  }

  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) {
      fbq.callMethod(...args);
      return;
    }

    fbq.queue.push(args);
  } as FacebookPixel;

  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.push = (...args: unknown[]) => fbq.queue.push(args);

  window.fbq = fbq;
  window._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  fbq("init", FACEBOOK_PIXEL_ID);
  fbq("track", "PageView");
}

function isMeaningfulInteraction(event: Event) {
  if (event.type === "scroll") {
    return typeof window !== "undefined" && window.scrollY > 24;
  }

  return true;
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
  const { data: company } = useCompany();
  const hasTrackedInitialPageView = useRef(false);
  const hasInitializedPixel = useRef(false);
  const [shouldLoadToaster, setShouldLoadToaster] = useState(false);
  const hideNavbar = location === "/checkout" || location === "/payment-gateway" || location === "/payment-result";
  const showClosedStoreBanner = !hideNavbar && company?.settings?.acceptOrders === false;
  const appFrameStyle = {
    "--closed-store-banner-height": showClosedStoreBanner ? "38px" : "0px",
  } as CSSProperties;

  useEffect(() => {
    if (hasInitializedPixel.current || typeof window === "undefined") return;
    let interactionCleanup = () => {};
    let fallbackTimeout = 0;

    const bootPixel = () => {
      if (hasInitializedPixel.current) return;
      hasInitializedPixel.current = true;
      interactionCleanup();
      if (fallbackTimeout) window.clearTimeout(fallbackTimeout);
      initFacebookPixel();
    };

    const setupDeferredBoot = () => {
      const interactionEvents: Array<keyof WindowEventMap> = [
        "pointerdown",
        "keydown",
        "touchstart",
        "scroll",
      ];

      const onInteraction = (event: Event) => {
        if (!isMeaningfulInteraction(event)) return;
        bootPixel();
      };

      interactionEvents.forEach((eventName) => {
        window.addEventListener(eventName, onInteraction, {
          passive: true,
          once: true,
        });
      });

      interactionCleanup = () => {
        interactionEvents.forEach((eventName) => {
          window.removeEventListener(eventName, onInteraction);
        });
      };

      // Fallback para sesiones sin interacción.
      fallbackTimeout = window.setTimeout(bootPixel, 8000);
    };

    if (document.readyState === "complete") {
      setupDeferredBoot();
      return () => {
        interactionCleanup();
        if (fallbackTimeout) window.clearTimeout(fallbackTimeout);
      };
    }

    const onLoad = () => setupDeferredBoot();

    window.addEventListener("load", onLoad, { once: true });
    return () => {
      window.removeEventListener("load", onLoad);
      interactionCleanup();
      if (fallbackTimeout) window.clearTimeout(fallbackTimeout);
    };
  }, []);

  useEffect(() => {
    if (shouldLoadToaster || typeof window === "undefined") return;

    let fallbackTimeout = 0;
    const interactionEvents: Array<keyof WindowEventMap> = ["pointerdown", "keydown", "touchstart"];

    const loadToaster = () => {
      setShouldLoadToaster(true);
      interactionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, loadToaster);
      });
      if (fallbackTimeout) window.clearTimeout(fallbackTimeout);
    };

    interactionEvents.forEach((eventName) => {
      window.addEventListener(eventName, loadToaster, { passive: true, once: true });
    });

    fallbackTimeout = window.setTimeout(loadToaster, 10000);

    return () => {
      interactionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, loadToaster);
      });
      if (fallbackTimeout) window.clearTimeout(fallbackTimeout);
    };
  }, [shouldLoadToaster]);

  useEffect(() => {
    if (!hasTrackedInitialPageView.current) {
      hasTrackedInitialPageView.current = true;
      return;
    }

    if (typeof window.fbq !== "function") return;

    window.fbq("track", "PageView");
  }, [location]);

  return (
    <div
      className="relative min-h-screen text-foreground selection:bg-[#5A3F73] selection:text-white"
      style={appFrameStyle}
    >
      <div className="relative z-10">
        {showClosedStoreBanner ? (
          <div className="fixed left-0 top-0 z-[70] flex h-[38px] w-full items-center justify-center bg-red-700 px-4 text-center text-sm font-black uppercase tracking-[0.18em] text-white shadow-md ring-1 ring-red-900/20">
            Tienda cerrada temporalmente
          </div>
        ) : null}
        {!hideNavbar && <Navbar />}
        <Suspense fallback={fallback}>
          <Routes />
        </Suspense>
      </div>
      {shouldLoadToaster ? (
        <Suspense fallback={null}>
          <Toaster />
        </Suspense>
      ) : null}
    </div>
  );
}
