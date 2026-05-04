import { createClient } from "@supabase/supabase-js";
import type { VerifyPublicResult } from "./types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function verifyIdentifier(
  identifier: string
): Promise<VerifyPublicResult> {

  const { data, error } = await supabase.rpc("verify_identifier_public",{ 
    p_identifier: identifier,
    p_context: {
      type: "verify_web",
      platform: "web",
      source: "public_verify",
      ts: new Date().toISOString()
    }
  });

  // 🔴 CASO 1 — ERROR O SIN DATA
  if (error || !data) {
    return { status: "unverified" };
  }

  // 🔴 CASO 2 — DATA MAL FORMADA (CLAVE)
  if (
    !data.status ||
    !["verified", "revoked", "replaced"].includes(data.status)
  ) {
    return { status: "unverified" };
  }

  // 🔴 CASO 3 — NO ENTITY → NO EXISTE
  if (!data.entity) {
    return { status: "unverified" };
  }

  return data as VerifyPublicResult;
}