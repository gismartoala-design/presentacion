import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate generic API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Mensaje Enviado",
        description: "Nos pondremos en contacto contigo pronto.",
      });
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-32 px-6 md:px-20 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <h1 className="text-5xl font-serif text-primary mb-8">Contacto</h1>
          <p className="text-muted-foreground text-lg mb-12">
            ¿Tienes un proyecto en mente? Visítanos en nuestro showroom o escríbenos.
          </p>

          <div className="space-y-8">
            <div>
              <h3 className="font-serif text-xl mb-2">Showroom</h3>
              <p className="text-muted-foreground">
                Av. del Diseño 123<br />
                Distrito Creativo, CDMX
              </p>
            </div>
            <div>
              <h3 className="font-serif text-xl mb-2">Horario</h3>
              <p className="text-muted-foreground">
                Lun - Vie: 10am - 7pm<br />
                Sáb: 11am - 4pm
              </p>
            </div>
            <div>
              <h3 className="font-serif text-xl mb-2">Contacto Directo</h3>
              <p className="text-muted-foreground">
                hola@aesthetica.com<br />
                +52 55 1234 5678
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-sm p-8 rounded-lg border border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre</label>
                <Input required placeholder="Juan Pérez" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input required type="email" placeholder="juan@email.com" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Asunto</label>
              <Input required placeholder="Diseño de Interiores / Compra" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mensaje</label>
              <Textarea required placeholder="Cuéntanos sobre tu proyecto..." className="min-h-[150px]" />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Enviando..." : "Enviar Mensaje"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
