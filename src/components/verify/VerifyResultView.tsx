import type {
  VerifyPublicResult,
  VerifyV2RecordResult,
} from "@/lib/verify/types";

import ArtifactView from "@/components/verify/ArtifactView";
import DocumentView from "@/components/verify/DocumentView";
import RecordView from "@/components/verify/RecordView";
import { UnverifiedView } from "@/components/verify/UnverifiedView";

import { normalizeStatus } from "@/lib/verify/normalize";

type Props = {
  identifier: string;
  result: VerifyPublicResult;
};

function hasEntity(
  result: VerifyPublicResult
): result is Exclude<VerifyPublicResult, { status: "unverified" }> {
  return "entity" in result;
}

function isV2Record(result: VerifyPublicResult): result is VerifyV2RecordResult {
  return hasEntity(result) && result.entity === "record";
}

export default function VerifyResultView({ result, identifier }: Props) {
  // V2 universal Records have a richer lifecycle than the legacy normalizer
  // currently understands, so route them before legacy status normalization.
  if (isV2Record(result)) {
    return <RecordView result={result} identifier={identifier} />;
  }

  const uiStatus = normalizeStatus(result);

  if (uiStatus === "not_found") {
    return <UnverifiedView variant="not_found" />;
  }

  if (!hasEntity(result)) {
    return <UnverifiedView variant="not_found" />;
  }

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
