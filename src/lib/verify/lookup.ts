// src/lib/verify/lookup.ts
import { createClient } from "@supabase/supabase-js";
import type { VerifyPublicResult } from "./types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function verifyByHash(
  hash: string
): Promise<VerifyPublicResult> {
  const { data, error } = await supabase.rpc(
    "verify_by_hash_public",
    { p_hash: hash }
  );

  if (error || !data) {
    return { status: "unverified" };
  }

  return data as VerifyPublicResult;
}
