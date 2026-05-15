import { ShieldCheck } from "lucide-react";

interface Props {
  identifier: string;
  createdAt: string;
  verificationOrigin?: string;
  chainValid?: boolean;
}
function formatInstitutionalDate(date: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(date));
}

function maskHash(identifier: string) {
  if (identifier.length <= 8) return identifier;
  return `${identifier.slice(0, 4)}••••${identifier.slice(-4)}`;
}

export function CertificateSignature({
  identifier,
  createdAt,
  verificationOrigin,
}: Props) {
 

  return (
    <div className="mt-6 rounded-xl border border-slate-800 bg-black/20 p-5">

      {/* 🔒 CAMBIO: ya NO es estado, es evidencia */}
      <div className="flex items-center gap-2 text-slate-300">
        <ShieldCheck className="h-4 w-4 text-emerald-300" />

        <span className="text-sm font-medium tracking-wide">
          Registro validado
        </span>
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-2">
        <div>
          <dt className="text-[11px] uppercase tracking-wide text-slate-500">
            Huella criptográfica
          </dt>
          <dd className="mt-1 font-mono text-sm text-slate-200">
            {maskHash(identifier)}
          </dd>
        </div>

        <div>
          <dt className="text-[11px] uppercase tracking-wide text-slate-500">
            Registro temporal
          </dt>
          <dd className="mt-1 text-sm text-slate-200">
            {formatInstitutionalDate(createdAt)}
          </dd>
        </div>
      </dl>

      {verificationOrigin && (
        <div className="mt-2">
          <dt className="text-[11px] uppercase tracking-wide text-slate-500">
            Origen de validación
          </dt>
          <dd className="mt-1 font-mono text-sm text-emerald-300">
            {verificationOrigin}
          </dd>
        </div>
      )}

      <p className="mt-4 border-t border-slate-800 pt-3 text-[11px] leading-relaxed text-slate-500">
        Referencia documental asociada al registro validado.
      </p>
    </div>
  );
}