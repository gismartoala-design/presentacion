import { motion, Variants } from "framer-motion";
import { ArrowRight, Sparkles, Star, Instagram, Facebook, Mail, MessageSquare, Phone } from "lucide-react";
import { Link } from "wouter";
import { Banner } from "@/components/Banner";
import { CategorySidebar } from "@/components/CategorySidebar";
import { ProductCard } from "@/components/ProductCard";
import { Logo } from "@/components/Logo";
import { TESTIMONIALS, COMPANY_INFO, FAQS, CARE_GUIDE, CONTACT_DETAILS, INITIAL_PRODUCTS } from "@/data/mock";

export default function Home() {
  const bestSellers = INITIAL_PRODUCTS.filter(p => p.isBestSeller);

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 1.2, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-background selection:bg-accent selection:text-white overflow-x-hidden scroll-smooth">
      {/* 1. Header is in App.tsx/Navbar.tsx */}
      
      {/* 2. Banner Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="relative"
      >
        <Banner />
      </motion.section>

      <div className="container mx-auto px-6 py-20 relative z-20">
        
        {/* SEO/Description Block */}
        <motion.section 
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-4xl mx-auto text-center mb-40 pt-20"
        >
           <span className="text-accent font-black uppercase tracking-[0.6em] text-[10px] block mb-4">Experiencia Difiori</span>
           <h2 className="text-3xl md:text-5xl font-serif text-foreground leading-tight italic mb-10">
             {COMPANY_INFO.description}
           </h2>
           <div className="flex flex-wrap justify-center gap-12 mt-16 pb-12 border-b border-primary/20">
              <div className="flex flex-col items-center max-w-[250px]">
                 <Star className="w-10 h-10 text-accent mb-6" />
                 <h4 className="text-sm font-black uppercase tracking-widest mb-3">Frescura</h4>
                 <p className="text-xs text-foreground/50 leading-relaxed font-medium">Flores seleccionadas y recién cortadas, listas para regalar.</p>
              </div>
              <div className="flex flex-col items-center max-w-[250px]">
                 <Sparkles className="w-10 h-10 text-accent mb-6" />
                 <h4 className="text-sm font-black uppercase tracking-widest mb-3">Personalizado</h4>
                 <p className="text-xs text-foreground/50 leading-relaxed font-medium">Asesoría profesional para que cada detalle sea único.</p>
              </div>
           </div>
        </motion.section>

         {/* 3. MÁS VENDIDOS Block */}
        <motion.section 
          id="mas-vendidos" 
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-40"
        >
          <div className="bg-white/60 backdrop-blur-3xl rounded-[4rem] p-12 md:p-24 shadow-2xl border border-primary/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/10 transition-colors duration-1000" />
            
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8 relative z-10">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-accent fill-accent" />
                  <span className="text-foreground/60 font-black uppercase tracking-widest text-xs">Favoritos de la Temporada</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-serif text-foreground mb-6 leading-tight uppercase">MÁS VENDIDOS</h2>
                <p className="text-foreground/50 text-2xl font-serif italic mb-2">Los arreglos que más emociones despiertan.</p>
              </div>
              <button className="bg-accent hover:bg-accent/80 text-white font-black px-10 py-5 rounded-2xl transition-all flex items-center gap-4 shadow-xl text-xs uppercase tracking-widest hover:scale-105 active:scale-95 duration-500">
                Explorar Colección <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 relative z-10">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </motion.section>


        {/* 5. Main Content: Sidebar + Catalog */}
        <motion.section 
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col lg:flex-row gap-16 pt-10 mb-40"
        >
          <aside className="lg:sticky lg:top-32 h-fit">
            <CategorySidebar />
          </aside>

          <main className="flex-1">
            <div className="flex items-center gap-6 mb-16 opacity-30">
              <div className="h-[1px] flex-1 bg-foreground"></div>
              <span className="text-foreground font-black uppercase tracking-[0.5em] text-[10px]">Catálogo Maestro</span>
              <div className="h-[1px] flex-1 bg-foreground"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {INITIAL_PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            <div className="mt-24 text-center">
              <button className="bg-transparent border-2 border-primary hover:bg-primary/20 text-foreground px-16 py-6 rounded-3xl font-black text-xs uppercase tracking-widest transition-all shadow-xl hover:scale-105 duration-500">
                Cargar más productos
              </button>
            </div>
          </main>
        </motion.section>

        {/* REVIEWS SECTION */}
        <motion.section 
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-40 py-24 bg-primary/5 rounded-[4rem] px-12 border border-primary/20 relative"
        >
           <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-1 h-20 bg-gradient-to-b from-transparent to-primary/20" />
           
           <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-serif text-foreground mb-4 italic">Lo que dicen de nosotros</h2>
              <p className="text-foreground/50 italic font-serif text-xl">Tu satisfacción es nuestra mayor recompensa.</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {TESTIMONIALS.map((review, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white p-12 rounded-[3rem] shadow-xl border border-primary/10 relative group"
                >
                   <div className="flex gap-1 mb-6 opacity-40 group-hover:opacity-100 transition-opacity duration-700">
                      {[...Array(review.stars)].map((_, s) => <Star key={s} className="w-5 h-5 fill-accent text-accent" />)}
                   </div>
                   <p className="text-foreground/80 text-lg leading-relaxed mb-8 italic font-serif">"{review.content}"</p>
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center font-bold text-accent transition-transform duration-700 group-hover:rotate-[360deg]">{review.name[0]}</div>
                      <div>
                         <h4 className="font-black uppercase tracking-widest text-[10px] text-foreground">{review.name}</h4>
                         <span className="text-[10px] text-foreground/40 font-bold uppercase">{review.role}</span>
                      </div>
                   </div>
                </motion.div>
              ))}
           </div>
        </motion.section>

        {/* CARE GUIDE & FAQS */}
        <motion.section 
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid lg:grid-cols-2 gap-16 mb-40"
        >
           <div className="bg-white p-16 rounded-[4rem] border border-primary/20 shadow-xl hover:shadow-2xl transition-shadow duration-700">
             <h3 className="text-3xl font-serif text-foreground mb-10 italic">Guía de Cuidado de Flores</h3>
             <div className="space-y-8">
                {CARE_GUIDE.map((step, i) => (
                  <div key={i} className="flex gap-6 group">
                     <span className="text-3xl font-black text-accent/20 group-hover:text-accent/40 transition-colors duration-700">0{i+1}</span>
                     <div>
                        <h4 className="font-black uppercase tracking-widest text-xs text-accent mb-2">{step.step}</h4>
                        <p className="text-sm text-foreground/60 leading-relaxed font-medium">{step.description}</p>
                     </div>
                  </div>
                ))}
             </div>
           </div>
           <div className="bg-white p-16 rounded-[4rem] border border-primary/20 shadow-xl hover:shadow-2xl transition-shadow duration-700">
             <h3 className="text-3xl font-serif text-foreground mb-10 italic">Preguntas Frecuentes</h3>
             <div className="space-y-6">
                {FAQS.map((faq, i) => (
                  <div key={i} className="pb-6 border-b border-primary/10 last:border-0 group cursor-help">
                     <h4 className="font-serif font-bold text-lg text-foreground mb-2 flex items-center gap-2 group-hover:text-accent transition-colors duration-500">
                       <span className="w-2 h-2 bg-accent rounded-full scale-0 group-hover:scale-100 transition-transform duration-500"></span> {faq.question}
                     </h4>
                     <p className="text-sm text-foreground/60 leading-relaxed pl-4 border-l-2 border-primary/20 group-hover:border-accent transition-colors duration-700">{faq.answer}</p>
                  </div>
                ))}
             </div>
           </div>
        </motion.section>

        {/* Nuestra Maison / Historia Section */}
        <motion.section 
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-40 text-center max-w-5xl mx-auto bg-primary/10 p-24 rounded-[4rem] border border-primary/20 shadow-inner relative"
        >
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-20 bg-primary/30" />
           <Logo variant="dark" size="md" className="mx-auto mb-12 opacity-30 hover:opacity-100 transition-opacity duration-1000" />
           <h2 className="text-4xl md:text-6xl font-serif text-foreground mb-10 italic">Nuestra Maison</h2>
           <p className="text-xl md:text-3xl text-foreground font-serif italic leading-[1.6] max-w-3xl mx-auto">
             "{COMPANY_INFO.history}"
           </p>
        </motion.section>

      </div>

      {/* FOOTER MULTI-SECTION PROFESSIONAL */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="bg-white border-t border-primary/20 pt-40 pb-12 px-6"
      >
        <div className="container mx-auto">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-32">
              <div className="lg:col-span-1">
                 <Logo variant="dark" size="md" className="mb-10" />
                 <p className="text-foreground/50 text-sm leading-relaxed mb-10 italic font-serif">
                   Diseñando emociones con las flores más frescas de exportación en Guayaquil.
                 </p>
                 <div className="flex gap-4">
                    {[Instagram, Facebook, Mail].map((Icon, i) => (
                      <div key={i} className="p-4 bg-primary/5 rounded-2xl hover:bg-accent hover:text-white transition-all duration-500 cursor-pointer border border-primary/10 hover:scale-110">
                         <Icon className="w-5 h-5" />
                      </div>
                    ))}
                 </div>
              </div>
              
              <div>
                 <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground mb-10 opacity-70">La Maison</h4>
                 <ul className="space-y-5 text-sm text-foreground/40 font-bold uppercase tracking-widest text-[9px]">
                    <li className="hover:text-accent cursor-pointer transition-all duration-500 hover:translate-x-2">Tienda</li>
                    <li className="hover:text-accent cursor-pointer transition-all duration-500 hover:translate-x-2">Contacto</li>
                    <li className="hover:text-accent cursor-pointer transition-all duration-500 hover:translate-x-2">Preguntas Frecuentes</li>
                    <li className="hover:text-accent cursor-pointer transition-all duration-500 hover:translate-x-2">Términos y Condiciones</li>
                 </ul>
              </div>

              <div>
                 <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground mb-10 opacity-70">Soporte</h4>
                 <ul className="space-y-5 text-sm text-foreground/40 font-bold uppercase tracking-widest text-[9px]">
                    <li className="hover:text-accent cursor-pointer transition-all duration-500 hover:translate-x-2">Envíos y Entregas</li>
                    <li className="hover:text-accent cursor-pointer transition-all duration-500 hover:translate-x-2">Cuidado de Flores</li>
                    <li className="hover:text-accent cursor-pointer transition-all duration-500 hover:translate-x-2">Política de Privacidad</li>
                    <li className="hover:text-accent cursor-pointer transition-all duration-500 hover:translate-x-2">FAQs Soporte</li>
                 </ul>
              </div>

              <div>
                 <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground mb-10 opacity-70">Contacto Directo</h4>
                 <div className="space-y-8">
                    <div className="flex items-center gap-5 group">
                       <div className="p-4 bg-accent/10 rounded-2xl group-hover:bg-accent transition-colors duration-500"><MessageSquare className="w-4 h-4 text-accent group-hover:text-white transition-colors duration-500"/></div>
                       <div className="text-[10px] font-black uppercase">
                          <span className="block opacity-30 mb-1">WhatsApp</span>
                          <a href={`https://wa.me/593987654321`} className="hover:text-accent transition-colors duration-500">{CONTACT_DETAILS.whatsapp}</a>
                       </div>
                    </div>
                    <div className="flex items-center gap-5 group">
                       <div className="p-4 bg-accent/10 rounded-2xl group-hover:bg-accent transition-colors duration-500"><Phone className="w-4 h-4 text-accent group-hover:text-white transition-colors duration-500"/></div>
                       <div className="text-[10px] font-black uppercase">
                          <span className="block opacity-30 mb-1">Llamadas</span>
                          <span className="group-hover:text-accent transition-colors duration-500">{CONTACT_DETAILS.phone}</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-5 group">
                       <div className="p-4 bg-accent/10 rounded-2xl group-hover:bg-accent transition-colors duration-500"><Mail className="w-4 h-4 text-accent group-hover:text-white transition-colors duration-500"/></div>
                       <div className="text-[10px] font-black uppercase">
                          <span className="block opacity-30 mb-1">Email</span>
                          <span className="break-all group-hover:text-accent transition-colors duration-500">{CONTACT_DETAILS.email}</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="pt-12 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center gap-10">
              <p className="text-[9px] font-black uppercase tracking-[0.6em] text-foreground/20">
                 © 2026 DIFIORI Ecuador. Todos los derechos reservados.
              </p>
              <div className="flex gap-8 text-[9px] font-black uppercase tracking-[0.4em] text-foreground/20">
                 <span className="hover:text-accent cursor-pointer transition-colors duration-500">Guayaquil, Ecuador</span>
              </div>
           </div>
        </div>
      </motion.footer>
    </div>
  );
}
