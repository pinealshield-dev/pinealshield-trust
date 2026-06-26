import VerifyLayout from "@/components/verify/VerifyLayout";
import { ImagePlaceholder } from "@/components/verify/ImagePlaceholder";
import PinealProtocolCard from "@/components/verify/PinealProtocolCard";
import type { VerifyPvpSnapshot } from "@/lib/verify/types";

interface Props {
  identifier: string;
  result: {
    kind: "producto" | "pieza";
    nombre: string;
    artifact_id?: string;
    artifact_piece_id?: string;
    issued_at: string;
    image_url: string | null;
    pvp?: VerifyPvpSnapshot;
  };
}

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

export default function RevokedView({ result,
  identifier, }: Props) {
  return (
    <VerifyLayout
      status="revoked"
      title="Registro institucional revocado"
      subtitle={
        result.kind === "pieza"
          ? result.artifact_piece_id ?? identifier
          : result.artifact_id ?? identifier
      }
    >
      {/* IMAGEN (SIN DRAMA) */}
      {result.image_url ? (
        <div className="mb-5 rounded-xl border border-slate-800 bg-black p-4">
          <img
            src={result.image_url}
            alt={result.nombre}
            className="w-full max-h-[320px] object-contain mx-auto opacity-30 grayscale"
          />
        </div>
      ) : (
        <ImagePlaceholder />
      )}

      {/* INFO BÁSICA */}
      <dl className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-500">
            Tipo de registro
          </dt>

          <dd className="mt-1 text-slate-200">
            {result.kind === "producto"
              ? "Registro verificable"
              : "Pieza verificable"}
          </dd>
        </div>

        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-500">
            Registro temporal
          </dt>
          <dd className="mt-1 text-slate-200">
            {formatInstitutionalDate(result.issued_at)}
          </dd>
        </div>
      </dl>
      

            <div className="mt-6 rounded-xl border border-slate-800 bg-black/20 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Estado operacional
            </p>

            <p className="mt-1 text-sm text-slate-300">
              Referencia descontinuada
            </p>
          </div>

          <span className="shrink-0 text-xs font-medium tracking-wide text-red-300">
            REVOKED
          </span>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          Este identificador permanece registrado únicamente como referencia histórica verificable.
        </p>
      </div>

      <PinealProtocolCard
        pvp={result.pvp}
        mode="revoked"
      />

    </VerifyLayout>
  );
}