import { flattenedVerify, importJWK, type FlattenedJWS, type JWK } from "jose";

type PvpSignedEnvelope = {
  protected: string;
  payload: string;
  signature: string;
};

export type PvpPublicVerificationBundle =
  | {
      signed: false;
      reason?: string;
      event_type?: string;
      record_hash?: string;
      chain_created_at?: string;
    }
  | {
      signed: true;
      version: string;
      issuer_id: string;
      key_id: string;
      algorithm: string;
      event_type: string;
      record_hash: string;
      chain_created_at: string;
      payload_hash: string;
      status: string;
      key_status: string;
      public_key_jwk: JWK;
      signed_envelope: PvpSignedEnvelope;
      signed_at: string;
    };

export type PvpLocalVerificationResult = {
  checked: boolean;
  valid: boolean;
  reason?: string;
  payload_hash?: string;
};

type PvpPublicPayload = {
  pvp: "0.1-public";
  type: "pineal.public.certification.event";
  issuer: string;
  key_id: string;
  algorithm: "Ed25519";
  entity_type: string;
  identifier: string;
  event_type: string;
  record_hash: string;
  event_created_at: string;
  signed_at: string;
  verification_origin: "verify.pinealshield.com";
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPublicPayload(value: unknown): value is PvpPublicPayload {
  if (!isObject(value)) return false;

  return (
    value.pvp === "0.1-public" &&
    value.type === "pineal.public.certification.event" &&
    typeof value.issuer === "string" &&
    typeof value.key_id === "string" &&
    value.algorithm === "Ed25519" &&
    typeof value.identifier === "string" &&
    typeof value.event_type === "string" &&
    typeof value.record_hash === "string" &&
    typeof value.event_created_at === "string" &&
    typeof value.signed_at === "string" &&
    value.verification_origin === "verify.pinealshield.com"
  );
}

async function sha256Hex(input: Uint8Array): Promise<string> {
  const buffer = new ArrayBuffer(input.byteLength);
  const bytes = new Uint8Array(buffer);

  bytes.set(input);

  const digest = await crypto.subtle.digest("SHA-256", buffer);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyPvpPublicBundle(
  bundle: PvpPublicVerificationBundle | null | undefined
): Promise<PvpLocalVerificationResult> {
  try {
    if (!bundle?.signed) {
      return {
        checked: false,
        valid: false,
        reason: bundle?.reason ?? "pvp_bundle_not_signed",
      };
    }

    if (bundle.algorithm !== "Ed25519") {
      return {
        checked: true,
        valid: false,
        reason: "unsupported_algorithm",
      };
    }

    if (!bundle.public_key_jwk || !bundle.signed_envelope) {
      return {
        checked: true,
        valid: false,
        reason: "missing_public_key_or_envelope",
      };
    }

    const key = await importJWK(bundle.public_key_jwk, "EdDSA");

    const verified = await flattenedVerify(
      bundle.signed_envelope as FlattenedJWS,
      key,
      {
        algorithms: ["EdDSA"],
      }
    );

        const protectedHeader = verified.protectedHeader as
      | {
          alg?: unknown;
          kid?: unknown;
          typ?: unknown;
          pvp?: unknown;
        }
      | undefined;

    if (!protectedHeader) {
      return {
        checked: true,
        valid: false,
        reason: "missing_protected_header",
      };
    }

    if (protectedHeader.alg !== "EdDSA") {
      return {
        checked: true,
        valid: false,
        reason: "invalid_protected_alg",
      };
    }

    if (protectedHeader.kid !== bundle.key_id) {
      return {
        checked: true,
        valid: false,
        reason: "key_id_mismatch",
      };
    }

    if (protectedHeader.typ !== "PVP") {
      return {
        checked: true,
        valid: false,
        reason: "invalid_token_type",
      };
    }

    if (protectedHeader.pvp !== "0.1-public") {
      return {
        checked: true,
        valid: false,
        reason: "invalid_pvp_version",
      };
    }

    const payloadHash = await sha256Hex(verified.payload);

    if (payloadHash !== bundle.payload_hash) {
      return {
        checked: true,
        valid: false,
        reason: "payload_hash_mismatch",
        payload_hash: payloadHash,
      };
    }

    const payloadText = new TextDecoder().decode(verified.payload);
    const payload = JSON.parse(payloadText) as unknown;

    if (!isPublicPayload(payload)) {
      return {
        checked: true,
        valid: false,
        reason: "invalid_public_payload",
        payload_hash: payloadHash,
      };
    }

    if (payload.issuer !== bundle.issuer_id) {
      return {
        checked: true,
        valid: false,
        reason: "issuer_mismatch",
        payload_hash: payloadHash,
      };
    }

    if (payload.key_id !== bundle.key_id) {
      return {
        checked: true,
        valid: false,
        reason: "payload_key_id_mismatch",
        payload_hash: payloadHash,
      };
    }

    if (payload.event_type !== bundle.event_type) {
      return {
        checked: true,
        valid: false,
        reason: "event_type_mismatch",
        payload_hash: payloadHash,
      };
    }

    if (payload.record_hash !== bundle.record_hash) {
      return {
        checked: true,
        valid: false,
        reason: "record_hash_mismatch",
        payload_hash: payloadHash,
      };
    }

    return {
      checked: true,
      valid: true,
      payload_hash: payloadHash,
    };
  } catch (error) {
    return {
      checked: true,
      valid: false,
      reason:
        error instanceof Error
          ? error.message
          : "pvp_signature_verification_failed",
    };
  }
}