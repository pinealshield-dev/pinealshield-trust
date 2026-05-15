import VerifyLayout from "@/components/verify/VerifyLayout";
import { ErrorAutoBack } from "@/components/verify/ErrorAutoBack";

type Props = {
  variant?: "not_found" | "error";
};

export function UnverifiedView({ variant = "not_found" }: Props) {

  const content = {
    not_found: {
      title: "Registro no encontrado",
      subtitle: "Referencia no verificable",
      description:
        "No fue posible encontrar una referencia verificable asociada a este identificador.",
      status: "unverified" as const,
    },
    error: {
      title: "Validación temporalmente no disponible",
      subtitle: "Verificación no completada",
      description:
        "La verificación pública no pudo completarse temporalmente. Intente nuevamente más tarde.",
      status: "unverified" as const,
    },
  };

  const current = content[variant];

  return (
    <VerifyLayout
      status={current.status}
      title={current.title}
      subtitle={current.subtitle}
    >
      <div className="rounded-xl border border-slate-800 bg-black/20 px-5 py-6 text-center">
      <p className="text-sm leading-relaxed text-slate-400">
        {current.description}
        </p>
      </div>

      <p className="mt-5 text-center text-[11px] tracking-[0.12em] text-slate-500">
        Regresando automáticamente al portal de verificación…
      </p>

      <ErrorAutoBack />
    </VerifyLayout>
  );
}