import { createClient } from "@supabase/supabase-js";
import type { VerifyPublicResult } from "./types";
import {
  verifyPvpPublicBundle,
  type PvpPublicVerificationBundle,
} from "./pvp-local";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function hasEntity(
  result: VerifyPublicResult
): result is Exclude<VerifyPublicResult, { status: "unverified" }> {
  return "entity" in result;
}

function getCanonicalIdentifier(
  result: Exclude<VerifyPublicResult, { status: "unverified" }>,
  fallback: string
): string {
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

export async function verifyIdentifier(
  identifier: string
): Promise<VerifyPublicResult> {
  const { data, error } = await supabase.rpc("verify_identifier_public", {
    p_identifier: identifier,
    p_context: {
      type: "verify_web",
      platform: "web",
      source: "public_verify",
      ts: new Date().toISOString(),
    },
  });

  if (error || !data) {
    return { status: "unverified" };
  }

  if (
    !data.status ||
    !["verified", "revoked", "replaced"].includes(data.status)
  ) {
    return { status: "unverified" };
  }

  if (!data.entity) {
    return { status: "unverified" };
  }

  return attachLocalPvpVerification(data as VerifyPublicResult, identifier);
}