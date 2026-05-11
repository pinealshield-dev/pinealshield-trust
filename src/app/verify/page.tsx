import type { Metadata } from "next";
import VerifyClient from "./VerifyClient";

export const metadata: Metadata = {
  title: "Pineal Shield — Verificación de Registros",
  description:
    "Consulta pública del estado de registros emitidos dentro de Pineal Shield.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function VerifyPage() {
  return <VerifyClient />;
}
