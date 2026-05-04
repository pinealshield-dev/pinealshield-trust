import VerifyLayout from "@/components/verify/VerifyLayout";
import { ImagePlaceholder } from "@/components/verify/ImagePlaceholder";

interface Props {
  identifier: string;
  result: {
    kind: "producto" | "pieza";
    nombre: string;
    issued_at: string;
    image_url: string | null;
  };
}

export default function ReplacedView({ result }: Props) {
  return (
    <VerifyLayout
      status="replaced"
      title="Registro de producto"
      subtitle={result.nombre}
    >
      {/* IMAGEN */}
      {result.image_url ? (
        <div className="mb-5 rounded-xl border border-slate-800 bg-black p-4">
          <img
            src={result.image_url}
            alt={result.nombre}
            className="w-full max-h-[320px] object-contain mx-auto opacity-40"
          />
        </div>
      ) : (
        <ImagePlaceholder />
      )}

      {/* INFO BÁSICA */}
      <dl className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-xs uppercase text-slate-400">Tipo</dt>
          <dd>{result.kind === "producto" ? "Producto" : "Pieza"}</dd>
        </div>

        <div>
          <dt className="text-xs uppercase text-slate-400">Emitido</dt>
          <dd>{new Date(result.issued_at).toLocaleString()}</dd>
        </div>
      </dl>
    </VerifyLayout>
  );
}