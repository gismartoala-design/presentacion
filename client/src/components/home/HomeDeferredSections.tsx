import React from "react";
import { Star, Instagram, Facebook, Music2, Mail, MessageSquare, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { FAQS } from "@/data/mock";
import { useCompany } from "@/hooks/useCompany";
import { useReviews, useCreateReview } from "@/hooks/useReviews";
import { DEFAULT_COMPANY } from "@/lib/site";

export function HomeDeferredSections() {
  const { data: dbReviews = [], isLoading: isLoadingReviews } = useReviews(true);
  const createReviewMutation = useCreateReview();
  const { data: company } = useCompany(true);
  const [newReview, setNewReview] = React.useState({ name: "", content: "", stars: 5 });
  const [showForm, setShowForm] = React.useState(false);
  const [reviewMessage, setReviewMessage] = React.useState("");

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewMessage("");
    if (!newReview.name || !newReview.content) return;

    try {
      await createReviewMutation.mutateAsync(newReview);
      setNewReview({ name: "", content: "", stars: 5 });
      setShowForm(false);
      setReviewMessage("Gracias por compartir tu experiencia.");
    } catch (err) {
      console.error("Error al enviar la resena:", err);
      setReviewMessage("No pudimos guardar tu resena. Intentalo nuevamente.");
    }
  };

  const companyPhoneDisplay = company?.phone || DEFAULT_COMPANY.phoneDisplay;
  const companyPhoneDigits = companyPhoneDisplay.replace(/[^0-9]/g, "") || DEFAULT_COMPANY.phoneDigits;
  const companyEmail = company?.email || DEFAULT_COMPANY.email;

  return (
    <>
      <section
        id="testimonios"
        className="deferred-section relative left-1/2 right-1/2 mb-32 w-screen -translate-x-1/2 border-y border-[#DECDF0] bg-[#F4ECFB] px-6 py-20 sm:px-10"
      >
        <div className="absolute -top-10 left-1/2 h-20 w-1 -translate-x-1/2 bg-gradient-to-b from-transparent to-primary/20" />

        <div className="mb-20 text-center">
          <h2 className="section-title">Lo que dicen de nosotros</h2>
          <p className="section-copy">Tu satisfaccion es nuestra mayor recompensa.</p>
        </div>
        <div className="mb-10 text-center">
          <button type="button" onClick={() => setShowForm(!showForm)} className="ui-btn-primary">
            {showForm ? "Cerrar Formulario" : "Escribir una resena"}
          </button>
        </div>

        {showForm ? (
          <div className="mx-auto mb-20 max-w-xl overflow-hidden">
            <form onSubmit={handleAddReview} className="surface-card space-y-6 p-8">
              <div className="mb-4 flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, stars: star })}
                    className="transition-transform hover:scale-125"
                  >
                    <Star
                      className={cn("h-8 w-8", star <= newReview.stars ? "fill-accent text-accent" : "text-primary/20")}
                    />
                  </button>
                ))}
              </div>
              <input
                placeholder="Tu nombre"
                value={newReview.name}
                onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                className="w-full rounded-2xl border border-primary/10 bg-primary/5 p-4 font-bold text-foreground outline-none placeholder:text-foreground/20 focus:border-accent"
                required
              />
              <textarea
                placeholder="Cuentanos tu experiencia..."
                value={newReview.content}
                onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                className="h-32 w-full rounded-2xl border border-primary/10 bg-primary/5 p-4 font-medium text-foreground outline-none placeholder:text-foreground/20 focus:border-accent"
                required
              />
              <button type="submit" disabled={createReviewMutation.isPending} className="ui-btn-primary w-full">
                {createReviewMutation.isPending ? "Publicando..." : "Publicar Resena"}
              </button>
            </form>
          </div>
        ) : null}

        {reviewMessage ? (
          <p className="mx-auto mb-10 max-w-xl rounded-2xl border border-primary/15 bg-white/70 px-5 py-4 text-center text-sm font-semibold text-foreground/70">
            {reviewMessage}
          </p>
        ) : null}

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-2">
          {isLoadingReviews ? (
            <div className="col-span-full py-10 text-center opacity-30">Cargando experiencias...</div>
          ) : dbReviews.length > 0 ? (
            dbReviews.map((review, i) => (
              <div
                key={review.id || i}
                className="surface-card group relative p-8 transition-transform duration-300 hover:-translate-y-1 sm:p-10"
              >
                <div className="mb-6 flex gap-1 opacity-40 transition-opacity duration-700 group-hover:opacity-100">
                  {[...Array(review.stars)].map((_, s) => (
                    <Star key={s} className="h-5 w-5 fill-accent text-accent" />
                  ))}
                </div>
                <p
                  className="mb-8 text-[1.7rem] font-black leading-relaxed text-[#4B1F6F]"
                  style={{ fontFamily: '"Arial Black", Arial, sans-serif' }}
                >
                  "{review.content}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 font-bold text-accent transition-transform duration-700 group-hover:rotate-[360deg]">
                    {review.name[0]}
                  </div>
                  <div>
                    <h4
                      className="text-[1.2rem] font-black uppercase tracking-[0.14em] text-[#4B1F6F]"
                      style={{ fontFamily: '"Arial Black", Arial, sans-serif' }}
                    >
                      {review.name}
                    </h4>
                    <span
                      className="text-[1rem] font-black uppercase tracking-[0.12em] text-[#4B1F6F]"
                      style={{ fontFamily: '"Arial Black", Arial, sans-serif' }}
                    >
                      {review.role || "Cliente"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center font-serif text-2xl italic text-foreground/60">
              Aun no hay resenas. Se el primero en compartir tu experiencia.
            </div>
          )}
        </div>
      </section>

      <section id="faq" className="deferred-section mb-40">
        <div className="mb-16 text-center">
          <h2
            className="text-4xl font-black leading-tight text-[#4B1F6F] md:text-6xl"
            style={{ fontFamily: '"Arial Black", Arial, sans-serif' }}
          >
            Preguntas frecuentes
          </h2>
          <p
            className="mt-3 text-xl leading-relaxed text-[#4B1F6F] md:text-2xl"
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            Informacion clave sobre entregas, pagos y tiempos de atencion.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-6">
          {FAQS.map((faq) => (
            <article key={faq.question} className="surface-card p-8">
              <h3
                className="mb-4 text-2xl font-black text-[#4B1F6F] md:text-3xl"
                style={{ fontFamily: '"Arial Black", Arial, sans-serif' }}
              >
                {faq.question}
              </h3>
              <p
                className="text-lg leading-relaxed text-[#4B1F6F] md:text-xl"
                style={{ fontFamily: "Arial, sans-serif" }}
              >
                {faq.answer}
              </p>
            </article>
          ))}
        </div>
      </section>

      <footer id="contacto" className="deferred-section border-t border-[#DECDF0] bg-[#F4ECFB] px-6 pt-44 pb-14">
        <div className="container mx-auto">
          <div className="mb-36 grid grid-cols-1 gap-24 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <img src="/logo-footer.png" alt="DIFIORI" className="mb-12 h-36 w-auto object-contain" loading="lazy" />
              <p
                className="mb-12 text-[1.45rem] font-black leading-relaxed text-[#4B1F6F]"
                style={{ fontFamily: '"Arial Black", Arial, sans-serif' }}
              >
                Disenando emociones con las flores mas frescas de exportacion en Guayaquil.
              </p>
              <div className="flex gap-4">
                {[Instagram, Facebook, Music2].map((Icon, i) => (
                  <div
                    key={i}
                    className="cursor-pointer rounded-2xl border border-[#DECDF0] bg-white/35 p-6 text-[#3D2852] transition-all duration-500 hover:scale-110 hover:bg-accent hover:text-white"
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4
                className="mb-12 text-[1.2rem] font-black uppercase tracking-[0.3em] text-[#4B1F6F]"
                style={{ fontFamily: '"Arial Black", Arial, sans-serif' }}
              >
                La Maison
              </h4>
              <ul
                className="space-y-6 text-[1rem] font-black uppercase tracking-widest text-[#4B1F6F]"
                style={{ fontFamily: '"Arial Black", Arial, sans-serif' }}
              >
                <li className="cursor-pointer transition-all duration-500 hover:translate-x-2 hover:text-accent">Tienda</li>
                <li className="cursor-pointer transition-all duration-500 hover:translate-x-2 hover:text-accent">Contacto</li>
                <li className="cursor-pointer transition-all duration-500 hover:translate-x-2 hover:text-accent">Preguntas Frecuentes</li>
                <li className="cursor-pointer transition-all duration-500 hover:translate-x-2 hover:text-accent">Terminos y Condiciones</li>
              </ul>
            </div>

            <div>
              <h4
                className="mb-12 text-[1.2rem] font-black uppercase tracking-[0.3em] text-[#4B1F6F]"
                style={{ fontFamily: '"Arial Black", Arial, sans-serif' }}
              >
                Soporte
              </h4>
              <ul
                className="space-y-6 text-[1rem] font-black uppercase tracking-widest text-[#4B1F6F]"
                style={{ fontFamily: '"Arial Black", Arial, sans-serif' }}
              >
                <li className="cursor-pointer transition-all duration-500 hover:translate-x-2 hover:text-accent">Envios y Entregas</li>
                <li className="cursor-pointer transition-all duration-500 hover:translate-x-2 hover:text-accent">Cuidado de Flores</li>
                <li className="cursor-pointer transition-all duration-500 hover:translate-x-2 hover:text-accent">Politica de Privacidad</li>
                <li className="cursor-pointer transition-all duration-500 hover:translate-x-2 hover:text-accent">FAQs Soporte</li>
              </ul>
            </div>

            <div>
              <h4
                className="mb-12 text-[1.2rem] font-black uppercase tracking-[0.3em] text-[#4B1F6F]"
                style={{ fontFamily: '"Arial Black", Arial, sans-serif' }}
              >
                Contacto Directo
              </h4>
              <div className="space-y-10">
                <div className="group flex items-center gap-5">
                  <div className="rounded-2xl bg-accent/10 p-6 transition-colors duration-500 group-hover:bg-accent">
                    <MessageSquare className="h-6 w-6 text-accent transition-colors duration-500 group-hover:text-white" />
                  </div>
                  <div
                    className="text-base font-black uppercase text-[#4B1F6F]"
                    style={{ fontFamily: '"Arial Black", Arial, sans-serif' }}
                  >
                    <span className="mb-1.5 block text-[#4B1F6F]">WhatsApp</span>
                    <a href={`https://wa.me/${companyPhoneDigits}`} className="transition-colors duration-500 hover:text-accent">
                      {companyPhoneDisplay}
                    </a>
                  </div>
                </div>
                <div className="group flex items-center gap-5">
                  <div className="rounded-2xl bg-accent/10 p-6 transition-colors duration-500 group-hover:bg-accent">
                    <Phone className="h-6 w-6 text-accent transition-colors duration-500 group-hover:text-white" />
                  </div>
                  <div
                    className="text-base font-black uppercase text-[#4B1F6F]"
                    style={{ fontFamily: '"Arial Black", Arial, sans-serif' }}
                  >
                    <span className="mb-1.5 block text-[#4B1F6F]">Llamadas</span>
                    <span className="transition-colors duration-500 group-hover:text-accent">{companyPhoneDisplay}</span>
                  </div>
                </div>
                <div className="group flex items-center gap-5">
                  <div className="rounded-2xl bg-accent/10 p-6 transition-colors duration-500 group-hover:bg-accent">
                    <Mail className="h-6 w-6 text-accent transition-colors duration-500 group-hover:text-white" />
                  </div>
                  <div
                    className="text-base font-black uppercase text-[#4B1F6F]"
                    style={{ fontFamily: '"Arial Black", Arial, sans-serif' }}
                  >
                    <span className="mb-1.5 block text-[#4B1F6F]">Email</span>
                    <span className="break-all transition-colors duration-500 group-hover:text-accent">{companyEmail}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-10 border-t border-primary/10 pt-14 md:flex-row">
            <p
              className="text-base font-black uppercase tracking-[0.35em] text-[#4B1F6F]"
              style={{ fontFamily: '"Arial Black", Arial, sans-serif' }}
            >
              © 2026 DIFIORI Ecuador. Todos los derechos reservados.
            </p>
            <div
              className="flex gap-8 text-base font-black uppercase tracking-[0.3em] text-[#4B1F6F]"
              style={{ fontFamily: '"Arial Black", Arial, sans-serif' }}
            >
              <span className="cursor-pointer transition-colors duration-500 hover:text-accent">Guayaquil, Ecuador</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
