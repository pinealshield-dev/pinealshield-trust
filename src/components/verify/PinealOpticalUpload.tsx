"use client";

import { useMemo, useState } from "react";
import {
  ExternalLink,
  Fingerprint,
  Loader2,
  ShieldCheck,
  ShieldX,
  UploadCloud,
} from "lucide-react";

type OpticalApiPayload = {
  valid?: boolean;
  reason?: string;
  detail?: unknown;
  format?: string;
  strategy?: string;
  source?: string;
  identifier?: string;
  event_type?: string;
  issuer_id?: string;
  key_id?: string;
  algorithm?: string;
  payload_hash?: string;
  record_hash?: string;
  local_signature_valid?: boolean;
  payload_hash_prefix_match?: boolean;
  event_code_match?: boolean;
  correction_rotation_degrees?: number | null;
  corrected_codewords?: number | null;
  parity_bit_corrections?: number | null;
  token_length?: number | null;
  payload_length?: number | null;
  crc32?: string | null;
};

type Props = {
  expectedIdentifier?: string;
};

const MAX_IMAGE_BYTES = 12 * 1024 * 1024;

function normalizeExpectedIdentifier(value?: string) {
  return (value || "").trim().toUpperCase();
}

function shortHash(value?: string) {
  if (!value) return "—";
  if (value.length <= 18) return value;
  return `${value.slice(0, 10)}...${value.slice(-8)}`;
}

function getFailureReason(payload: OpticalApiPayload | null) {
  if (!payload) return "No hay resultado disponible.";

  if (typeof payload.reason === "string") {
    return payload.reason;
  }

  if (
    payload.detail &&
    typeof payload.detail === "object" &&
    "reason" in payload.detail
  ) {
    const reason = (payload.detail as { reason?: unknown }).reason;
    if (typeof reason === "string") return reason;
  }

  if (typeof payload.detail === "string") {
    return payload.detail;
  }

  return "No fue posible verificar la imagen óptica.";
}

