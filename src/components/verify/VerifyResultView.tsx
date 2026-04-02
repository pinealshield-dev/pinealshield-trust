"use client";

import {
  VerifyPublicResult,
  VerifyArtifactResult,
  VerifyDocumentResult
} from "@/lib/verify/types";

import ArtifactView from "@/components/verify/ArtifactView";
import DocumentView from "@/components/verify/DocumentView";
import { UnverifiedView } from "@/components/verify/UnverifiedView";

type Props = {
  result: VerifyPublicResult;
};

export default function VerifyResultView({ result }: Props) {
  // 🔴 caso base
  if (result.status === "unverified") {
    return <UnverifiedView />;
  }

  // 🔵 routing por entidad (NO por status)
  switch (result.entity) {
   case "artifact":
    case "artifact_piece":
    return <ArtifactView result={result as VerifyArtifactResult} />;

    case "document":
    return <DocumentView result={result as VerifyDocumentResult} />;

    default:
      return <UnverifiedView />;
  }
}