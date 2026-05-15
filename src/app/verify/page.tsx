import type { Metadata } from "next";
import VerifyClient from "./VerifyClient";

export const metadata: Metadata = {
  title: "Pineal Shield — Verificación institucional",
  description:
    "Infraestructura pública de validación documental y verificación institucional operada por Pineal Shield.",
  robots: {
    index: true,
    follow: false,
  },
};

export default function VerifyPage() {
  return <VerifyClient />;
}
