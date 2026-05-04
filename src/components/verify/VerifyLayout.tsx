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
      container: "border-emerald-500/40 bg-emerald-500/10",
      icon: <ShieldCheck className="h-5 w-5 text-emerald-400" />,
      label: "Autenticidad verificada",
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
      container: "border-red-500/40 bg-red-500/10",
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
      "Este producto es auténtico y coincide con los registros oficiales.",
    revoked:
      "Este registro ha sido invalidado por la entidad emisora.",
    replaced:
      "Este registro ha sido reemplazado por una versión más reciente.",
    compromised:
      "Se detectó una inconsistencia en la integridad del registro. No puede garantizarse su autenticidad.",
    unverified:
      "Este código no es reconocido dentro de la infraestructura Pineal Shield.",
  };

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
            {message[effectiveStatus]}
          </p>
          <p className="mt-2 text-[11px] text-slate-500">
            Validación pública certificada por Pineal Shield.
          </p>
        </div>

       

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