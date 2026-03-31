import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { Link } from "wouter";
import { Banner } from "@/components/Banner";
import { CategorySidebar } from "@/components/CategorySidebar";
import { ProductCard } from "@/components/ProductCard";
import { Logo } from "@/components/Logo";
import { INITIAL_PRODUCTS } from "@/data/mock";

export default function Home() {
  const bestSellers = INITIAL_PRODUCTS.filter(p => p.isBestSeller);

  return (
    <div className="min-h-screen bg-[#3D2852]">
      {/* 1. Header is in App.tsx/Navbar.tsx */}
      
      {/* 2. Banner Section */}
      <section className="relative">
        <Banner />
      </section>

      <div className="container mx-auto px-6 py-20 translate-y-[-100px] relative z-20">
         {/* 3. MÁS VENDIDOS Block */}
        <section id="mas-vendidos" className="mb-32">
          <div className="bg-[#2A1B38]/60 backdrop-blur-3xl rounded-[4rem] p-12 md:p-20 shadow-2xl border border-[#5A3F73]/30">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-[#5A3F73] fill-[#5A3F73]" />
                  <span className="text-[#E6E6E6]/60 font-black uppercase tracking-widest text-xs">Favoritos de la Temporada</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-serif text-[#E6E6E6] mb-6 leading-tight">MÁS VENDIDOS</h2>
                <p className="text-[#E6E6E6]/50 text-xl font-medium">Los arreglos que más emociones han despertado esta semana.</p>
              </div>
              <button className="bg-[#5A3F73] hover:bg-[#4A3362] text-[#E6E6E6] font-black px-8 py-4 rounded-2xl transition-all flex items-center gap-3 border border-[#E6E6E6]/10 shadow-xl">
                Ver todo <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>


        {/* 5. Main Content: Sidebar + Catalog */}
        <div className="flex flex-col lg:flex-row gap-12 pt-20">
          <aside className="lg:sticky lg:top-32 h-fit">
            <CategorySidebar />
          </aside>

          <main className="flex-1">
            <div className="flex items-center gap-6 mb-12 opacity-30">
              <div className="h-[1px] flex-1 bg-[#E6E6E6]"></div>
              <span className="text-[#E6E6E6] font-black uppercase tracking-[0.5em] text-[10px]">Colección 2025</span>
              <div className="h-[1px] flex-1 bg-[#E6E6E6]"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {INITIAL_PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            <div className="mt-20 text-center">
              <button className="bg-transparent border-2 border-[#5A3F73] hover:bg-[#5A3F73] text-[#E6E6E6] px-12 py-6 rounded-3xl font-bold transition-all shadow-xl">
                Cargar más productos
              </button>
            </div>
          </main>
        </div>
      </div>

      {/* Footer simplistic */}
      <footer className="bg-[#2A1B38] border-t border-[#5A3F73]/30 py-24 px-6 mt-32">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <Logo variant="light" size="md" className="opacity-80" />
            </div>
            <p className="text-[#E6E6E6]/40 max-w-sm leading-relaxed text-lg italic">
              Llevando emociones a cada rincón de Guayaquil. Calidad de exportación y entrega puntual garantizada.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-[#E6E6E6] mb-8 uppercase tracking-widest text-xs">Información</h4>
            <ul className="space-y-4 text-[#E6E6E6]/40 text-sm font-medium">
              <li><Link href="/about" className="hover:text-[#E6E6E6] transition-colors">Nosotros</Link></li>
              <li><Link href="/delivery" className="hover:text-[#E6E6E6] transition-colors">Zonas de Entrega</Link></li>
              <li><Link href="/privacy" className="hover:text-[#E6E6E6] transition-colors">Privacidad</Link></li>
            </ul>
          </div>
          <div>
             <h4 className="font-bold text-[#E6E6E6] mb-8 uppercase tracking-widest text-xs">Síguenos</h4>
             <div className="flex gap-4">
               {[1,2,3].map(i => <div key={i} className="w-12 h-12 bg-[#3D2852] rounded-full cursor-pointer hover:bg-[#5A3F73] transition-all border border-[#5A3F73]/50"></div>)}
             </div>
          </div>
        </div>
        <div className="container mx-auto mt-24 pt-12 border-t border-[#5A3F73]/20 text-center text-[#E6E6E6]/20 text-[10px] font-black uppercase tracking-[0.6em]">
           © 2025 DIFIORI Boutique. Elegancia floral en Guayaquil.
        </div>
      </footer>
    </div>
  );
}
