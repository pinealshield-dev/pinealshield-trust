// src/app/verify/[hash]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { verifyByHash } from "@/lib/verify/lookup";

import { ErrorAutoBack } from "@/components/verify/ErrorAutoBack";
import { CertificateSignature } from "@/components/verify/CertificateSignature";
import { DynamicQR } from "@/components/verify/DynamicQR";
import { ImagePlaceholder } from "@/components/verify/ImagePlaceholder";

export const metadata: Metadata = {
  title: "Pineal Shield — Certificado",
  robots: {
    index: false,
    follow: false,
  },
};

interface Props {
  params: {
    hash?: string | string[];
  };
}

export default async function VerifyByHashPage({ params }: Props) {
  const { hash: raw } = await params;

  const hash =
    typeof raw === "string"
      ? decodeURIComponent(raw).trim()
      : Array.isArray(raw)
      ? decodeURIComponent(raw[0]).trim()
      : "";

  if (!hash || hash.length < 8 || hash.length > 32) {
    notFound();
  }

  const result = await verifyByHash(hash);

  /* ===============================
   * ESTADO: NO VERIFICABLE
   * (anti-enumeración estricta)
   * =============================== */
  if (result.status !== "verified") {
    return (
      <main className="mx-auto max-w-3xl p-6 text-slate-100">
        <div className="rounded-xl border border-slate-800 bg-black/40 p-6">
          <div className="mb-4 rounded-lg border border-slate-600/40 bg-slate-600/10 p-4">
            <p className="font-semibold text-slate-300">
              Certificado no verificable
            </p>
            <p className="mt-1 text-sm text-slate-400">
              El código ingresado no corresponde a un certificado activo o
              verificable en este momento.
            </p>
          </div>

          <p className="mt-2 text-xs text-slate-500">
            Esto no indica un fallo del sistema. Verifica el código o consulta con
            la entidad emisora.
          </p>

          <div className="mt-6">
            <a
              href="/verify"
              className="rounded-lg border border-slate-800 px-4 py-2 text-sm text-slate-300 hover:bg-slate-900"
            >
              Verificar otro código
            </a>
          </div>

          <ErrorAutoBack />
        </div>
      </main>
    );
  }

  /* ===============================
   * ESTADO: CERTIFICACIÓN VÁLIDA
   * =============================== */

  return (
    <main className="mx-auto max-w-3xl p-6 text-slate-100">
      <div className="rounded-xl border border-slate-800 bg-black/40 p-6">
        {/* HEADER DE CONFIANZA */}
        <div className="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-500/15 p-4">
          <p className="font-semibold text-emerald-400">
            Certificación válida · Pineal Shield®
          </p>
          <p className="mt-1 text-sm text-slate-300">
            Este producto cuenta con un registro digital de autenticidad
            verificado criptográficamente.
          </p>
        </div>

        {/* IMAGEN */}
        {result.image_url ? (
          <div className="mb-4 overflow-hidden rounded-xl border border-slate-800 bg-black">
            <img
              src={result.image_url}
              alt={result.nombre}
              className="w-full max-h-[420px] object-contain bg-black"
              loading="lazy"
            />
          </div>
        ) : (
          <ImagePlaceholder />
        )}

        {/* DATOS PRINCIPALES */}
        <h2 className="text-xl font-semibold">Certificación válida</h2>

        <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase text-slate-400">Tipo</dt>
            <dd className="text-lg">
              {result.kind === "producto" ? "Producto" : "Pieza"}
            </dd>
          </div>

          <div>
            <dt className="text-xs uppercase text-slate-400">Nombre</dt>
            <dd className="text-lg">{result.nombre}</dd>
          </div>

          <div>
            <dt className="text-xs uppercase text-slate-400">Registrado</dt>
            <dd className="text-lg">
              {new Date(result.issued_at).toLocaleString()}
            </dd>
          </div>
        </dl>

        <p className="mt-4 text-xs text-slate-400">
          Verificación realizada en tiempo real mediante la infraestructura de
          confianza de Pineal Shield.
        </p>

        {/* FIRMA VISUAL */}
        <CertificateSignature
          hash={hash}
          createdAt={result.issued_at}
        />

        {/* QR DINÁMICO */}
        <DynamicQR
          value={hash}
          expiresAt={new Date(result.qr_exp)}
        />


        {/* ACCIÓN FINAL */}
        <div className="mt-6">
          <a
            href="/verify"
            className="rounded-lg border border-slate-800 px-4 py-2 text-sm text-slate-300 hover:bg-slate-900"
          >
            Intentar con otro código
          </a>

          {/* FOOTER TÉCNICO */}
          <p className="mt-6 text-center text-[10px] text-slate-600">
            Verification Layer · 2026.03
          </p>
        </div>
      </div>
    </main>
  );
}
