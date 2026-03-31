import React, { useState } from "react";
import { useRoute } from "wouter";
import { INITIAL_PRODUCTS } from "@/data/mock";
import { ShoppingBag, MessageSquare, Truck, ShieldCheck, Clock, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ProductDetails() {
  const [match, params] = useRoute("/product/:id");
  const product = INITIAL_PRODUCTS.find(p => p.id === params?.id);
  const [selectedImage, setSelectedImage] = useState(product?.image);

  if (!product) return <div className="pt-40 text-center text-[#E6E6E6]">Producto no encontrado</div>;

  return (
    <div className="min-h-screen bg-[#3D2852] pt-32 pb-20 px-6">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Photos Section */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square rounded-[3rem] overflow-hidden border border-[#5A3F73]/30 shadow-2xl group bg-[#2A1B38]/40 backdrop-blur-xl"
            >
              <img 
                src={selectedImage} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-zoom-in"
                alt={product.name}
              />
              <button className="absolute top-6 right-6 p-4 bg-[#3D2852]/80 backdrop-blur-md rounded-full text-[#E6E6E6] shadow-xl border border-[#E6E6E6]/10">
                <Heart className="w-6 h-6" />
              </button>
            </motion.div>
            
            <div className="flex gap-4">
              {[product.image, ...(product.additionalImages || [])].map((img, i) => (
                <button 
                  key={i}
                  onMouseEnter={() => setSelectedImage(img)}
                  className={cn(
                    "w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all",
                    selectedImage === img ? "border-[#5A3F73] scale-105" : "border-[#E6E6E6]/10"
                  )}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`view-${i}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="flex flex-col">
            <span className="text-[#5A3F73] font-black uppercase tracking-[0.3em] text-xs mb-4">
              {product.category}
            </span>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#E6E6E6] mb-6 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-6 mb-8 text-center bg-[#2A1B38]/60 p-8 rounded-3xl w-fit border border-[#5A3F73]/20 shadow-xl">
               <span className="text-4xl font-black text-white font-serif">{product.price}</span>
            </div>

            <p className="text-[#E6E6E6]/60 text-lg leading-relaxed mb-10 max-w-xl font-medium italic">
              {product.description}
            </p>

            <div className="space-y-4 mb-12">
               <div className="flex items-center gap-4 text-[#E6E6E6]/80 font-medium">
                 <div className="w-10 h-10 bg-[#5A3F73] rounded-xl flex items-center justify-center text-[#E6E6E6] border border-[#E6E6E6]/10 shadow-lg"><Truck className="w-5 h-5"/></div>
                 <span>Envío express en Guayaquil: <strong>{product.deliveryTime}</strong></span>
               </div>
               <div className="flex items-center gap-4 text-[#E6E6E6]/80 font-medium">
                 <div className="w-10 h-10 bg-[#5A3F73] rounded-xl flex items-center justify-center text-[#E6E6E6] border border-[#E6E6E6]/10 shadow-lg"><ShieldCheck className="w-5 h-5"/></div>
                 <span>Calidad Premium: <strong className="text-white">Flores de exportación fresas hoy</strong></span>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 mt-auto">
              <button className="flex-1 bg-[#5A3F73] hover:bg-[#4A3362] text-[#E6E6E6] py-6 rounded-3xl font-black text-lg transition-all shadow-xl shadow-[#2A1B38] active:scale-95 flex items-center justify-center gap-3 border border-[#E6E6E6]/10">
                Comprar ahora
              </button>
              <a 
                href={`https://wa.me/593987654321?text=Hola, quiero pedir: ${product.name}`} 
                target="_blank"
                className="flex-1 border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white py-6 rounded-3xl font-black text-lg transition-all flex items-center justify-center gap-3"
              >
                <MessageSquare className="w-6 h-6" /> Pedir por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
