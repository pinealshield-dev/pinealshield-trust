"use client";

import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";

interface Props {
  identifier: string;
  createdAt: string;
  verificationOrigin?: string;
  chainValid?: boolean;
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
  const [mounted, setMounted] = useState(false);
  const [timestamp, setTimestamp] = useState<string>("");

  useEffect(() => {
    setMounted(true);
    setTimestamp(new Date(createdAt).toLocaleString());
  }, [createdAt]);

  return (
    <div className="mt-6 rounded-lg border border-slate-800 bg-black/40 p-4 text-sm">

      {/* 🔒 CAMBIO: ya NO es estado, es evidencia */}
      <div className="flex items-center gap-2 text-slate-300">
        <ShieldCheck className="h-5 w-5 text-emerald-400" />
        <span className="font-medium">
          Registro certificado
        </span>
      </div>

      <dl className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 text-slate-300">
        <div>
          <dt className="text-xs uppercase text-slate-500">
            Hash (masked)
          </dt>
          <dd className="font-mono">
            {maskHash(identifier)}
          </dd>
        </div>

        <div>
          <dt className="text-xs uppercase text-slate-500">
            Timestamp
          </dt>
          <dd suppressHydrationWarning>
            {mounted ? timestamp : "—"}
          </dd>
        </div>
      </dl>

      {verificationOrigin && (
        <div className="mt-2">
          <dt className="text-xs uppercase text-slate-500">
            Verification Origin
          </dt>
          <dd className="font-mono text-emerald-400">
            {verificationOrigin}
          </dd>
        </div>
      )}

      <p className="mt-3 text-xs text-slate-500">
        Evidencia criptográfica asociada al registro verificado.
      </p>
    </div>
  );
}