// 🔒 Capa transversal de integridad (infraestructura)
export type VerifyIntegrity = {
  chain_valid?: boolean;
};

// =====================================================
// 🧩 ARTIFACTS — VERIFIED
// =====================================================

export type VerifyArtifactVerifiedResult =
  VerifyIntegrity & {
    status: "verified";
    lifecycle_status?: "issued" | "revoked" | "replaced";
    entity: "artifact" | "artifact_piece" | "hash";
    kind: "producto" | "pieza";

    nombre: string;

    artifact_id?: string;
    artifact_piece_id?: string;

    hash?: string;

    issued_at: string;

    image_url: string | null;
    verification_origin: string;

    source_entity: string;
    source_entity_id: string;

    brand_name: string | null;

    signature: string;
    qr_exp: string;

    issuer_status: string;
  };

// =====================================================
// 🧩 ARTIFACTS — REVOKED / REPLACED
// =====================================================

export type VerifyArtifactRevokedResult =
  VerifyIntegrity & {
    status: "revoked" | "replaced";
    entity: "artifact" | "artifact_piece" | "hash";
    kind: "producto" | "pieza";

    nombre: string;

    artifact_id?: string;
    artifact_piece_id?: string;

    hash?: string;

    issued_at: string;

    image_url: string | null;
    verification_origin: string;

    source_entity: string;
    source_entity_id: string;

    brand_name: string | null;

    issuer_status: string;
  };

// =====================================================
// 🧩 ARTIFACT LIFECYCLE (SIN CAMBIO)
// =====================================================

export type VerifyArtifactLifecycle = {
  lifecycle_status?: "issued" | "revoked" | "replaced";
};

// =====================================================
// 📄 DOCUMENTS — VERIFIED
// =====================================================

export type VerifyDocumentVerifiedResult =
  VerifyIntegrity & {
    status: "verified";
    entity: "document";
    kind: "document";

    document_id?: string;
    file_url?: string | null;
    holder_name?: string | null;
    holder_identifier?: string | null;

    nombre: string;

    hash?: string;

    issued_at: string;

    image_url: string | null;
    verification_origin: string;

    source_entity: string;
    source_entity_id: string;

    brand_name: string | null;

    signature: string;
    qr_exp: string;

    issuer_status: string;
  };

// =====================================================
// 📄 DOCUMENTS — REVOKED / REPLACED
// =====================================================

export type VerifyDocumentRevokedResult =
  VerifyIntegrity & {
    status: "revoked" | "replaced";
    entity: "document";
    kind: "document";

    document_id?: string;
    file_url?: string | null;
    holder_name?: string | null;
    holder_identifier?: string | null;

    nombre: string;

    hash?: string;

    issued_at: string;

    image_url: string | null;
    verification_origin: string;

    source_entity: string;
    source_entity_id: string;

    brand_name: string | null;

    issuer_status: string;
  };

// =====================================================
// ❌ UNVERIFIED (NO INTEGRITY)
// =====================================================

export type VerifyUnverifiedResult = {
  status: "unverified";
};

// =====================================================
// 🌐 PUBLIC RESULT (UNION)
// =====================================================

export type VerifyPublicResult =
  | VerifyArtifactVerifiedResult
  | VerifyArtifactRevokedResult
  | VerifyDocumentVerifiedResult
  | VerifyDocumentRevokedResult
  | VerifyUnverifiedResult;

// =====================================================
// 🔧 HELPERS
// =====================================================

export type VerifyArtifactResult =
  | VerifyArtifactVerifiedResult
  | VerifyArtifactRevokedResult;

export type VerifyDocumentResult =
  | VerifyDocumentVerifiedResult
  | VerifyDocumentRevokedResult;