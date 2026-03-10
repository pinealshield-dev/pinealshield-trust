import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { verifyIdentifier } from "@/lib/verify/lookup";

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
    identifier?: string | string[];
  };
}

export default async function VerifyByHashPage({ params }: Props) {
  const { identifier: raw } = await params;

  const identifier =
    typeof raw === "string"
      ? decodeURIComponent(raw).trim()
      : Array.isArray(raw)
      ? decodeURIComponent(raw[0]).trim()
      : "";

  if (!identifier || identifier.length < 8 || identifier.length > 64) {
    notFound();
  }

  const result = await verifyIdentifier(identifier);

  switch (result.status) {
    case "unverified":
      return <UnverifiedView />;

    case "revoked":
      return <RevokedView result={result} />;

    case "replaced":
      return <ReplacedView result={result} />;

    case "verified":
      return <VerifiedView identifier={identifier} result={result} />;
  }
}
