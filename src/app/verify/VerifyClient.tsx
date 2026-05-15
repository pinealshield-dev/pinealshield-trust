"use client";

import { useState } from "react";

const MIN_LEN = 8;
const MAX_LEN = 64;

export default function VerifyClient() {
  const [code, setCode] = useState("");

  const onVerify = () => {
    const identifier = code.trim();
    if (identifier.length < MIN_LEN || identifier.length > MAX_LEN) return;

    // Navegación dura, segura y simple
    window.location.assign(`/verify/${encodeURIComponent(identifier)}`);
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 text-slate-100">
      <p className="text-[10px] tracking-[0.28em] text-slate-500">
        PINEAL SHIELD REGISTRY
      </p>

      <h1 className="mt-2 text-[2.15rem] font-semibold tracking-[-0.02em] text-slate-100">
        Verificación institucional
      </h1>

      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
        Consulta pública orientada a validación documental, trazabilidad verificable y consistencia operativa de registros emitidos dentro de Pineal Shield.
      </p>

      <div className="mt-6 rounded-xl border border-slate-800/80 bg-slate-950/40 p-6">
        <p className="text-sm text-slate-300">
          Ingresa una referencia verificable o utiliza un identificador emitido por la entidad correspondiente.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            autoComplete="one-time-code"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={MAX_LEN}
            placeholder="PS-XXXX-2026-0000001"
            className="
              w-full
              rounded-lg
              bg-slate-950/60
              px-3
              py-2
              text-sm
              outline-none
              ring-1 ring-slate-800
              placeholder:text-slate-700
              transition-colors
              focus:ring-sky-700
              min-h-[44px]
            "
          />

          <button
            type="button"
            onClick={onVerify}
            className="
              w-full
              sm:w-auto
              rounded-lg
              border border-slate-600
              bg-black
              px-4
              py-2
              text-sm
              font-medium
              text-slate-200
              shadow-[0_0_0_1px_rgba(255,255,255,0.02)]
              transition-colors
              hover:border-slate-500
              hover:bg-slate-950
              min-h-[44px]
            "
          >
            Verificar registro
          </button>
        </div>

        <p className="mt-2 text-xs text-slate-500">
          Referencia verificable emitida por una entidad registrada dentro de Pineal Shield.
        </p>

        <p className="mt-3 text-xs text-slate-500">
          La validación refleja el estado operativo actual asociado al identificador consultado.
        </p>
      </div>

      <div className="mt-12 border-t border-slate-900 pt-7">
        <p className="text-[10px] uppercase tracking-[0.24em] text-slate-600">
          Cliente móvil institucional
        </p>

        <p className="mt-2 text-xs leading-relaxed text-slate-500">
          Pineal ID permite validación móvil institucional y consulta de referencias verificables desde dispositivos autorizados.
        </p>
      </div>
    </main>
  );
}
