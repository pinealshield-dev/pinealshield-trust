import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { verifyByHash } from "@/lib/verify/lookup";

import { VerifiedView } from "@/components/verify/VerifiedView";
import { RevokedView } from "@/components/verify/RevokedView";
import { ReplacedView } from "@/components/verify/ReplacedView";
import { UnverifiedView } from "@/components/verify/UnverifiedView";

export const metadata: Metadata = {
  title: "Pineal Shield — Certificado",
  robots: { index: false, follow: false },
};

interface Props {
  params: {
    hash?: string | string[];
  };
}

export default async function VerifyByHashPage({ params }: Props) {
  const { hash: raw } = await params;

  const hash =
    typeof raw === "string"
      ? decodeURIComponent(raw).trim()
      : Array.isArray(raw)
      ? decodeURIComponent(raw[0]).trim()
      : "";

  if (!hash || hash.length < 8 || hash.length > 32) {
    notFound();
  }

  const result = await verifyByHash(hash);

  switch (result.status) {
    case "unverified":
      return <UnverifiedView />;

    case "revoked":
      return <RevokedView result={result} />;

    case "replaced":
      return <ReplacedView result={result} />;

    case "verified":
      return <VerifiedView hash={hash} result={result} />;
  }
}
