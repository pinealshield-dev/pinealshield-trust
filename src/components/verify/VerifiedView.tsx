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
  };
}

export default function VerifiedView({ identifier, result }: Props) {
  return (
    <VerifyLayout
      status="verified"
      title="Artifact Record"
      subtitle={result.artifact_id}
    >
      {/* IMAGE */}
      {result.image_url ? (
        <div className="mb-5 overflow-hidden rounded-xl border border-slate-800 bg-black aspect-[4/3]">
          <img
            src={result.image_url}
            alt={result.nombre ?? "Artifact"}
            className="w-full h-full object-contain"
          />
        </div>
      ) : (
        <ImagePlaceholder />
      )}

      {/* DETAILS */}
      <dl className="grid grid-cols-2 gap-4 text-sm mb-5">
        <div>
          <dt className="text-xs uppercase text-slate-400">Tipo</dt>
          <dd>{result.kind === "producto" ? "Producto" : "Pieza"}</dd>
        </div>

        <div>
          <dt className="text-xs uppercase text-slate-400">Registrado</dt>
          <dd>{new Date(result.issued_at).toLocaleString()}</dd>
        </div>
      </dl>

      <CertificateSignature
        identifier={identifier}
        createdAt={result.issued_at}
        verificationOrigin={result.verification_origin}
      />

      <div className="mt-6">
        <DynamicQR
          value={identifier}
          expiresAt={new Date(result.qr_exp)}
        />
      </div>
    </VerifyLayout>
  );
}