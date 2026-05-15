import VerifyLayout from "@/components/verify/VerifyLayout";
import { CertificateSignature } from "@/components/verify/CertificateSignature";
import { DynamicQR } from "@/components/verify/DynamicQR";
import { ImagePlaceholder } from "@/components/verify/ImagePlaceholder";

interface Props {
  identifier: string;
  result: {
    status: "verified";
    kind: "producto" | "pieza";
    nombre?: string;
    artifact_id?: string;
    artifact_piece_id?: string;
    issued_at: string;
    image_url: string | null;
    verification_origin: string;
    source_entity: string;
    brand_name?: string | null;
    qr_exp: string;
    chain_valid?: boolean;
  };
}

export default function VerifiedView({ identifier, result }: Props) {

  const chainValid = result.chain_valid ?? true;

  function formatInstitutionalDate(date: string) {
    return new Intl.DateTimeFormat("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZoneName: "short",
    }).format(new Date(date));
  }

  return (
    <VerifyLayout
      status="verified"
      title="Registro institucional verificado"
      subtitle={
        result.kind === "pieza"
          ? result.artifact_piece_id ?? identifier
          : result.artifact_id ?? identifier
      }
      chainValid={chainValid}
    >

      {/* 🔴 BRAND BLOCK */}
      <div className="mb-5 border-b border-slate-800 pb-5 text-center">
        <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
          EMITIDO POR
        </p>

        <p className="text-xl font-semibold text-slate-100 mt-2">
          {result.brand_name ?? result.source_entity}
        </p>
      </div>

      {/* IMAGE */}
      {result.image_url ? (
        <div className="mb-5 overflow-hidden rounded-xl border border-slate-800 bg-black min-h-[280px] flex items-center justify-center">
          <img
            src={result.image_url}
            alt={result.nombre ?? "Registro Verificado"}
            className="max-h-[320px] w-auto object-contain"
          />
        </div>
      ) : (
        <ImagePlaceholder />
      )}

      {/* DETAILS */}
      <div className="mb-5 rounded-lg border border-slate-800 bg-black/20 p-4">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
          
          <div>
            <dt className="text-xs uppercase text-slate-500">
              Tipo de registro
            </dt>

            <dd className="mt-1 text-slate-200">
              {result.kind === "producto"
                ? "Registro verificable"
                : "Pieza verificable"}
            </dd>
          </div>

          <div>
            <dt className="text-xs uppercase text-slate-500">
              Registrado
            </dt>
            <dd className="mt-1 text-slate-200">
              {formatInstitutionalDate(result.issued_at)}
            </dd>
          </div>

        </dl>
      </div>

      {/* 🔴 INTEGRITY (AHORA BIEN CONTROLADO) */}
      <div className="mt-6 opacity-80">
        <div
          className={`rounded-lg border p-4 ${
            chainValid
              ? "border-slate-800 bg-black/20"
              : "border-yellow-500/40 bg-yellow-500/10"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase text-slate-500">
                Integridad del registro
              </p>
              <p className="text-[11px] text-slate-500">
                Verificación de integridad
              </p>
            </div>

            <span
              className={`text-xs font-medium tracking-wide ${
                chainValid ? "text-emerald-300" : "text-yellow-300"
              }`}
            >
              {chainValid ? "VALIDADO" : "REQUIERE VALIDACIÓN"}
            </span>
          </div>

          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            {chainValid
              ? "Este registro mantiene consistencia documental e integridad verificable dentro de Pineal Shield."
              : "Se detectó una inconsistencia operativa en el historial verificable del registro."}
          </p>
        </div>
      </div>

      {/* 🔴 FIRMA (YA NO PROTAGONISTA) */}
      <div className="opacity-80">
        <CertificateSignature
          identifier={identifier}
          createdAt={result.issued_at}
          verificationOrigin={result.verification_origin}
        />
      </div>

      {/* QR */}
      <div className="mt-6">
        <DynamicQR
          value={identifier}
          expiresAt={new Date(result.qr_exp)}
        />
      </div>

    </VerifyLayout>
  );
}