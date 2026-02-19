import { ImagePlaceholder } from "@/components/verify/ImagePlaceholder";
import { VERIFICATION_LAYER_VERSION } from "@/lib/version";

interface Props {
  result: {
    kind: "producto" | "pieza";
    nombre: string;
    issued_at: string;
    image_url: string | null;
  };
}

export function RevokedView({ result }: Props) {
  return (
    <main className="mx-auto max-w-3xl p-6 text-slate-100">
      <div className="relative rounded-xl border border-red-500/40 bg-red-900/10 p-6">

        {/* BADGE TÉCNICO SUPERIOR */}
        <div className="absolute top-4 right-4">
          <span className="rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-[11px] uppercase tracking-wider text-red-400">
            Certificate Status · Revoked
          </span>
        </div>

        {/* HEADER */}
        <div className="mb-4">
          <p className="text-lg font-semibold text-red-400">
            Certificado revocado
          </p>

          <p className="mt-2 text-sm text-slate-300">
            Este certificado fue emitido previamente pero ha sido revocado
            oficialmente por la entidad emisora.
          </p>
        </div>

        {/* IMAGEN */}
        {result.image_url ? (
          <div className="relative mb-6 overflow-hidden rounded-xl border border-red-500/30 bg-black">

            {/* IMAGEN BASE */}
            <img
              src={result.image_url}
              alt={result.nombre}
              className="w-full max-h-[420px] object-contain bg-black opacity-50"
              loading="lazy"
            />

            {/* OVERLAY ROJO SUAVE */}
            <div className="absolute inset-0 bg-red-900/40 backdrop-blur-[1px]" />

            {/* WATERMARK DIAGONAL INSTITUCIONAL */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="rotate-[-25deg] text-4xl md:text-5xl font-semibold tracking-[0.35em] text-red-400/10 select-none">
                REVOKED
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <ImagePlaceholder />
          </div>
        )}

        {/* ACCIÓN */}
        <div className="mt-6">
          <a
            href="/verify"
            className="rounded-lg border border-slate-800 px-4 py-2 text-sm text-slate-300 hover:bg-slate-900"
          >
            Verificar otro código
          </a>

          <p className="mt-4 text-xs text-red-300/70">
            Estado oficial actualizado en tiempo real.
          </p>

          {/* FOOTER TÉCNICO */}
          <footer className="pb-6 text-center text-[10px] text-slate-600 tracking-wide">
  Verification Layer · {VERIFICATION_LAYER_VERSION}
</footer>
        </div>
      </div>
    </main>
  );
}
