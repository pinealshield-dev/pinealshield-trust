import { VERIFICATION_LAYER_VERSION } from "@/lib/version";
import { ShieldCheck, ShieldX, AlertTriangle } from "lucide-react";

type Status = "verified" | "revoked" | "replaced" | "compromised";

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
      container: "border-emerald-500/40 bg-emerald-500/10",
      icon: <ShieldCheck className="h-5 w-5 text-emerald-400" />,
      label: "Registro verificado · Pineal Shield",
      text: "text-emerald-400",
    },
    revoked: {
      container: "border-red-500/40 bg-red-500/10",
      icon: <ShieldX className="h-5 w-5 text-red-400" />,
      label: "Registro revocado",
      text: "text-red-400",
    },
    replaced: {
      container: "border-yellow-500/40 bg-yellow-500/10",
      icon: <AlertTriangle className="h-5 w-5 text-yellow-400" />,
      label: "Registro reemplazado",
      text: "text-yellow-400",
    },
    compromised: {
      container: "border-yellow-500/40 bg-yellow-500/10",
      icon: <AlertTriangle className="h-5 w-5 text-yellow-400" />,
      label: "Registro con integridad comprometida",
      text: "text-yellow-400",
    },
  };

  const effectiveStatus =
  status === "verified" && !chainValid ? "compromised" : status;
  const current = styles[effectiveStatus];

  return (
    <main className="mx-auto max-w-2xl p-4 sm:p-6 text-slate-100">
      <div className="rounded-xl border border-slate-800 bg-black/40 p-5">

        {/* HEADER */}
        <div className="mb-4 border-b border-slate-800 pb-4">
          <p className="text-[10px] tracking-[0.25em] text-slate-500">
            PINEAL SHIELD REGISTRY
          </p>

          <h1 className="mt-1 text-lg font-semibold text-slate-100">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-2 text-sm text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        {/* STATUS */}
        <div className={`mb-5 rounded-lg border p-4 ${current.container}`}>
          <div className={`flex items-center gap-2 ${current.text}`}>
            {current.icon}
            <span className="font-semibold">
              {current.label}
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-300">
            {status === "verified"
              ? chainValid
                ? "Registro verificado dentro de la infraestructura Pineal Shield. Este registro forma parte de una cadena de verificación íntegra y consistente."
                : "Registro verificado con advertencia de integridad. La cadena de verificación presenta inconsistencias. Se recomienda validación adicional con la entidad emisora."
              : "Estado del registro determinado por la entidad emisora dentro de la infraestructura Pineal Shield."}
          </p>
        </div>

        {/* 🔴 INTEGRITY BLOCK (DIFERENCIADOR REAL) */}
        {status === "verified" && (
          <div
            className={`mb-5 rounded-lg border p-4 ${
              chainValid
                ? "border-emerald-500/20 bg-black/30"
                : "border-yellow-500/40 bg-yellow-500/10"
            }`}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-wide text-slate-500">
                  Registry Integrity
                </span>

                <span className="text-[11px] text-slate-500">
                  Cryptographic Chain Verification
                </span>
              </div>

              <span
                className={`text-xs font-semibold ${
                  chainValid
                    ? "text-emerald-400"
                    : "text-yellow-400"
                }`}
              >
                {chainValid ? "VALID" : "COMPROMISED"}
              </span>
            </div>

            {/* DESCRIPTION */}
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              {chainValid
                ? "Este registro forma parte de una secuencia de eventos criptográficamente verificable y resistente a alteraciones."
                : "Se detectó una inconsistencia en la cadena de eventos. La integridad del registro no puede garantizarse completamente."}
            </p>

            {/* 🔴 DIFERENCIADOR (MODELO) */}
            <div className="mt-3 text-[11px] text-slate-500 border-t border-slate-800 pt-2">
              Verification model: event-based cryptographic chain
            </div>
          </div>
        )}

        {/* CONTENT */}
        {children}

        {/* FOOTER */}
        <div className="mt-6 text-center">
          <a
            href="/verify"
            className="rounded-lg border border-slate-800 px-4 py-2 text-sm text-slate-300 hover:bg-slate-900"
          >
            Verificar otro código
          </a>

          <footer className="mt-6 text-[10px] text-slate-600 tracking-wide">
            Verification Layer · {VERIFICATION_LAYER_VERSION}
          </footer>
        </div>

      </div>
    </main>
  );
}