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
      title="Registro certificado"
      subtitle={result.document_id ?? identifier}
    >
      {/* TITLE */}
      <div className="mb-5 text-center">
        <h2 className="text-xl font-semibold text-slate-100">
          {result.nombre}
        </h2>
      </div>

      {/* METADATA BÁSICA */}
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

      {/* 🔒 EVIDENCIA (MISMO NIVEL QUE ARTIFACT) */}
      <CertificateSignature
        identifier={result.document_id ?? identifier}
        createdAt={result.issued_at}
        verificationOrigin={result.verification_origin}
      />

      {/* 🔽 QR (SECUNDARIO) */}
      {result.qr_exp && (
        <div className="mt-6">
          <DynamicQR
            value={identifier}
            expiresAt={new Date(result.qr_exp)}
          />
        </div>
      )}
    </VerifyLayout>
  );
}