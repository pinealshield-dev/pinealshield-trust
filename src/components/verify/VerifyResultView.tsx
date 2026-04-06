import type { VerifyPublicResult } from "@/lib/verify/types";

import ArtifactView from "@/components/verify/ArtifactView";
import DocumentView from "@/components/verify/DocumentView";
import {UnverifiedView} from "@/components/verify/UnverifiedView";

type Props = {
  identifier: string;
  result: VerifyPublicResult;
};

export default function VerifyResultView({ result, identifier }: Props) {
  // 🔴 1. UNVERIFIED (no entity)
  if (result.status === "unverified") {
    return <UnverifiedView />;
  }

  // 🟢 2. ARTIFACTS
  if (result.entity === "artifact" || result.entity === "artifact_piece") {
    return (
      <ArtifactView
        result={result}
        identifier={identifier}
      />
    );
  }

  // 🟢 3. DOCUMENTS
  if (result.entity === "document") {
    return (
      <DocumentView
        result={result}
        identifier={identifier}
      />
    );
  }

  // 🟡 4. fallback defensivo (no debería pasar)
  return <UnverifiedView />;
}