export default function PinealOpticalUpload({ expectedIdentifier }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<OpticalApiPayload | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [localError, setLocalError] = useState("");

  const normalizedExpectedIdentifier = useMemo(
    () => normalizeExpectedIdentifier(expectedIdentifier),
    [expectedIdentifier],
  );

  const canSubmit = Boolean(file) && !isVerifying;

  const onVerify = async () => {
    if (!file) return;

    setResult(null);
    setStatusCode(null);
    setLocalError("");

    if (file.size <= 0) {
      setLocalError("El archivo está vacío.");
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setLocalError("El archivo excede el límite de 12 MB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    if (normalizedExpectedIdentifier) {
      formData.append("expected_identifier", normalizedExpectedIdentifier);
    }

    setIsVerifying(true);

    try {
      const response = await fetch("/api/pineal-optical/verify-image", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as OpticalApiPayload;

      setStatusCode(response.status);
      setResult(payload);
    } catch {
      setLocalError("No fue posible conectar con la capa de verificación óptica.");
    } finally {
      setIsVerifying(false);
    }
  };

  const isValid = result?.valid === true;

  return (
    <section className="mt-6 rounded-xl border border-cyan-950/70 bg-cyan-950/10 p-5">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-lg border border-cyan-900/70 bg-black/50 p-2">
          <Fingerprint className="h-4 w-4 text-cyan-300" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-400/80">
              Pineal Optical Beta
            </p>

            <span className="rounded-full border border-cyan-900/70 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-cyan-300">
              PVPC2
            </span>
          </div>

          <h2 className="mt-2 text-base font-semibold text-slate-100">
            Verificación óptica por imagen
          </h2>

          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            Sube una imagen PVPC2 para validar una referencia óptica contra
            evidencia PVP firmada. Esta función es beta y no sustituye la
            verificación estándar por identificador o QR.
          </p>

          {normalizedExpectedIdentifier && (
            <p className="mt-3 rounded-lg border border-slate-800 bg-black/30 px-3 py-2 font-mono text-[11px] text-slate-400">
              Identificador esperado:{" "}
              <span className="text-slate-200">
                {normalizedExpectedIdentifier}
              </span>
            </p>
          )}

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <label className="flex min-h-[44px] flex-1 cursor-pointer items-center gap-3 rounded-lg border border-slate-800 bg-black/30 px-3 py-2 text-sm text-slate-400 transition hover:border-cyan-900/70 hover:bg-cyan-950/10">
              <UploadCloud className="h-4 w-4 shrink-0 text-cyan-300" />
              <span className="truncate">
                {file ? file.name : "Seleccionar imagen PNG/JPG/WEBP"}
              </span>

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(event) => {
                  const selected = event.target.files?.[0] || null;
                  setFile(selected);
                  setResult(null);
                  setStatusCode(null);
                  setLocalError("");
                }}
              />
            </label>

            <button
              type="button"
              disabled={!canSubmit}
              onClick={onVerify}
              className="
                inline-flex
                min-h-[44px]
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                border-cyan-900/70
                bg-black
                px-4
                py-2
                text-sm
                font-medium
                text-cyan-100
                transition
                hover:bg-cyan-950/30
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {isVerifying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verificando
                </>
              ) : (
                "Verificar imagen"
              )}
            </button>
          </div>

          {localError && (
            <p className="mt-3 rounded-lg border border-red-900/50 bg-red-950/20 px-3 py-2 text-xs text-red-300">
              {localError}
            </p>
          )}

          {result && (
            <div
              className={`mt-4 rounded-xl border p-4 ${
                isValid
                  ? "border-emerald-900/60 bg-emerald-950/20"
                  : "border-red-900/50 bg-red-950/20"
              }`}
            >
              <div className="flex items-center gap-2">
                {isValid ? (
                  <ShieldCheck className="h-4 w-4 text-emerald-300" />
                ) : (
                  <ShieldX className="h-4 w-4 text-red-300" />
                )}

                <p
                  className={`text-sm font-semibold ${
                    isValid ? "text-emerald-300" : "text-red-300"
                  }`}
                >
                  {isValid
                    ? "Evidencia óptica verificada"
                    : "Imagen óptica no verificada"}
                </p>
              </div>

              {!isValid && (
                <p className="mt-2 text-xs text-slate-400">
                  Motivo: {getFailureReason(result)}
                </p>
              )}

              {isValid && (
                <>
                  <div className="mt-4 grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                    <div>
                      <p className="uppercase tracking-[0.18em] text-slate-600">
                        Identificador
                      </p>
                      <p className="mt-1 break-all font-mono text-slate-200">
                        {result.identifier || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="uppercase tracking-[0.18em] text-slate-600">
                        Evento
                      </p>
                      <p className="mt-1 text-slate-200">
                        {result.event_type || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="uppercase tracking-[0.18em] text-slate-600">
                        Formato
                      </p>
                      <p className="mt-1 text-slate-200">
                        {result.format || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="uppercase tracking-[0.18em] text-slate-600">
                        Firma local
                      </p>
                      <p className="mt-1 text-emerald-300">
                        {result.local_signature_valid ? "Válida" : "No válida"}
                      </p>
                    </div>

                    <div>
                      <p className="uppercase tracking-[0.18em] text-slate-600">
                        Issuer
                      </p>
                      <p className="mt-1 font-mono text-slate-200">
                        {result.issuer_id || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="uppercase tracking-[0.18em] text-slate-600">
                        Key ID
                      </p>
                      <p className="mt-1 break-all font-mono text-slate-200">
                        {result.key_id || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="uppercase tracking-[0.18em] text-slate-600">
                        Huella PVP
                      </p>
                      <p className="mt-1 font-mono text-slate-200">
                        {shortHash(result.payload_hash)}
                      </p>
                    </div>

                    <div>
                      <p className="uppercase tracking-[0.18em] text-slate-600">
                        Estado HTTP
                      </p>
                      <p className="mt-1 text-slate-200">
                        {statusCode || "—"}
                      </p>
                    </div>
                  </div>

                  {result.identifier && (
                    <a
                      href={`/verify/${encodeURIComponent(result.identifier)}`}
                      className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-800 px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-900/70 hover:bg-cyan-950/20"
                    >
                      Abrir registro público
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </>
              )}
            </div>
          )}

          <p className="mt-4 text-[11px] leading-relaxed text-slate-600">
            La imagen óptica funciona como carrier de referencia. La autoridad
            final sigue siendo el registro PVP firmado y validado por Pineal
            Shield.
          </p>
        </div>
      </div>
    </section>
  );
}