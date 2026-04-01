import type { Metadata } from "next";
import VerifyClient from "./VerifyClient";

export const metadata: Metadata = {
  title: "Pineal Shield — Verificación Oficial",
  description:
    "Verificación pública de registros dentro de la infraestructura Pineal Shield.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function VerifyPage() {
  return <VerifyClient />;
}
