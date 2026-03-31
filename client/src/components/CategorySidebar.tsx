import React, { useState } from "react";
import { CATEGORIES } from "@/data/mock";
import { cn } from "@/lib/utils";
import { ChevronDown, Filter, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CategorySidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Ramos de rosas");

  return (
    <div className="w-full lg:w-64 flex flex-col gap-6">
      {/* Mobile Dropdown */}
      <div className="lg:hidden w-full relative">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between bg-[#3D2852]/80 backdrop-blur-xl border border-[#5A3F73]/30 p-4 rounded-2xl shadow-xl font-bold text-[#E6E6E6]"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#5A3F73]" />
            Categorías: {activeCategory}
          </div>
          <ChevronDown className={cn("w-5 h-5 transition-transform", isOpen && "rotate-180")} />
        </button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 w-full bg-[#2A1B38] shadow-2xl border border-[#5A3F73]/30 rounded-2xl mt-2 z-40 overflow-hidden"
            >
              {CATEGORIES.map((cat) => (
                <button 
                  key={cat.slug} 
                  className={cn(
                    "w-full text-left p-4 hover:bg-[#5A3F73]/50 transition-colors font-medium border-b border-[#5A3F73]/10 last:border-0",
                    activeCategory === cat.name ? "text-white bg-[#5A3F73]" : "text-[#E6E6E6]/70"
                  )}
                  onClick={() => {
                    setActiveCategory(cat.name);
                    setIsOpen(false);
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Vertical Sidebar */}
      <div className="hidden lg:flex flex-col gap-2 p-6 bg-[#2A1B38]/40 backdrop-blur-xl border border-[#5A3F73]/30 rounded-[2.5rem] shadow-2xl sticky top-32">
        <h3 className="text-[#E6E6E6] font-serif font-bold text-2xl mb-6 px-4 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-[#5A3F73]" />
          Categorías
        </h3>
        {CATEGORIES.map((cat) => (
          <button 
            key={cat.slug} 
            className={cn(
              "w-full text-left px-5 py-4 rounded-2xl transition-all font-bold text-sm tracking-wide flex items-center justify-between group relative overflow-hidden",
              activeCategory === cat.name 
                ? "bg-[#5A3F73] text-white shadow-lg shadow-[#5A3F73]/20" 
                : "text-[#E6E6E6]/50 hover:bg-[#5A3F73]/20 hover:text-[#E6E6E6] border border-transparent"
            )}
            onClick={() => setActiveCategory(cat.name)}
          >
            <span className="relative z-10">{cat.name}</span>
            <span className={cn(
              "w-1.5 h-1.5 rounded-full transition-all relative z-10",
              activeCategory === cat.name ? "bg-white" : "bg-[#5A3F73] group-hover:scale-150"
            )}></span>
          </button>
        ))}
      </div>
    </div>
  );
}
