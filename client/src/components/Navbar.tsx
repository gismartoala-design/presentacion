import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { ShoppingBag, Menu, X, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { Logo } from "@/components/Logo";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { href: "/", label: "Inicio" },
    { href: "#ramos", label: "Ramos" },
    { href: "#desayunos", label: "Desayunos" },
    { href: "#mas-vendidos", label: "Más vendidos" },
    { href: "/contact", label: "Contacto" },
  ];

  return (
    <>
      <nav className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500 py-4",
        scrolled ? "bg-[#3D2852]/90 backdrop-blur-xl border-b border-[#5A3F73] shadow-lg" : "bg-transparent text-[#E6E6E6]"
      )}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2">
            <Logo variant="light" size="sm" className="opacity-90 group-hover:opacity-100 transition-opacity" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            <div className="flex gap-8">
              {links.map((link) => (
                <a 
                  key={link.label} 
                  href={link.href}
                  className={cn(
                    "text-sm font-semibold tracking-wide hover:text-white transition-colors relative group",
                    (location === link.href) ? "text-white" : "text-[#E6E6E6]/80"
                  )}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#E6E6E6] transition-all group-hover:w-full"></span>
                </a>
              ))}
            </div>
            
            <div className="flex items-center gap-4 pl-8 border-l border-[#E6E6E6]/20">
              <Link href="/checkout" className="relative p-2 transition-colors hover:text-white text-[#E6E6E6]">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#5A3F73] text-[10px] text-[#E6E6E6] flex items-center justify-center rounded-full border border-[#E6E6E6]/20">2</span>
              </Link>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden p-2 text-[#E6E6E6]"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="md:hidden absolute top-0 right-0 h-screen w-64 bg-[#2A1B38] shadow-2xl p-8 flex flex-col gap-6 z-50 pt-20 border-l border-[#5A3F73]"
            >
              <button 
                className="absolute top-6 right-6 text-[#E6E6E6]/50"
                onClick={() => setIsOpen(false)}
              >
                <X />
              </button>
              {links.map((link) => (
                <a 
                  key={link.label} 
                  href={link.href}
                  className="text-lg font-bold text-[#E6E6E6] hover:text-white transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Fixed WhatsApp Button */}
      <a 
        href="https://wa.me/593987654321" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-[100] bg-[#25D366] text-white p-4 rounded-full shadow-[0_10px_20px_rgba(37,211,102,0.4)] hover:scale-110 active:scale-95 transition-all flex items-center gap-2 group"
      >
        <MessageSquare className="w-6 h-6 fill-white" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold whitespace-nowrap">
          ¿En qué podemos ayudarte?
        </span>
      </a>
    </>
  );
}
