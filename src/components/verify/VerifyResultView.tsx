import type { VerifyPublicResult } from "@/lib/verify/types";

import ArtifactView from "@/components/verify/ArtifactView";
import DocumentView from "@/components/verify/DocumentView";
import { UnverifiedView } from "@/components/verify/UnverifiedView";

import { normalizeStatus } from "@/lib/verify/normalize";

type Props = {
  identifier: string;
  result: VerifyPublicResult;
};

// 🔴 TYPE GUARD
function hasEntity(
  result: VerifyPublicResult
): result is Exclude<VerifyPublicResult, { status: "unverified" }> {
  return (result as any).entity !== undefined;
}

export default function VerifyResultView({ result, identifier }: Props) {

  const uiStatus = normalizeStatus(result);

  // 🔴 1. NOT FOUND
  if (uiStatus === "not_found") {
    return <UnverifiedView variant="not_found" />;
  }

  // 🔴 2. SI NO TIENE ENTITY → también fuera
  if (!hasEntity(result)) {
    return <UnverifiedView variant="not_found" />;
  }

  // 🔴 3. LOG INTEGRIDAD
  if (uiStatus === "compromised") {
    console.warn("[VERIFY] Integrity inconsistency detected", identifier);
  }

  // 🟢 4. ARTIFACTS
  if (result.entity === "artifact" || result.entity === "artifact_piece") {
    return (
      <ArtifactView
        result={result}
        identifier={identifier}
      />
    );
  }

  // 🟢 5. DOCUMENTS
  if (result.entity === "document") {
    return (
      <DocumentView
        result={result}
        identifier={identifier}
      />
    );
  }

  // 🟡 fallback
  return <UnverifiedView variant="not_found" />;
}