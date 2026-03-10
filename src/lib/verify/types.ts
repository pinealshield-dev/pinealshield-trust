export type VerifyPublicResult =
  | {
      status: "verified";
      entity: "artifact" | "artifact_piece" | "hash";

      kind: "producto" | "pieza";

      nombre: string;

      artifact_id?: string;
      artifact_piece_id?: string;

      hash?: string;

      issued_at: string;

      image_url: string | null;
      brand_name: string | null;

      signature: string;
      qr_exp: string;

      issuer_status: string;
    }

  | {
      status: "revoked" | "replaced";

      entity: "artifact" | "artifact_piece" | "hash";

      kind: "producto" | "pieza";

      nombre: string;

      artifact_id?: string;
      artifact_piece_id?: string;

      hash?: string;

      issued_at: string;

      image_url: string | null;
      brand_name: string | null;

      issuer_status: string;
    }

  | {
      status: "unverified";
    };