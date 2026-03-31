import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface IntroScreenProps {
  onEnter: () => void;
}

export function IntroScreen({ onEnter }: IntroScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onEnter();
    }, 4500); // 3-4 seconds total for a smooth entrance and exit
    return () => clearTimeout(timer);
  }, [onEnter]);

  const brandName = "DIFIORI";
  const letters = brandName.split("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.5,
      },
    },
  };

  const letterVariants = {
    hidden: { y: -100, opacity: 0, scale: 2 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#3D2852] overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3D2852] via-[#2A1B38] to-[#1a1124]"></div>
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1591880911020-f0249574ad6d?auto=format&fit=crop&q=80&w=2000" 
          className="w-full h-full object-cover mix-blend-overlay animate-slow-zoom"
          alt="flowers-bg"
        />
      </div>
      
      {/* Animated Icon Part */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1.5, ease: "circOut" }}
        className="mb-12 relative"
      >
        <div className="relative z-10 text-7xl">🌸</div>
        <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute inset-0 bg-[#5A3F73] rounded-full blur-3xl -z-0"
        />
      </motion.div>

      {/* Falling Letters Animation */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex mb-8"
      >
        {letters.map((char, index) => (
          <motion.span
            key={index}
            variants={letterVariants}
            className="text-6xl md:text-8xl font-black text-[#E6E6E6] tracking-widest drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            {char}
          </motion.span>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1.5 }}
        className="text-center space-y-6"
      >
        <div className="flex items-center justify-center gap-4">
          <div className="h-[1px] w-12 bg-[#5A3F73]/50"></div>
          <Sparkles className="w-6 h-6 text-[#5A3F73]" />
          <span className="text-[11px] font-black uppercase tracking-[1.2em] text-[#E6E6E6]/60">Elegancia Floral</span>
          <div className="h-[1px] w-12 bg-[#5A3F73]/50"></div>
        </div>
        
        <motion.p 
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="text-[#E6E6E6]/40 font-serif italic text-xl tracking-wide"
        >
          Bienvenido a la experiencia DIFIORI
        </motion.p>
      </motion.div>

      {/* Progress Line */}
      <div className="absolute bottom-20 w-64 h-[2px] bg-[#2A1B38] rounded-full overflow-hidden">
        <motion.div 
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{ duration: 4.5, ease: "linear" }}
          className="w-full h-full bg-gradient-to-r from-transparent via-[#5A3F73] to-transparent"
        />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slow-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 10s ease-in-out infinite alternate;
        }
      `}} />
    </div>
  );
}
