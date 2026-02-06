"use client";

import { useState } from "react";

const MIN_LEN = 8;
const MAX_LEN = 32;

export default function VerifyClient() {
  const [code, setCode] = useState("");

  const onVerify = () => {
    const hash = code.trim();
    if (hash.length < MIN_LEN || hash.length > MAX_LEN) return;

    // Navegación dura, segura y simple
    window.location.assign(`/verify/${encodeURIComponent(hash)}`);
  };

  return (
    <main className="mx-auto max-w-3xl p-6 text-slate-100">
      <h1 className="text-3xl font-semibold">
        Pineal Shield — Verificación Oficial
      </h1>

      <p className="mt-2 text-slate-400">
        Validación criptográfica oficial de productos y piezas certificadas.
      </p>

      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <p className="text-sm text-slate-300">
          Escanea un QR o NFC, o ingresa el código para verificar la autenticidad
          del producto.
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
            placeholder="Ingresa el código de verificación"
            className="
              w-full
              rounded-lg
              bg-black/40
              px-3
              py-2
              text-sm
              outline-none
              ring-1 ring-slate-800
              focus:ring-emerald-600
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
              bg-emerald-600
              px-4
              py-2
              text-sm
              font-medium
              text-black
              hover:bg-emerald-500
              min-h-[44px]
            "
          >
            Verificar autenticidad
          </button>
        </div>

        <p className="mt-2 text-xs text-slate-500">
          Código alfanumérico proporcionado por la marca emisora.
        </p>

        <p className="mt-3 text-xs text-slate-500">
          Verificador público de solo lectura. No requiere inicio de sesión.
        </p>
      </div>
    </main>
  );
}
