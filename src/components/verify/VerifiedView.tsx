import { CertificateSignature } from "@/components/verify/CertificateSignature";
import { DynamicQR } from "@/components/verify/DynamicQR";
import { ImagePlaceholder } from "@/components/verify/ImagePlaceholder";
import { VERIFICATION_LAYER_VERSION } from "@/lib/version";

interface Props {
  identifier: string;
  result: {
    status: "verified";
    kind: "producto" | "pieza";

    nombre?: string;

    artifact_id?: string;
    artifact_piece_id?: string;

    hash?: string;

    issued_at: string;
    image_url: string | null;

    brand_name?: string | null;

    signature?: string;
    qr_exp: string;

    issuer_status?: string;
  };
}

export function VerifiedView({ identifier, result }: Props) {
  return (
    <main className="mx-auto max-w-3xl p-6 text-slate-100">
      <div className="rounded-xl border border-slate-800 bg-black/40 p-6">

        {/* REGISTRY HEADER */}
        <div className="mb-6 border-b border-slate-800 pb-4">
          <p className="text-[11px] tracking-[0.2em] text-slate-500">
            PINEAL SHIELD REGISTRY
          </p>

          <h1 className="mt-1 text-lg font-semibold text-slate-100">
            Artifact Record
          </h1>

          {result.artifact_id && (
            <p className="mt-2 font-mono text-sm text-slate-300">
              Record ID · {result.artifact_id}
            </p>
          )}

          <p className="mt-1 text-xs text-slate-400">
            Registro público de autenticidad
          </p>
        </div>

        {/* ARTIFACT PROVENANCE */}
        <div className="mb-6 rounded-lg border border-slate-800 bg-black/30 p-4">

          <p className="mb-3 text-xs uppercase tracking-wide text-slate-500">
            Artifact Provenance
          </p>

          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm">

            {result.artifact_id && (
              <div>
                <dt className="text-slate-500 text-xs uppercase">Artifact</dt>
                <dd className="font-mono text-slate-200">
                  {result.artifact_id}
                </dd>
              </div>
            )}

            {result.artifact_piece_id && (
              <div>
                <dt className="text-slate-500 text-xs uppercase">Piece</dt>
                <dd className="font-mono text-slate-200">
                  {result.artifact_piece_id}
                </dd>
              </div>
            )}

            <div>
              <dt className="text-slate-500 text-xs uppercase">
                Registry Status
              </dt>
              <dd className="text-emerald-400 font-medium">
                Verified
              </dd>
            </div>

            <div>
              <dt className="text-slate-500 text-xs uppercase">
                Issued
              </dt>
              <dd className="text-slate-200">
                {new Date(result.issued_at).toLocaleDateString()}
              </dd>
            </div>

          </dl>
        </div>

        {/* STATUS BANNER */}
        <div className="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-500/15 p-4">
          <p className="font-semibold text-emerald-400">
            Certificación válida · Pineal Shield®
          </p>

          <p className="mt-1 text-sm text-slate-300">
            Este artefacto cuenta con un registro digital de autenticidad
            verificado criptográficamente.
          </p>
        </div>

        {/* ISSUER STATUS */}
        {result.issuer_status && result.issuer_status !== "active" && (
          <div className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4">
            <p className="text-sm text-amber-300">
              Este artefacto fue certificado previamente por Pineal Shield.
              La organización emisora ya no mantiene una infraestructura activa
              dentro del sistema.
            </p>
          </div>
        )}

        {/* IMAGE */}
        {result.image_url ? (
          <div className="mb-4 overflow-hidden rounded-xl border border-slate-800 bg-black">
            <img
              src={result.image_url}
              alt={result.nombre ?? "Artifact"}
              className="w-full max-h-[420px] object-contain bg-black"
              loading="lazy"
            />
          </div>
        ) : (
          <ImagePlaceholder />
        )}

        {/* ARTIFACT DETAILS */}
        <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

          <div>
            <dt className="text-xs uppercase text-slate-400">
              Tipo
            </dt>
            <dd className="text-lg">
              {result.kind === "producto" ? "Producto" : "Pieza"}
            </dd>
          </div>

          {result.nombre && (
            <div>
              <dt className="text-xs uppercase text-slate-400">
                Nombre
              </dt>
              <dd className="text-lg">{result.nombre}</dd>
            </div>
          )}

          <div>
            <dt className="text-xs uppercase text-slate-400">
              Registrado
            </dt>
            <dd className="text-lg">
              {new Date(result.issued_at).toLocaleString()}
            </dd>
          </div>

        </dl>

        <p className="mt-4 text-xs text-slate-400">
          Verificación realizada en tiempo real mediante la infraestructura de
          confianza de Pineal Shield.
        </p>

        {/* CRYPTOGRAPHIC SIGNATURE */}
        <CertificateSignature
          identifier={identifier}
          createdAt={result.issued_at}
        />

        {/* QR */}
        <DynamicQR
          value={identifier}
          expiresAt={new Date(result.qr_exp)}
        />

        <div className="mt-6">
          <a
            href="/verify"
            className="rounded-lg border border-slate-800 px-4 py-2 text-sm text-slate-300 hover:bg-slate-900"
          >
            Intentar con otro código
          </a>

          <footer className="pb-6 text-center text-[10px] text-slate-600 tracking-wide">
            Verification Layer · {VERIFICATION_LAYER_VERSION}
          </footer>
        </div>

      </div>
    </main>
  );
}