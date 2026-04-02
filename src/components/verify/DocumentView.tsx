import { VerifyDocumentResult } from "@/lib/verify/types";

type Props = {
  result: VerifyDocumentResult;
};

export default function DocumentView({ result }: Props) {
  const isRevoked =
    result.status === "revoked" || result.status === "replaced";

  return (
    <div className="space-y-6">

      {/* STATUS */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold">
          {isRevoked ? "Document Revoked" : "Document Verified"}
        </h1>

        <p className="text-sm text-neutral-500">
          {result.verification_origin}
        </p>
      </div>

      {/* NAME */}
      <div className="text-center">
        <h2 className="text-xl">{result.nombre}</h2>
      </div>

      {/* DOCUMENT ID */}
      {result.document_id && (
        <div className="text-center text-xs text-neutral-400">
          ID: {result.document_id}
        </div>
      )}

      {/* HOLDER */}
      {(result.holder_name || result.holder_identifier) && (
        <div className="text-center text-sm text-neutral-600">
          {result.holder_name && <div>{result.holder_name}</div>}
          {result.holder_identifier && (
            <div className="text-xs">{result.holder_identifier}</div>
          )}
        </div>
      )}

      {/* ISSUER */}
      <div className="text-center text-sm">
        Issued by: {result.source_entity}
      </div>

      {/* TIMESTAMP */}
      <div className="text-center text-xs text-neutral-500">
        Issued at: {new Date(result.issued_at).toLocaleString()}
      </div>

      {/* FILE */}
      {result.file_url && !isRevoked && (
        <div className="text-center">
          <a
            href={result.file_url}
            target="_blank"
            className="text-sm underline"
          >
            View Document
          </a>
        </div>
      )}

      {/* STATUS */}
      {isRevoked && (
        <div className="text-center text-red-500 text-sm">
          This document is no longer valid
        </div>
      )}

      {/* SIGNATURE (opcional si decides incluirla en tipo) */}
      {"signature" in result && !isRevoked && (
        <div className="text-center text-xs text-neutral-400">
          {result.signature}
        </div>
      )}
    </div>
  );
}