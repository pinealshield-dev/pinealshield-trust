export type UIStatus =
  | "verified"
  | "revoked"
  | "replaced"
  | "compromised"
  | "not_found";

export function normalizeStatus(result: any): UIStatus {
  // 🔴 Sin resultado o unverified → NO EXISTE
  if (!result || result.status === "unverified") {
    return "not_found";
  }

  // 🔴 Sin entidad válida → NO EXISTE
  if (
    !result.entity ||
    !["artifact", "artifact_piece", "document"].includes(result.entity)
  ) {
    return "not_found";
  }

  // 🔴 Verificado pero cadena inválida → comprometido
  if (result.status === "verified" && result.chain_valid === false) {
    return "compromised";
  }

  return result.status;
}