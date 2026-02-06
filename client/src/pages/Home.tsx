import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="h-[90vh] flex flex-col justify-center px-6 md:px-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-accent tracking-widest text-sm font-semibold uppercase mb-4 block">
            Colección 2025
          </span>
          <h1 className="text-6xl md:text-8xl font-serif text-primary leading-[0.9] mb-8">
            Diseño que <br />
            <span className="italic font-light">Transforma</span>
          </h1>
          <p className="text-muted-foreground max-w-md text-lg mb-10 leading-relaxed">
            Creamos espacios que cuentan historias. Muebles artesanales, 
            diseño de interiores y piezas exclusivas para tu hogar.
          </p>
          <Link href="/shop" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-sm hover:bg-primary/90 transition-all group cursor-pointer">
            Explorar Colección
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>

      {/* Categories Section - Connected visually by scrolling */}
      <section className="py-32 px-6 md:px-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-serif mb-6 text-primary">Anaqueles & <br />Almacenamiento</h2>
            <p className="text-muted-foreground mb-8">
              Funcionalidad y estética en perfecto equilibrio. Nuestros anaqueles 
              modulares se adaptan a tu espacio y necesidades.
            </p>
            <Link href="/shop" className="text-accent hover:text-accent/80 font-medium underline underline-offset-4 cursor-pointer">
              Ver Anaqueles
            </Link>
          </motion.div>
          <div className="h-[400px] bg-secondary/30 rounded-lg backdrop-blur-sm border border-white/20 p-8 flex items-center justify-center">
            {/* Placeholder for 3D interaction zone or simple image */}
            <div className="text-center">
              <span className="block text-6xl mb-4">📚</span>
              <p className="font-serif italic text-muted-foreground">Minimalismo Organizado</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-6 md:px-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="order-2 md:order-1 h-[400px] bg-secondary/30 rounded-lg backdrop-blur-sm border border-white/20 p-8 flex items-center justify-center">
             <div className="text-center">
              <span className="block text-6xl mb-4">🍽️</span>
              <p className="font-serif italic text-muted-foreground">Reuniones Memorables</p>
            </div>
          </div>
          <motion.div
            className="order-1 md:order-2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-serif mb-6 text-primary">Juegos de <br />Comedor</h2>
            <p className="text-muted-foreground mb-8">
              El corazón de tu hogar. Mesas y sillas diseñadas para largas 
              sobremesas y momentos inolvidables en familia.
            </p>
             <Link href="/shop" className="text-accent hover:text-accent/80 font-medium underline underline-offset-4 cursor-pointer">
              Ver Comedores
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-32 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-serif mb-8">Diseño de Interiores</h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg mb-12">
            No solo vendemos muebles, creamos atmósferas. Consulta con nuestros expertos 
            para transformar tu visión en realidad.
          </p>
          <Link href="/contact" className="inline-block bg-white text-primary px-8 py-3 rounded-sm font-medium hover:bg-gray-100 transition-colors cursor-pointer">
            Agendar Asesoría
          </Link>
        </div>
      </section>
    </div>
  );
}
