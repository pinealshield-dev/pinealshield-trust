"use client";

import { QRCodeSVG } from "qrcode.react";

interface Props {
  value: string;
  expiresAt: Date;
}

export function DynamicQR({ value, expiresAt }: Props) {
  const label = new Date(expiresAt).toLocaleTimeString();

  return (
    <div className="mt-6 rounded-2xl border border-slate-800 bg-black/20 px-5 py-6 text-center">
      <div className="relative mx-auto flex h-[140px] w-[140px] items-center justify-center rounded-lg bg-slate-950">
        <div
          className="
            absolute inset-0
            flex items-center justify-center
            opacity-[0.075]
            pointer-events-none
          "
        >
          <img
            src="/pineal-mark.png"
            alt=""
            className="h-[118px] w-[118px] object-contain"
          />
        </div>

        <QRCodeSVG
          value={value}
          size={126}
          level="M"
          fgColor="#ffffff"
          bgColor="#000000"
        />
      </div>

      <p className="mt-3 text-xs text-slate-300">
        Código dinámico de validación institucional
      </p>

      <p className="mt-1 text-[11px] text-slate-500">
        Actualización automática activa{" "}
        <span suppressHydrationWarning>· {label}</span>
      </p>

      <p className="mt-1 text-[11px] text-slate-600">
        Código temporal asociado a la validación institucional activa.
      </p>
    </div>
  );
}