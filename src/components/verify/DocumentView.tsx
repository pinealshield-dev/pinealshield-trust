import VerifyLayout from "@/components/verify/VerifyLayout";
import { CertificateSignature } from "@/components/verify/CertificateSignature";
import { DynamicQR } from "@/components/verify/DynamicQR";

interface Props {
  identifier: string;
  result: {
    status: "verified" | "revoked" | "replaced";
    kind: "document";
    nombre: string;

    document_id?: string;
    file_url?: string | null;

    issued_at: string;

    verification_origin: string;
    source_entity: string;
    brand_name?: string | null;

    qr_exp?: string;
  };
}

export default function DocumentView({ identifier, result }: Props) {
  const status = result.status;

  return (
    <VerifyLayout
      status={status}
      title="Document Record"
      subtitle={result.document_id}
    >
      {/* TITLE */}
      <div className="mb-5 text-center">
        <h2 className="text-xl font-semibold text-slate-100">
          {result.nombre}
        </h2>
      </div>

      {/* METADATA */}
      <dl className="grid grid-cols-2 gap-4 text-sm mb-5">
        <div>
          <dt className="text-xs uppercase text-slate-400">
            Tipo
          </dt>
          <dd>Documento</dd>
        </div>

        <div>
          <dt className="text-xs uppercase text-slate-400">
            Emitido
          </dt>
          <dd>
            {new Date(result.issued_at).toLocaleString()}
          </dd>
        </div>

        <div className="col-span-2">
          <dt className="text-xs uppercase text-slate-400">
            Emisor
          </dt>
          <dd>
            {result.source_entity ?? result.brand_name}
          </dd>
        </div>
      </dl>

      {/* DOCUMENT ACCESS */}
      <div className="mt-6 rounded-lg border border-slate-800 bg-black/30 p-4">
        <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">
          Documento certificado
        </p>

        {result.file_url ? (
          <button
            disabled
            className="w-full rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-500 cursor-not-allowed"
          >
            Documento disponible próximamente
          </button>
        ) : (
          <div className="text-sm text-slate-500">
            No hay documento asociado a este registro
          </div>
        )}
      </div>

      {/* SIGNATURE */}
      <CertificateSignature
        identifier={identifier}
        createdAt={result.issued_at}
        verificationOrigin={result.verification_origin}
      />

      {/* QR (solo si existe) */}
      {result.qr_exp && (
        <div className="mt-6">
          <DynamicQR
            value={identifier}
            expiresAt={new Date(result.qr_exp)}
          />
        </div>
      )}

      {/* PROVENANCE */}
      <div className="mt-6 rounded-lg border border-slate-800 bg-black/30 p-4">
        <p className="mb-3 text-xs uppercase tracking-wide text-slate-500">
          Document Provenance
        </p>

        <dl className="grid grid-cols-2 gap-3 text-sm">
          {result.document_id && (
            <div>
              <dt className="text-xs text-slate-500 uppercase">
                Document ID
              </dt>
              <dd className="font-mono text-slate-200">
                {result.document_id}
              </dd>
            </div>
          )}

          <div>
            <dt className="text-xs text-slate-500 uppercase">
              Status
            </dt>
            <dd className="text-slate-200 capitalize">
              {status}
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
              {result.source_entity}
            </dd>
          </div>
        </dl>
      </div>
    </VerifyLayout>
  );
}