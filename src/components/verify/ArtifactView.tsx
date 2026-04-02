import { VerifyArtifactResult } from "@/lib/verify/types";

type Props = {
  result: VerifyArtifactResult;
};

export default function ArtifactView({ result }: Props) {
  const isRevoked =
    result.status === "revoked" || result.status === "replaced";

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">
          {isRevoked ? "Artifact Revoked" : "Artifact Verified"}
        </h1>

        <p className="text-sm text-neutral-500">
          {result.verification_origin}
        </p>
      </div>

      {result.image_url && (
        <div className="flex justify-center">
          <img
            src={result.image_url}
            alt={result.nombre}
            className="max-w-xs rounded"
          />
        </div>
      )}

      <div className="text-center">
        <h2 className="text-xl">{result.nombre}</h2>
      </div>

      <div className="text-center text-xs text-neutral-400">
        {result.artifact_id && <div>ID: {result.artifact_id}</div>}
        {result.artifact_piece_id && (
          <div>Piece: {result.artifact_piece_id}</div>
        )}
      </div>

      <div className="text-center text-sm">
        Issued by: {result.source_entity}
      </div>

      <div className="text-center text-xs text-neutral-500">
        Issued at: {new Date(result.issued_at).toLocaleString()}
      </div>

      {isRevoked && (
        <div className="text-center text-red-500 text-sm">
          This artifact is no longer valid
        </div>
      )}

      {!isRevoked && "signature" in result && (
        <div className="text-center text-xs text-neutral-400">
          {result.signature}
        </div>
      )}
    </div>
  );
}