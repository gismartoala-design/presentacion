import React from "react";
import { INITIAL_PRODUCTS } from "@/data/mock";
import { ShoppingBag, ChevronLeft, CreditCard, Truck, User, Info } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Checkout() {
  const cartItems = [INITIAL_PRODUCTS[0], INITIAL_PRODUCTS[1]]; // Simulating 2 items
  const total = cartItems.reduce((acc, item) => acc + parseFloat(item.price.replace("$", "")), 0);

  return (
    <div className="min-h-screen bg-[#3D2852] pt-32 pb-20 px-6">
      <div className="container mx-auto max-w-5xl">
        <Link href="/" className="inline-flex items-center gap-2 text-[#E6E6E6]/60 font-bold mb-10 hover:translate-x-[-10px] transition-transform hover:text-white">
          <ChevronLeft className="w-5 h-5" /> Regresar a la tienda
        </Link>
        
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Resumen de Compra - 1 Single Page */}
          <div className="flex-1 space-y-10">
            <h1 className="text-4xl font-serif font-bold text-[#E6E6E6] mb-8 tracking-tight">FINALIZAR COMPRA</h1>
            
            {/* Delivery Info */}
            <div className="bg-[#2A1B38]/60 backdrop-blur-3xl p-10 rounded-[3rem] shadow-2xl border border-[#5A3F73]/30 space-y-8">
               <h3 className="text-xl font-bold text-[#5A3F73] flex items-center gap-3">
                 <User className="w-6 h-6" /> DATOS DE ENTREGA
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <input className="w-full bg-[#3D2852]/50 p-5 rounded-2xl border border-[#5A3F73]/20 outline-none focus:border-[#5A3F73] text-[#E6E6E6] font-medium" placeholder="Escribe el nombre de quien recibe..." />
                 <input className="w-full bg-[#3D2852]/50 p-5 rounded-2xl border border-[#5A3F73]/20 outline-none focus:border-[#5A3F73] text-[#E6E6E6] font-medium" placeholder="Ubicación (Ej: Av. Francisco de Orellana)..." />
                 <input className="w-full bg-[#3D2852]/50 p-5 rounded-2xl border border-[#5A3F73]/20 outline-none focus:border-[#5A3F73] text-[#E6E6E6] font-medium" placeholder="Tu WhatsApp (Para avisarte)..." />
                 <input className="w-full bg-[#3D2852]/50 p-5 rounded-2xl border border-[#5A3F73]/20 outline-none focus:border-[#5A3F73] text-[#E6E6E6] font-medium" placeholder="Fecha y hora de entrega..." />
               </div>
               <textarea className="w-full bg-[#3D2852]/50 p-5 rounded-2xl border border-[#5A3F73]/20 outline-none focus:border-[#5A3F73] text-[#E6E6E6] font-medium h-32" placeholder="Dedicatoria para la tarjeta (Opcional)..."></textarea>
            </div>

            {/* Payment Sim */}
            <div className="bg-[#2A1B38]/60 backdrop-blur-3xl p-10 rounded-[3rem] shadow-2xl border border-[#5A3F73]/30 space-y-8">
               <h3 className="text-xl font-bold text-[#5A3F73] flex items-center gap-3">
                 <CreditCard className="w-6 h-6" /> MÉTODO DE PAGO
               </h3>
               <div className="flex gap-4">
                 {[
                   { label: "Transferencia", icon: "🏦" },
                   { label: "Tarjeta", icon: "💳" },
                   { label: "Efectivo", icon: "💵" }
                 ].map((p, i) => (
                   <button key={i} className="flex-1 bg-[#3D2852]/50 p-6 rounded-2xl font-bold text-[#E6E6E6]/60 hover:bg-[#5A3F73] hover:text-white transition-all text-sm flex flex-col items-center gap-2 border border-[#5A3F73]/20">
                     <span className="text-2xl">{p.icon}</span> {p.label}
                   </button>
                 ))}
               </div>
            </div>
          </div>

          <aside className="lg:w-[400px]">
             <div className="bg-[#2A1B38]/80 backdrop-blur-3xl p-10 rounded-[3rem] shadow-2xl border-2 border-[#5A3F73]/40 sticky top-32">
                <h3 className="text-2xl font-serif font-bold text-[#E6E6E6] mb-8 flex items-center gap-3 underline decoration-[#5A3F73] decoration-4">
                   <ShoppingBag className="w-6 h-6" /> RESUMEN
                </h3>
                
                <div className="space-y-6 mb-10 max-h-[400px] overflow-auto pr-2 custom-scrollbar">
                  {cartItems.map((item, i) => (
                    <div key={i} className="flex gap-4 items-center">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden border border-[#5A3F73]/30 shadow-lg">
                        <img src={item.image} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-[#E6E6E6] text-sm">{item.name}</h4>
                        <p className="text-[#5A3F73] font-black text-sm">{item.price}</p>
                        <p className="text-[10px] uppercase font-bold text-[#E6E6E6]/30">Cant: 1</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-6 border-t border-[#5A3F73]/20">
                  <div className="flex justify-between text-[#E6E6E6]/40 font-medium">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#E6E6E6]/40 font-medium">
                    <span>Envío</span>
                    <span className="text-[#5A3F73]">GRATIS</span>
                  </div>
                  <div className="flex justify-between text-2xl font-black text-[#E6E6E6] pt-4">
                    <span className="font-serif">TOTAL</span>
                    <span className="text-[#5A3F73]">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button className="w-full bg-[#5A3F73] hover:bg-[#4A3362] text-white py-6 rounded-3xl font-black text-lg transition-all shadow-xl shadow-[#2A1B38] mt-10 active:scale-95 border border-[#E6E6E6]/10">
                  CONFIRMAR ORDEN 🌸
                </button>
                <p className="text-center text-[10px] text-[#E6E6E6]/20 mt-6 flex items-center justify-center gap-2 font-bold uppercase tracking-widest">
                  <Truck className="w-3 h-3" /> Entrega hoy garantizada
                </p>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
