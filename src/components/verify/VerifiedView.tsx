import { CertificateSignature } from "@/components/verify/CertificateSignature";
import { DynamicQR } from "@/components/verify/DynamicQR";
import { ImagePlaceholder } from "@/components/verify/ImagePlaceholder";
import { VERIFICATION_LAYER_VERSION } from "@/lib/version";
import { ShieldCheck } from "lucide-react";

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

    verification_origin: string;

    // 🔥 NUEVO
    source_entity: string;
    source_entity_id: string;

    brand_name?: string | null;

    signature?: string;
    qr_exp: string;

    issuer_status?: string;
  };
}

export function VerifiedView({ identifier, result }: Props) {
  return (
    <main className="mx-auto max-w-2xl p-4 sm:p-6 text-slate-100">
      <div className="rounded-xl border border-slate-800 bg-black/40 p-5">

        {/* HEADER */}
        <div className="mb-4 border-b border-slate-800 pb-4">
          <p className="text-[10px] tracking-[0.25em] text-slate-500">
            PINEAL SHIELD REGISTRY
          </p>

          <h1 className="mt-1 text-lg font-semibold text-slate-100">
            Artifact Record
          </h1>

          {result.artifact_id && (
            <p className="mt-2 font-mono text-base sm:text-lg tracking-wide text-slate-300">
              {result.artifact_id}
            </p>
          )}

          <p className="mt-1 text-xs text-slate-400">
            Registro público de autenticidad
          </p>
        </div>

        {/* STATUS */}
        <div className="mb-5 rounded-lg border border-emerald-500/40 bg-emerald-500/15 p-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="h-5 w-5" />
            <span className="font-semibold">
              Registro verificado · Pineal Shield
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-300">
            Este identificador corresponde a un registro activo dentro de la infraestructura Pineal Shield,
            emitido por una entidad autorizada.
          </p>
          <p className="mt-1 text-sm text-slate-300">
           La verificación refleja el estado del registro dentro del sistema y su trazabilidad asociada.
          </p>
          
        </div>

        {/* IMAGE */}
        {result.image_url ? (
          <div className="mb-5 overflow-hidden rounded-xl border border-slate-800 bg-black aspect-[4/3]">
            <img
              src={result.image_url}
              alt={result.nombre ?? "Artifact"}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
        ) : (
          <ImagePlaceholder />
        )}

        {/* DETAILS */}
        <dl className="grid grid-cols-2 gap-4 text-sm mb-5">

          <div>
            <dt className="text-xs uppercase text-slate-400">
              Tipo
            </dt>
            <dd className="text-base">
              {result.kind === "producto" ? "Producto" : "Pieza"}
            </dd>
          </div>

          <div>
            <dt className="text-xs uppercase text-slate-400">
              Registrado
            </dt>
            <dd className="text-base">
              {new Date(result.issued_at).toLocaleString()}
            </dd>
          </div>

          {result.nombre && (
            <div className="col-span-2">
              <dt className="text-xs uppercase text-slate-400">
                Nombre
              </dt>
              <dd className="text-base">
                {result.nombre}
              </dd>
            </div>
          )}

        </dl>

        {/* SIGNATURE */}
        <CertificateSignature
          identifier={identifier}
          createdAt={result.issued_at}
          verificationOrigin={result.verification_origin}
        />

        {/* QR */}
        <div className="mt-6">
          <DynamicQR
            value={identifier}
            expiresAt={new Date(result.qr_exp)}
          />
        </div>

        {/* PROVENANCE */}
        <div className="mt-6 rounded-lg border border-slate-800 bg-black/30 p-4">

          <p className="mb-3 text-xs uppercase tracking-wide text-slate-500">
            Artifact Provenance
          </p>

          <dl className="grid grid-cols-2 gap-3 text-sm">

            {result.artifact_id && (
              <div>
                <dt className="text-xs text-slate-500 uppercase">
                  Artifact ID
                </dt>
                <dd className="font-mono text-slate-200">
                  {result.artifact_id}
                </dd>
              </div>
            )}

            {result.artifact_piece_id && (
              <div>
                <dt className="text-xs text-slate-500 uppercase">
                  Piece ID
                </dt>
                <dd className="font-mono text-slate-200">
                  {result.artifact_piece_id}
                </dd>
              </div>
            )}

            <div>
              <dt className="text-xs text-slate-500 uppercase">
                Registry Status
              </dt>
              <dd className="text-emerald-400">
                Verified
              </dd>
            </div>

            <div>
              <dt className="text-xs text-slate-500 uppercase">
                Issued
              </dt>
              <dd className="text-slate-200">
                {new Date(result.issued_at).toLocaleDateString()}
              </dd>
            </div>

            <div>
              <dt className="text-xs text-slate-500 uppercase">
                Source Entity
              </dt>
              <dd className="text-slate-200">
                {result.source_entity ?? result.brand_name}
              </dd>
            </div>


          </dl>
        </div>

        {/* FOOTER */}
        <div className="mt-6 text-center">

          <a
            href="/verify"
            className="rounded-lg border border-slate-800 px-4 py-2 text-sm text-slate-300 hover:bg-slate-900"
          >
            Intentar con otro código
          </a>

          <footer className="mt-6 text-[10px] text-slate-600 tracking-wide">
            Verification Layer · {VERIFICATION_LAYER_VERSION}
          </footer>

        </div>

      </div>
    </main>
  );
}