import Link from "next/link";

import type { VerifyV2RecordResult } from "@/lib/verify/types";
import { VERIFICATION_LAYER_VERSION } from "@/lib/version";

type Props = {
  result: VerifyV2RecordResult;
  identifier: string;
};

const STATUS_LABELS: Record<VerifyV2RecordResult["status"], string> = {
  verified: "ACTIVO",
  revoked: "REVOCADO",
  replaced: "REEMPLAZADO",
  expired: "EXPIRADO",
  suspended: "SUSPENDIDO",
};

function humanizeKey(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Sí" : "No";
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  return JSON.stringify(value);
}

function formatDate(value: string | null) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("es-MX", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function RecordView({ result }: Props) {
  const isActive = result.status === "verified";
  const issuerVerified = result.issuer_status !== "unverified";
  const publicEntries = Object.entries(result.public_data ?? {});
  const localizedTitle =
    result.template_labels?.es ?? result.template_name ?? "Registro verificable";

  return (
    <main className="min-h-screen bg-black px-4 py-10 text-white sm:py-16">
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950/80 p-6 shadow-2xl sm:p-10">
          <div className="flex flex-col gap-5 border-b border-zinc-900 pb-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-cyan-400">
                Pineal Shield · Registro verificable
              </p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                {localizedTitle}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-500">
                Registro emitido por una organización mediante la infraestructura de confianza verificable de Pineal Shield.
              </p>
            </div>

            <span
              className={`w-fit rounded-full border px-4 py-2 text-xs font-medium tracking-[0.16em] ${
                isActive
                  ? "border-emerald-800 bg-emerald-950/30 text-emerald-300"
                  : "border-amber-800 bg-amber-950/30 text-amber-300"
              }`}
            >
              {STATUS_LABELS[result.status]}
            </span>
          </div>

          <section className="grid gap-4 border-b border-zinc-900 py-8 sm:grid-cols-2">
            <div className="rounded-2xl border border-zinc-900 bg-black/30 p-5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                Emitido por
              </p>
              <p className="mt-2 text-lg font-medium text-white">
                {result.issuer_name}
              </p>
              <p className={`mt-2 text-xs ${issuerVerified ? "text-cyan-300" : "text-amber-300"}`}>
                {issuerVerified
                  ? `Organización ${result.issuer_status}`
                  : "Identidad de la organización aún no verificada por Pineal Shield"}
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-900 bg-black/30 p-5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                Identificador público
              </p>
              <p className="mt-2 break-all font-mono text-sm text-cyan-300">
                {result.public_id}
              </p>
              <p className="mt-2 text-xs text-zinc-600">
                Tipo: {result.entity_type} · {result.record_type}
              </p>
            </div>
          </section>

          <section className="border-b border-zinc-900 py-8">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-300">
              Información pública
            </h2>

            {publicEntries.length > 0 ? (
              <dl className="mt-5 divide-y divide-zinc-900 rounded-2xl border border-zinc-900 px-5">
                {publicEntries.map(([key, value]) => (
                  <div
                    key={key}
                    className="grid gap-1 py-4 sm:grid-cols-[180px_1fr] sm:gap-6"
                  >
                    <dt className="text-xs uppercase tracking-[0.12em] text-zinc-600">
                      {humanizeKey(key)}
                    </dt>
                    <dd className="break-words text-sm text-zinc-200">
                      {formatValue(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-4 text-sm text-zinc-600">
                Este registro no expone campos públicos adicionales.
              </p>
            )}
          </section>

          <section className="grid gap-5 border-b border-zinc-900 py-8 sm:grid-cols-2">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                Emitido
              </p>
              <p className="mt-2 text-sm text-zinc-300">
                {formatDate(result.issued_at)}
              </p>
            </div>

            {result.expires_at ? (
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                  Expira
                </p>
                <p className="mt-2 text-sm text-zinc-300">
                  {formatDate(result.expires_at)}
                </p>
              </div>
            ) : null}

            {result.revoked_at ? (
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                  Revocado
                </p>
                <p className="mt-2 text-sm text-zinc-300">
                  {formatDate(result.revoked_at)}
                </p>
              </div>
            ) : null}
          </section>

          <section className="py-8">
            <div className="rounded-2xl border border-zinc-900 bg-black/30 p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                    Fingerprint de integridad registrado
                  </p>
                  <p className="mt-2 break-all font-mono text-xs leading-relaxed text-zinc-400">
                    {result.integrity_hash}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-zinc-600">
                  {result.hash_algorithm.toUpperCase()} · {result.hash_version}
                </span>
              </div>
            </div>

            <p className="mt-5 text-xs leading-relaxed text-zinc-600">
              Pineal Shield confirma la procedencia, estado y fingerprint registrados para este Record. El estado de verificación del emisor se muestra por separado y no implica que Pineal Shield haya auditado cada afirmación contenida en el registro.
            </p>
          </section>

          <div className="border-t border-zinc-900 pt-7 text-center">
            <Link
              href="/verify"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-800 px-4 py-2 text-sm text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-900/50"
            >
              Verificar otro código
            </Link>

            <footer className="mt-8 text-[10px] uppercase tracking-[0.22em] text-zinc-700">
              Verification Layer · {VERIFICATION_LAYER_VERSION}
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
