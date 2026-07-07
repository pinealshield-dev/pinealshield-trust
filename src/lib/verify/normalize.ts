export type UIStatus =
  | "verified"
  | "revoked"
  | "replaced"
  | "compromised"
  | "not_found";

type NormalizableVerifyResult = {
  status?: unknown;
  entity?: unknown;
  chain_valid?: unknown;
};

const VALID_ENTITIES = new Set(["artifact", "artifact_piece", "document"]);

export function normalizeStatus(
  result: NormalizableVerifyResult | null | undefined,
): UIStatus {
  if (!result || result.status === "unverified") {
    return "not_found";
  }

  if (
    typeof result.entity !== "string" ||
    !VALID_ENTITIES.has(result.entity)
  ) {
    return "not_found";
  }

  if (result.status === "verified" && result.chain_valid === false) {
    return "compromised";
  }

  if (
    result.status === "verified" ||
    result.status === "revoked" ||
    result.status === "replaced" ||
    result.status === "compromised"
  ) {
    return result.status;
  }

  return "not_found";
}