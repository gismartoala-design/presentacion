import React from "react";
import { Product } from "@/data/mock";
import { Link } from "wouter";
import { ShoppingBag, Heart } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group bg-[#2A1B38]/40 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl hover:shadow-[#5A3F73]/20 transition-all border border-[#5A3F73]/30"
    >
      <Link href={`/product/${product.id}`} className="block relative aspect-square overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 z-10">
          <button className="bg-[#3D2852]/80 backdrop-blur-md p-3 rounded-full text-[#E6E6E6] shadow-lg hover:bg-[#5A3F73] transition-all scale-0 group-hover:scale-100 origin-center duration-300 border border-[#E6E6E6]/10">
            <Heart className="w-5 h-5 fill-current" />
          </button>
        </div>
        {product.isBestSeller && (
          <div className="absolute top-4 left-4 z-10 bg-[#5A3F73] text-[#E6E6E6] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg border border-[#E6E6E6]/10">
            Más Vendido
          </div>
        )}
      </Link>
      
      <div className="p-8 text-center flex flex-col items-center">
        <span className="text-[10px] font-black text-[#5A3F73] uppercase tracking-widest mb-2">
          {product.category}
        </span>
        <h3 className="text-xl font-serif font-bold text-[#E6E6E6] mb-2 truncate max-w-full">
          {product.name}
        </h3>
        <p className="text-2xl font-black text-white mb-6 drop-shadow-sm">
          {product.price}
        </p>
        
        <div className="flex gap-3 w-full">
          <Link href={`/product/${product.id}`} className="flex-1 bg-[#5A3F73] hover:bg-[#4A3362] text-[#E6E6E6] py-4 rounded-2xl font-bold transition-all shadow-xl shadow-[#2A1B38] flex items-center justify-center gap-2 border border-[#E6E6E6]/10">
            Comprar
          </Link>
          <button className="bg-[#2A1B38] hover:bg-[#3D2852] text-[#E6E6E6] p-4 rounded-2xl transition-all border border-[#5A3F73]/30">
            <ShoppingBag className="w-6 h-6" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
