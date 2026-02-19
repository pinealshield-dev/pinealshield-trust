import { CertificateSignature } from "@/components/verify/CertificateSignature";
import { DynamicQR } from "@/components/verify/DynamicQR";
import { ImagePlaceholder } from "@/components/verify/ImagePlaceholder";
import { VERIFICATION_LAYER_VERSION } from "@/lib/version";


interface Props {
  hash: string;
  result: {
    kind: "producto" | "pieza";
    nombre: string;
    issued_at: string;
    image_url: string | null;
    qr_exp: string;
  };
}

export function VerifiedView({ hash, result }: Props) {
  return (
    <main className="mx-auto max-w-3xl p-6 text-slate-100">
      <div className="rounded-xl border border-slate-800 bg-black/40 p-6">
        {/* HEADER */}
        <div className="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-500/15 p-4">
          <p className="font-semibold text-emerald-400">
            Certificación válida · Pineal Shield®
          </p>
          <p className="mt-1 text-sm text-slate-300">
            Este producto cuenta con un registro digital de autenticidad
            verificado criptográficamente.
          </p>
        </div>

        {/* IMAGEN */}
        {result.image_url ? (
          <div className="mb-4 overflow-hidden rounded-xl border border-slate-800 bg-black">
            <img
              src={result.image_url}
              alt={result.nombre}
              className="w-full max-h-[420px] object-contain bg-black"
              loading="lazy"
            />
          </div>
        ) : (
          <ImagePlaceholder />
        )}

        <h2 className="text-xl font-semibold">Certificación válida</h2>

        <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase text-slate-400">Tipo</dt>
            <dd className="text-lg">
              {result.kind === "producto" ? "Producto" : "Pieza"}
            </dd>
          </div>

          <div>
            <dt className="text-xs uppercase text-slate-400">Nombre</dt>
            <dd className="text-lg">{result.nombre}</dd>
          </div>

          <div>
            <dt className="text-xs uppercase text-slate-400">Registrado</dt>
            <dd className="text-lg">
              {new Date(result.issued_at).toLocaleString()}
            </dd>
          </div>
        </dl>

        <p className="mt-4 text-xs text-slate-400">
          Verificación realizada en tiempo real mediante la infraestructura de
          confianza de Pineal Shield.
        </p>

        <CertificateSignature
          hash={hash}
          createdAt={result.issued_at}
        />

        <DynamicQR
          value={hash}
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
