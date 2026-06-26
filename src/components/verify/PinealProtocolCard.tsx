import { Fingerprint, ShieldCheck } from "lucide-react";
import type { VerifyPvpSnapshot } from "@/lib/verify/types";

type Props = {
  pvp?: VerifyPvpSnapshot;
  mode?: "verified" | "revoked" | "replaced" | "document";
};

function shortHash(value?: string) {
  if (!value) return "—";
  if (value.length <= 20) return value;
  return `${value.slice(0, 12)}…${value.slice(-8)}`;
}

function formatEvent(eventType?: string) {
  switch (eventType) {
    case "issued":
      return "Emisión firmada";
    case "revoked":
      return "Revocación firmada";
    case "replaced":
      return "Reemplazo firmado";
    default:
      return eventType ?? "Evento firmado";
  }
}

function formatDate(value?: string) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZoneName: "short",
  }).format(new Date(value));
}

export default function PinealProtocolCard({
  pvp,
  mode = "verified",
}: Props) {
  if (!pvp?.signed) {
    return null;
  }

  const isRevoked = mode === "revoked" || pvp.event_type === "revoked";

    const localVerification = pvp.local_verification;

  const evidenceLabel = localVerification?.checked
    ? localVerification.valid
      ? "FIRMA VERIFICADA"
      : "FIRMA NO VERIFICADA"
    : pvp.status === "active"
    ? "EVIDENCIA VIGENTE"
    : pvp.status?.toUpperCase?.() ?? "EVIDENCIA";

  return (
    <div
      className={`mt-6 rounded-xl border p-5 ${
        isRevoked
          ? "border-red-900/40 bg-red-950/10"
          : "border-cyan-900/40 bg-cyan-950/10"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`mt-0.5 rounded-lg border p-2 ${
              isRevoked
                ? "border-red-900/50 bg-red-950/20"
                : "border-cyan-900/50 bg-cyan-950/20"
            }`}
          >
            <ShieldCheck
              className={`h-4 w-4 ${
                isRevoked ? "text-red-300" : "text-cyan-300"
              }`}
            />
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Pineal Protocol
            </p>

            <h3 className="mt-1 text-sm font-semibold text-slate-100">
              Evento respaldado por firma criptográfica
            </h3>

            <p className="mt-2 max-w-xl text-xs leading-relaxed text-slate-400">
              {isRevoked
                ? "La revocación de este identificador está registrada como evento firmado dentro de Pineal Protocol."
                : "Este identificador cuenta con evidencia criptográfica asociada al evento de emisión certificado por Pineal Shield."}
            </p>
          </div>
        </div>

        <span
          className={`shrink-0 text-xs font-medium tracking-wide ${
            isRevoked ? "text-red-300" : "text-cyan-300"
          }`}
        >
          {evidenceLabel}
        </span>
      </div>

      <dl className="mt-5 grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-2">
        <div>
          <dt className="text-[11px] uppercase tracking-wide text-slate-500">
            Evento firmado
          </dt>
          <dd className="mt-1 text-sm text-slate-200">
            {formatEvent(pvp.event_type)}
          </dd>
        </div>

        <div>
          <dt className="text-[11px] uppercase tracking-wide text-slate-500">
            Algoritmo
          </dt>
          <dd className="mt-1 font-mono text-sm text-slate-200">
            {pvp.algorithm}
          </dd>
        </div>

        <div>
          <dt className="text-[11px] uppercase tracking-wide text-slate-500">
            Autoridad de firma
          </dt>
          <dd className="mt-1 font-mono text-xs text-slate-300">
            {pvp.issuer_id}
          </dd>
        </div>

        <div>
          <dt className="text-[11px] uppercase tracking-wide text-slate-500">
            ID de la Llave
          </dt>
          <dd className="mt-1 font-mono text-xs text-slate-300">
            {pvp.key_id}
          </dd>
        </div>

        <div>
          <dt className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-slate-500">
            <Fingerprint className="h-3 w-3" />
            Huella PVP
          </dt>
          <dd className="mt-1 font-mono text-xs text-slate-200">
            {shortHash(pvp.payload_hash)}
          </dd>
        </div>

               {localVerification?.checked && (
          <div>
            <dt className="text-[11px] uppercase tracking-wide text-slate-500">
              Verificación local
            </dt>
            <dd
              className={`mt-1 text-sm font-medium ${
                localVerification.valid
                  ? "text-emerald-300"
                  : "text-yellow-300"
              }`}
            >
              {localVerification.valid
                ? "Firma válida"
                : "No concluyente"}
            </dd>
          </div>
        )} 

        <div>
          <dt className="text-[11px] uppercase tracking-wide text-slate-500">
            Firmado
          </dt>
          <dd className="mt-1 text-sm text-slate-200">
            {formatDate(pvp.signed_at)}
          </dd>
        </div>
      </dl>

      <p className="mt-5 border-t border-slate-800 pt-3 text-[11px] leading-relaxed text-slate-500">
        Pineal Protocol registra evidencia criptográfica del evento consultado.
        Esta validación no sustituye la revisión contractual, legal o física del
        activo asociado.
      </p>
    </div>
  );
}