"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

interface Props {
  value: string;
  expiresAt: Date;
}

export function DynamicQR({ value, expiresAt }: Props) {
  const [mounted, setMounted] = useState(false);
  const [label, setLabel] = useState("");

  useEffect(() => {
    setMounted(true);
    const date = new Date(expiresAt);

    const update = () => setLabel(date.toLocaleTimeString());
    update();

    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  return (
    <div className="mt-6 rounded-xl border border-slate-800 bg-black/20 p-5 text-center">
      
      <div className="mx-auto flex h-[140px] w-[140px] items-center justify-center rounded-lg bg-black">
        <QRCodeSVG
          value={value}
          size={130}
          level="M"
          fgColor="#ffffff"
          bgColor="#000000"
        />
      </div>

      <p className="mt-3 text-xs text-slate-400">
        <span suppressHydrationWarning>
          Código de verificación ·{" "}
          {mounted ? (
            <>
              válido hasta{" "}
              <span className="text-slate-200">{label}</span>
            </>
          ) : (
            "generando…"
          )}
        </span>
      </p>
    </div>
  );
}