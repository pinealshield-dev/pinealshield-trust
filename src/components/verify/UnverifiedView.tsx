import VerifyLayout from "@/components/verify/VerifyLayout";
import { ErrorAutoBack } from "@/components/verify/ErrorAutoBack";

type Props = {
  variant?: "not_found" | "error";
};

export function UnverifiedView({ variant = "not_found" }: Props) {

  const content = {
    not_found: {
      title: "Registro no encontrado",
      subtitle: "Código no reconocido",
      description:
        "Este identificador no existe dentro de la infraestructura Pineal Shield.",
      status: "unverified" as const,
    },
    error: {
      title: "No verificable",
      subtitle: "Error de validación",
      description:
        "No fue posible validar este registro en este momento.",
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
      <div className="text-center text-sm text-slate-400">
        {current.description}
      </div>

      <ErrorAutoBack />
    </VerifyLayout>
  );
}