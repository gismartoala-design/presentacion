import { useEffect, useState } from "react";
import { toast } from "sonner";
import ecommerceService from "@/core/api/ecommerce-service";
import { Button } from "@/shared/components/ui/button";

type PaymentSettings = {
  paypalClientId: string;
  paypalClientSecret: string;
  paypalMerchantId: string;
  paypalWebhookId: string;
  paypalEnvironment: "sandbox" | "live";
  transferInstructions: string;
};

const DEFAULT_SETTINGS: PaymentSettings = {
  paypalClientId: "",
  paypalClientSecret: "",
  paypalMerchantId: "",
  paypalWebhookId: "",
  paypalEnvironment: "sandbox",
  transferInstructions: "",
};

export default function PaymentsPage() {
  const [form, setForm] = useState<PaymentSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await ecommerceService.get("/admin/company/payment-settings");
        const paymentSettings = response.data?.data?.settings?.paymentSettings || {};
        setForm({
          ...DEFAULT_SETTINGS,
          ...paymentSettings,
        });
      } catch (error) {
        console.error("Load payment settings error:", error);
        toast.error("No se pudo cargar la configuración de pagos");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const updateField = (field: keyof PaymentSettings, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await ecommerceService.put("/admin/company/payment-settings", form);
      toast.success("Configuración de pagos guardada");
    } catch (error) {
      console.error("Save payment settings error:", error);
      toast.error("No se pudo guardar la configuración");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-sm text-gray-500">Cargando configuración de pagos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Configuración de Pagos</h1>
        <p className="mt-1 text-gray-600">
          Deja listos los IDs y credenciales visibles del negocio para PayPal y transferencia.
        </p>
      </header>

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">PayPal</h2>
        <p className="mt-1 text-sm text-gray-500">
          Estos campos quedan preparados para conectar el flujo web y mantener los datos centralizados en admin.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field
            label="Client ID"
            value={form.paypalClientId}
            onChange={(value) => updateField("paypalClientId", value)}
            placeholder="Abc123..."
          />
          <Field
            label="Merchant ID"
            value={form.paypalMerchantId}
            onChange={(value) => updateField("paypalMerchantId", value)}
            placeholder="XYZMERCHANT..."
          />
          <Field
            label="Client Secret"
            value={form.paypalClientSecret}
            onChange={(value) => updateField("paypalClientSecret", value)}
            placeholder="Secret..."
          />
          <Field
            label="Webhook ID"
            value={form.paypalWebhookId}
            onChange={(value) => updateField("paypalWebhookId", value)}
            placeholder="Webhook..."
          />
          <label className="space-y-2 text-sm md:col-span-2">
            <span className="font-medium text-gray-700">Entorno</span>
            <select
              value={form.paypalEnvironment}
              onChange={(e) => updateField("paypalEnvironment", e.target.value)}
              className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="sandbox">Sandbox</option>
              <option value="live">Live</option>
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Transferencia / comprobantes</h2>
        <p className="mt-1 text-sm text-gray-500">
          Este texto puede usarse después para mostrar instrucciones al cliente cuando suba su comprobante.
        </p>

        <label className="mt-6 block space-y-2 text-sm">
          <span className="font-medium text-gray-700">Instrucciones</span>
          <textarea
            value={form.transferInstructions}
            onChange={(e) => updateField("transferInstructions", e.target.value)}
            rows={6}
            placeholder="Banco, cuenta, nombre del titular, mensaje de verificación, etc."
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500"
          />
        </label>
      </section>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Guardando..." : "Guardar configuración"}
        </Button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="space-y-2 text-sm">
      <span className="font-medium text-gray-700">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
      />
    </label>
  );
}
