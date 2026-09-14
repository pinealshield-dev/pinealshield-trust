// 🔒 Capa transversal de integridad (infraestructura)
export type VerifyPvpSnapshot =
  | {
      signed: false;
      event_type?: "issued" | "revoked" | "replaced" | string;
      record_hash?: string;
      chain_created_at?: string;
    }
  | {
      signed: true;
      version: string;
      issuer_id: string;
      key_id: string;
      algorithm: string;
      payload_hash: string;
      status: "active" | "revoked" | "expired" | "superseded" | string;
      event_type: "issued" | "revoked" | "replaced" | string;
      record_hash: string;
      chain_created_at: string;
      signed_at: string;
      local_verification?: {
        checked: boolean;
        valid: boolean;
        reason?: string;
        payload_hash?: string;
      };
    };

export type VerifyIntegrity = {
  chain_valid?: boolean;
  pvp?: VerifyPvpSnapshot;
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
// 🌐 V2 UNIVERSAL VERIFIABLE RECORD
// =====================================================

export type VerifyV2RecordResult = {
  status: "verified" | "revoked" | "replaced" | "expired" | "suspended";
  entity: "record";
  kind: "verifiable_record";

  public_id: string;
  public_token: string;
  record_type: string;
  entity_type: string;

  template_code: string | null;
  template_name: string | null;
  template_labels: Record<string, string>;

  issuer_name: string;
  issuer_slug: string | null;
  issuer_status: "unverified" | "verified" | "trusted" | "enterprise" | string;

  public_data: Record<string, unknown>;

  integrity_hash: string;
  hash_algorithm: string;
  hash_version: string;

  issued_at: string;
  effective_from: string | null;
  expires_at: string | null;
  revoked_at: string | null;

  replaces_public_id: string | null;
  replaced_by_public_id: string | null;

  verification_origin: "pineal_record_v2";
};

// =====================================================
// ❌ UNVERIFIED (NO INTEGRITY)
// =====================================================

export type VerifyUnverifiedResult = {
  status: "unverified";
  pvp?: VerifyPvpSnapshot;
};

// =====================================================
// 🌐 PUBLIC RESULT (UNION)
// =====================================================

export type VerifyPublicResult =
  | VerifyArtifactVerifiedResult
  | VerifyArtifactRevokedResult
  | VerifyDocumentVerifiedResult
  | VerifyDocumentRevokedResult
  | VerifyV2RecordResult
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
