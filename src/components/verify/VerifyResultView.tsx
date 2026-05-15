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
  return "entity" in result;
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


  // 🟢 ENTITY ROUTING
  switch (result.entity) {

    case "artifact":
    case "artifact_piece":
      return (
        <ArtifactView
          result={result}
          identifier={identifier}
        />
      );

    case "document":
      return (
        <DocumentView
          result={result}
          identifier={identifier}
        />
      );

    default:
      return <UnverifiedView variant="not_found" />;
  }
}