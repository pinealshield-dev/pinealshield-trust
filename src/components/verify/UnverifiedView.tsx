import VerifyLayout from "@/components/verify/VerifyLayout";
import { ErrorAutoBack } from "@/components/verify/ErrorAutoBack";

export function UnverifiedView() {
  return (
    <VerifyLayout
      status="replaced" // visual neutro
      title="Registro no verificable"
      subtitle="Código no válido"
    >
      <div className="text-center text-sm text-slate-400">
        El código ingresado no corresponde a un registro válido dentro de la
        infraestructura Pineal Shield.
      </div>

      {/* 🔴 SOLO AQUÍ SE MANTIENE */}
      <ErrorAutoBack />
    </VerifyLayout>
  );
}