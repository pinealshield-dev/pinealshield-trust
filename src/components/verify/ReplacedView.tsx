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

export function ReplacedView({ result }: Props) {
  return (
    <main className="mx-auto max-w-3xl p-6 text-slate-100">
      <div className="relative rounded-xl border border-amber-500/40 bg-amber-900/10 p-6">

        {/* BADGE SUPERIOR */}
        <div className="absolute top-4 right-4">
          <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-[11px] uppercase tracking-wider text-amber-400">
            Certificate Status · Replaced
          </span>
        </div>

        {/* HEADER */}
        <div className="mb-4">
          <p className="text-lg font-semibold text-amber-400">
            Certificado reemplazado
          </p>

          <p className="mt-2 text-sm text-slate-300">
            Este certificado ha sido reemplazado por una nueva versión oficial.
            Utilice el certificado actualizado para verificación vigente.
          </p>
        </div>

        {/* IMAGEN */}
        {result.image_url ? (
          <div className="relative mb-6 overflow-hidden rounded-xl border border-amber-500/30 bg-black">

            <img
              src={result.image_url}
              alt={result.nombre}
              className="w-full max-h-[420px] object-contain bg-black opacity-60"
              loading="lazy"
            />

            <div className="absolute inset-0 bg-amber-900/30 backdrop-blur-[1px]" />

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="rotate-[-25deg] text-4xl md:text-5xl font-semibold tracking-[0.35em] text-amber-400/10 select-none">
                REPLACED
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <ImagePlaceholder />
          </div>
        )}

        <div className="mt-6">
          <a
            href="/verify"
            className="rounded-lg border border-slate-800 px-4 py-2 text-sm text-slate-300 hover:bg-slate-900"
          >
            Verificar otro código
          </a>

          <p className="mt-4 text-xs text-amber-300/70">
            El estado del certificado fue actualizado institucionalmente.
          </p>

          <footer className="pb-6 text-center text-[10px] text-slate-600 tracking-wide">
            Verification Layer · {VERIFICATION_LAYER_VERSION}
          </footer>
        </div>
      </div>
    </main>
  );
}
