import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Banner } from "@/components/Banner";
import { Seo } from "@/components/Seo";
import { DEFAULT_COMPANY, absoluteUrl } from "@/lib/site";

const HomeCatalogSection = lazy(() =>
  import("@/components/home/HomeCatalogSection").then((module) => ({ default: module.HomeCatalogSection })),
);

const HomeDeferredSections = lazy(() =>
  import("@/components/home/HomeDeferredSections").then((module) => ({ default: module.HomeDeferredSections })),
);

function CatalogFallback() {
  return (
    <section className="relative z-20 mb-40 flex flex-col gap-10 pt-10 lg:flex-row xl:gap-8">
      <aside className="h-fit shrink-0 lg:sticky lg:top-32 lg:w-[280px] xl:w-[300px]">
        <div className="surface-card hidden h-[28rem] animate-pulse lg:block" />
        <div className="h-20 animate-pulse rounded-2xl border border-[#D9C6EA] bg-white lg:hidden" />
      </aside>

      <main className="flex-1 w-full overflow-hidden">
        <div id="catalogo" className="mb-12 flex items-center gap-6 opacity-60">
          <div className="h-[1px] flex-1 bg-foreground" />
          <h2 className="whitespace-nowrap text-sm font-black uppercase tracking-[0.5em] text-foreground">
            Catalogo de Arreglos Florales
          </h2>
          <div className="h-[1px] flex-1 bg-foreground" />
        </div>

        <div id="product-list" className="space-y-20 scroll-mt-32">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="product-skeleton" />
            ))}
        </div>
      </main>
    </section>
  );
}

function DeferredFallback() {
  return (
    <>
      <section
        id="testimonios"
        className="deferred-section relative left-1/2 right-1/2 mb-32 w-screen -translate-x-1/2 border-y border-[#DECDF0] bg-[#F4ECFB] px-6 py-20 sm:px-10"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-20 text-center">
            <div className="mx-auto mb-4 h-10 w-72 animate-pulse rounded-full bg-primary/20" />
            <div className="mx-auto h-6 w-80 animate-pulse rounded-full bg-primary/15" />
          </div>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div className="surface-card h-72 animate-pulse" />
            <div className="surface-card h-72 animate-pulse" />
          </div>
        </div>
      </section>

      <section id="faq" className="deferred-section mb-40 px-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="mx-auto mb-16 h-10 w-72 animate-pulse rounded-full bg-primary/20" />
          <div className="surface-card h-32 animate-pulse" />
          <div className="surface-card h-32 animate-pulse" />
        </div>
      </section>

      <section id="contacto" className="deferred-section border-t border-[#DECDF0] bg-[#F4ECFB] px-6 pt-44 pb-14">
        <div className="mx-auto max-w-6xl">
          <div className="h-96 animate-pulse rounded-[2rem] bg-white/35" />
        </div>
      </section>
    </>
  );
}

export default function Home() {
  const catalogTriggerRef = useRef<HTMLDivElement | null>(null);
  const deferredTriggerRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoadCatalog, setShouldLoadCatalog] = useState(false);
  const [shouldLoadDeferredSections, setShouldLoadDeferredSections] = useState(false);

  useEffect(() => {
    if (shouldLoadCatalog || typeof window === "undefined") return;
    let fallbackTimeout = 0;

    const interactionEvents: Array<keyof WindowEventMap> = ["pointerdown", "keydown", "touchstart", "scroll"];

    const startCatalogLoad = (event?: Event) => {
      if (event?.type === "scroll" && window.scrollY < 80) return;

      setShouldLoadCatalog(true);
      interactionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, startCatalogLoad);
      });
      if (fallbackTimeout) window.clearTimeout(fallbackTimeout);
    };

    interactionEvents.forEach((eventName) => {
      window.addEventListener(eventName, startCatalogLoad, { passive: true, once: true });
    });

    fallbackTimeout = window.setTimeout(() => setShouldLoadCatalog(true), 10000);

    return () => {
      interactionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, startCatalogLoad);
      });
      if (fallbackTimeout) window.clearTimeout(fallbackTimeout);
    };
  }, [shouldLoadCatalog]);

  useEffect(() => {
    if (shouldLoadDeferredSections) return;

    const target = deferredTriggerRef.current;
    if (!target || typeof IntersectionObserver === "undefined") {
      setShouldLoadDeferredSections(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoadDeferredSections(true);
          observer.disconnect();
        }
      },
      { rootMargin: "500px 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [shouldLoadDeferredSections]);

  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Florist",
        "@id": "https://difiori.com/#organization",
        name: "DIFIORI",
        url: "https://difiori.com/",
        image: absoluteUrl("/opengraph.jpg"),
        telephone: `+${DEFAULT_COMPANY.phoneDigits}`,
        email: DEFAULT_COMPANY.email,
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Guayaquil",
          addressCountry: "EC",
        },
        areaServed: ["Guayaquil", "Samborondon", "Duran", "Via a la Costa"],
      },
    ],
  };

  return (
    <main className="min-h-screen overflow-clip bg-background scroll-smooth selection:bg-accent selection:text-white">
      <Seo
        title="Floristeria en Guayaquil | Arreglos Florales y Regalos a Domicilio | DIFIORI"
        description="Compra arreglos florales, ramos de flores y regalos a domicilio en Guayaquil con DIFIORI. Entregas en Guayaquil, Samborondon, Duran y Via a la Costa."
        path="/"
        schema={homeSchema}
      />
      <h1 className="sr-only">DIFIORI Floristeria Guayaquil - Arreglos Florales, Ramos de Flores y Regalos a Domicilio</h1>

      <section className="relative pt-24 lg:pt-28">
        <Banner />
      </section>

      <div className="relative z-20 mx-auto w-full max-w-[1600px] px-6 py-20 xl:px-10">
        <div ref={catalogTriggerRef} className="sr-only" aria-hidden="true" />
        <Suspense fallback={<CatalogFallback />}>
          {shouldLoadCatalog ? <HomeCatalogSection /> : <CatalogFallback />}
        </Suspense>

        <div ref={deferredTriggerRef} className="sr-only" aria-hidden="true" />
        <Suspense fallback={<DeferredFallback />}>
          {shouldLoadDeferredSections ? <HomeDeferredSections /> : <DeferredFallback />}
        </Suspense>
      </div>
    </main>
  );
}
