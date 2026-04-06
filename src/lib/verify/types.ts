export type VerifyArtifactVerifiedResult = {
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

export type VerifyArtifactRevokedResult = {
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

export type VerifyArtifactLifecycle = {
  lifecycle_status?: "issued" | "revoked" | "replaced";
};



export type VerifyDocumentVerifiedResult = {
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

export type VerifyDocumentRevokedResult = {
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

export type VerifyUnverifiedResult = {
  status: "unverified";
};

export type VerifyPublicResult =
  | VerifyArtifactVerifiedResult
  | VerifyArtifactRevokedResult
  | VerifyDocumentVerifiedResult
  | VerifyDocumentRevokedResult
  | VerifyUnverifiedResult;

export type VerifyArtifactResult =
  | VerifyArtifactVerifiedResult
  | VerifyArtifactRevokedResult;

export type VerifyDocumentResult =
  | VerifyDocumentVerifiedResult
  | VerifyDocumentRevokedResult;