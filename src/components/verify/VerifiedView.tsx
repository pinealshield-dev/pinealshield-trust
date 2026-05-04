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

  return (
    <VerifyLayout
      status="verified"
      title="Producto autenticado"
      subtitle={result.artifact_id ?? result.artifact_piece_id ?? identifier}
      chainValid={chainValid}
    >

      {/* 🔴 BRAND BLOCK */}
      <div className="mb-6 text-center border-b border-slate-800 pb-4">
        <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
          CERTIFICADO POR
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
            alt={result.nombre ?? "Producto certificado"}
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
              Tipo
            </dt>
            <dd className="mt-1 text-slate-200">
              {result.kind === "producto" ? "Producto" : "Pieza"}
            </dd>
          </div>

          <div>
            <dt className="text-xs uppercase text-slate-500">
              Registrado
            </dt>
            <dd className="mt-1 text-slate-200">
              {new Date(result.issued_at).toLocaleString()}
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
                Verificación criptográfica
              </p>
            </div>

            <span
              className={`text-xs font-semibold ${
                chainValid ? "text-emerald-400" : "text-yellow-400"
              }`}
            >
              {chainValid ? "VALID" : "COMPROMISED"}
            </span>
          </div>

          <p className="mt-2 text-xs text-slate-400">
            {chainValid
              ? "Este registro está protegido contra alteraciones y puede ser auditado en cualquier momento."
              : "Se detectó una inconsistencia en la cadena de eventos. Se recomienda validación adicional."}
          </p>

          <div className="mt-3 text-[11px] text-slate-500 border-t border-slate-800 pt-2">
            Verification model: event-based cryptographic chain
          </div>
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