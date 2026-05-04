import type { VerifyPublicResult } from "@/lib/verify/types";

import ArtifactView from "@/components/verify/ArtifactView";
import DocumentView from "@/components/verify/DocumentView";
import { UnverifiedView } from "@/components/verify/UnverifiedView";

type Props = {
  identifier: string;
  result: VerifyPublicResult;
};

export default function VerifyResultView({ result, identifier }: Props) {

  // 🔴 1. UNVERIFIED
  if (
    result.status === "unverified" ||
    !result.entity ||
    !["artifact", "artifact_piece", "document"].includes(result.entity)
  ) {
    return <UnverifiedView />;
  }

  // 🔴 2. LOG DE INTEGRIDAD (observabilidad)
  if (result.status === "verified" && result.chain_valid === false) {
    console.warn("[VERIFY] Integrity inconsistency detected", identifier);
  }

  // 🟢 3. ARTIFACTS
  if (result.entity === "artifact" || result.entity === "artifact_piece") {
    return (
      <ArtifactView
        result={result}
        identifier={identifier}
      />
    );
  }

  // 🟢 4. DOCUMENTS
  if (result.entity === "document") {
    return (
      <DocumentView
        result={result}
        identifier={identifier}
      />
    );
  }

  // 🟡 5. fallback defensivo
  return <UnverifiedView />;
}