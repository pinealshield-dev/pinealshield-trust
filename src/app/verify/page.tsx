import type { Metadata } from "next";
import VerifyClient from "./VerifyClient";

export const metadata: Metadata = {
  title: "Pineal Shield — Verificación Oficial",
  description:
    "Validación criptográfica oficial de registros de autenticidad.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function VerifyPage() {
  return <VerifyClient />;
}
