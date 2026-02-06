import { motion } from "framer-motion";
import { INITIAL_PRODUCTS } from "@/data/mock";
import { ShoppingBag } from "lucide-react";

export default function Shop() {
  return (
    <div className="min-h-screen pt-32 px-6 md:px-20 max-w-7xl mx-auto">
      <div className="mb-16">
        <h1 className="text-5xl font-serif text-primary mb-4">Catálogo</h1>
        <p className="text-muted-foreground">Piezas seleccionadas para elevar tu espacio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {INITIAL_PRODUCTS.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-secondary mb-4 rounded-sm">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              
              <button className="absolute bottom-4 right-4 bg-white text-primary p-3 rounded-full shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary hover:text-white">
                <ShoppingBag size={20} />
              </button>
            </div>
            
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{product.category}</p>
              <h3 className="text-lg font-serif font-medium text-primary">{product.name}</h3>
              <p className="text-accent font-medium mt-1">${product.price}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
