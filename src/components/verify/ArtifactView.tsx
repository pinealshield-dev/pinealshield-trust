import {
  VerifyArtifactVerifiedResult,
  VerifyArtifactRevokedResult,
} from "@/lib/verify/types";

import  RevokedView  from "@/components/verify/RevokedView";
import  ReplacedView from "@/components/verify/ReplacedView";
import  VerifiedView  from "@/components/verify/VerifiedView";

type Props = {
  identifier: string;
  result:
    | VerifyArtifactVerifiedResult
    | VerifyArtifactRevokedResult;
};

export default function ArtifactView({ result, identifier }: Props) {
  if (result.status === "verified") {
    return <VerifiedView result={result} identifier={identifier} />;
  }

  if (result.status === "revoked") {
    return <RevokedView result={result} identifier={identifier} />;
  }

  if (result.status === "replaced") {
    return <ReplacedView result={result} identifier={identifier} />;
  }

  return null;
}