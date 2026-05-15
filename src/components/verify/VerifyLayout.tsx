import { VERIFICATION_LAYER_VERSION } from "@/lib/version";
import { ShieldCheck, ShieldX, AlertTriangle } from "lucide-react";

type Status =
  | "verified"
  | "revoked"
  | "replaced"
  | "compromised"
  | "unverified";

interface Props {
  status: Status;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  chainValid?: boolean;
}

export default function VerifyLayout({
  status,
  title,
  subtitle,
  children,
  chainValid = true,
}: Props) {
  const styles = {
    verified: {
      container: "border-emerald-900/50 bg-emerald-950/30",
      icon: <ShieldCheck className="h-5 w-5 text-emerald-300" />,
      label: "Registro verificado",
      text: "text-emerald-400",
    },
    revoked: {
      container: "border-red-900/40 bg-red-950/25",
      icon: <ShieldX className="h-5 w-5 text-red-300" />,
      label: "Registro revocado",
      text: "text-red-400",
    },
    replaced: {
      container: "border-amber-900/40 bg-amber-950/20",
      icon: <AlertTriangle className="h-5 w-5 text-yellow-300" />,
      label: "Registro reemplazado",
      text: "text-yellow-400",
    },
    compromised: {
      container: "border-red-800/60 bg-red-950/35",
      icon: <AlertTriangle className="h-5 w-5 text-red-400" />,
      label: "Integridad comprometida",
      text: "text-red-400",
    },
    unverified: {
      container: "border-slate-700 bg-slate-800/40",
      icon: <ShieldX className="h-5 w-5 text-slate-400" />,
      label: "Registro no encontrado",
      text: "text-slate-400",
    },
  };

  const effectiveStatus =
    status === "verified" && !chainValid ? "compromised" : status;

  const current = styles[effectiveStatus];

  // 🔴 COPY CENTRALIZADO (CLAVE)
  const message = {
    verified:
      "Este registro mantiene consistencia con la información emitida dentro de Pineal Shield.",
    revoked:
      "Este registro dejó de estar vigente dentro de Pineal Shield.",
    replaced:
      "Este registro fue sustituido por una referencia verificable más reciente.",
    compromised:
      "Se detectó una inconsistencia operativa en la validación del registro.",
    unverified:
      "No existe una referencia verificable asociada a este identificador.",
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-5 sm:px-6 sm:py-8 text-slate-100">
      <div className="rounded-2xl border border-slate-800 bg-black/30 p-5 sm:p-6">

        {/* HEADER */}
        <div className="mb-4 border-b border-slate-800 pb-5">
          <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
            PINEAL SHIELD REGISTRY
          </p>

          <h1 className="mt-2 text-[26px] font-semibold tracking-tight text-slate-100 leading-tight">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-3 font-mono text-sm text-slate-300 break-all">
              {subtitle}
            </p>
          )}
        </div>

        {/* STATUS */}
        <div className={`mb-5 rounded-lg border p-4 ${current.container}`}>
          <div className={`flex items-center gap-2 ${current.text}`}>
            {current.icon}
            <span className="text-sm font-semibold tracking-wide">
              {current.label}
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-300">
            {message[effectiveStatus]}
          </p>
          <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
            Infraestructura institucional orientada a validación, trazabilidad y consistencia verificable.
          </p>
        </div>

       

        {/* CONTENT */}
        {children}


        {/* FOOTER */}
        <div className="mt-6 text-center">
          <a
            href="/verify"
            className="inline-flex items-center justify-center rounded-xl border border-slate-800 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-700 hover:bg-slate-900/50"
          >
            Verificar otro código
          </a>

          <footer className="mt-8 text-[10px] uppercase tracking-[0.22em] text-slate-600">
            Verification Layer · {VERIFICATION_LAYER_VERSION}
          </footer>
        </div>

      </div>
    </main>
  );
}