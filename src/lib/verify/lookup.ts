import { createClient } from "@supabase/supabase-js";
import type {
  VerifyPublicResult,
  VerifyV2RecordResult,
} from "./types";
import {
  verifyPvpPublicBundle,
  type PvpPublicVerificationBundle,
} from "./pvp-local";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRole) {
    return null;
  }

  return createClient(url, serviceRole, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function hasEntity(
  result: VerifyPublicResult
): result is Exclude<VerifyPublicResult, { status: "unverified" }> {
  return "entity" in result;
}

function getCanonicalIdentifier(
  result: Exclude<VerifyPublicResult, { status: "unverified" }>,
  fallback: string
): string {
  if (result.entity === "record") {
    return result.public_id;
  }

  if (result.entity === "document") {
    return result.document_id ?? fallback;
  }

  if (result.entity === "artifact_piece") {
    return result.artifact_piece_id ?? fallback;
  }

  return result.artifact_id ?? fallback;
}

async function attachLocalPvpVerification(
  result: VerifyPublicResult,
  inputIdentifier: string
): Promise<VerifyPublicResult> {
  if (!hasEntity(result)) {
    return result;
  }

  // V2 records use their own canonical fingerprint for now. PVP integration
  // will be added as a separate signed-record layer instead of pretending the
  // current SHA-256 fingerprint is already a PVP signature.
  if (result.entity === "record") {
    return result;
  }

  if (!result.pvp?.signed) {
    return result;
  }

  const canonicalIdentifier = getCanonicalIdentifier(result, inputIdentifier);

  const { data, error } = await supabase.rpc(
    "get_pvp_public_verification_bundle",
    {
      p_identifier: canonicalIdentifier,
    }
  );

  if (error || !data) {
    return {
      ...result,
      pvp: {
        ...result.pvp,
        local_verification: {
          checked: true,
          valid: false,
          reason: error?.message ?? "pvp_public_bundle_not_available",
        },
      },
    } as VerifyPublicResult;
  }

  const localVerification = await verifyPvpPublicBundle(
    data as PvpPublicVerificationBundle
  );

  return {
    ...result,
    pvp: {
      ...result.pvp,
      local_verification: localVerification,
    },
  } as VerifyPublicResult;
}

async function verifyV2Record(
  identifier: string
): Promise<VerifyV2RecordResult | null> {
  const admin = getServerSupabase();

  if (!admin) {
    console.error(
      "[verify-v2] SUPABASE_SERVICE_ROLE_KEY is not configured on the trust service"
    );
    return null;
  }

  let query = admin
    .from("public_record_projections")
    .select(`
      record_id,
      tenant_id,
      public_token,
      public_id,
      status,
      record_type,
      entity_type,
      template_code,
      template_name,
      template_labels,
      issuer_name,
      issuer_slug,
      issuer_trust_status,
      public_data,
      integrity_hash,
      hash_algorithm,
      hash_version,
      issued_at,
      effective_from,
      expires_at,
      revoked_at,
      replaces_public_id,
      replaced_by_public_id
    `);

  query = UUID_PATTERN.test(identifier)
    ? query.eq("public_token", identifier)
    : query.eq("public_id", identifier);

  const { data, error } = await query.maybeSingle();

  if (error) {
    console.error("[verify-v2] projection lookup failed", error);
    return null;
  }

  if (!data) {
    return null;
  }

  const publicStatus: VerifyV2RecordResult["status"] =
    data.status === "active"
      ? "verified"
      : data.status === "revoked"
      ? "revoked"
      : data.status === "replaced"
      ? "replaced"
      : data.status === "expired"
      ? "expired"
      : "suspended";

  const audit = await admin.from("audit_verify").insert({
    hash: data.integrity_hash,
    valid: data.status === "active",
    result: publicStatus,
    source: "public_verify_v2",
    identifier: data.public_id,
    verifier_type: "public_web",
    tenant_id: data.tenant_id,
    verifiable_record_id: data.record_id,
    public_token: data.public_token,
    metadata: {
      protocol: "pineal-record-v2",
      lookup_type: UUID_PATTERN.test(identifier) ? "public_token" : "public_id",
      record_status: data.status,
      verified_at: new Date().toISOString(),
    },
  });

  if (audit.error) {
    // A verification response must remain available even if telemetry fails.
    console.error("[verify-v2] audit insert failed", audit.error);
  }

  return {
    status: publicStatus,
    entity: "record",
    kind: "verifiable_record",
    public_id: data.public_id,
    public_token: data.public_token,
    record_type: data.record_type,
    entity_type: data.entity_type,
    template_code: data.template_code,
    template_name: data.template_name,
    template_labels: data.template_labels ?? {},
    issuer_name: data.issuer_name,
    issuer_slug: data.issuer_slug,
    issuer_status: data.issuer_trust_status,
    public_data: data.public_data ?? {},
    integrity_hash: data.integrity_hash,
    hash_algorithm: data.hash_algorithm,
    hash_version: data.hash_version,
    issued_at: data.issued_at,
    effective_from: data.effective_from,
    expires_at: data.expires_at,
    revoked_at: data.revoked_at,
    replaces_public_id: data.replaces_public_id,
    replaced_by_public_id: data.replaced_by_public_id,
    verification_origin: "pineal_record_v2",
  };
}

export async function verifyIdentifier(
  identifier: string
): Promise<VerifyPublicResult> {
  // Preserve the entire legacy/PVP verification surface first. V2 is an
  // additive fallback so current artifacts, pieces and documents are not
  // affected by this release.
  const { data, error } = await supabase.rpc("verify_identifier_public", {
    p_identifier: identifier,
    p_context: {
      type: "verify_web",
      platform: "web",
      source: "public_verify",
      ts: new Date().toISOString(),
    },
  });

  if (
    !error &&
    data?.status &&
    ["verified", "revoked", "replaced"].includes(data.status) &&
    data.entity
  ) {
    return attachLocalPvpVerification(
      data as VerifyPublicResult,
      identifier
    );
  }

  const v2Result = await verifyV2Record(identifier);

  if (v2Result) {
    return v2Result;
  }

  return { status: "unverified" };
}
