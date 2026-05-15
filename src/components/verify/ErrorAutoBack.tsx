"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function ErrorAutoBack() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace("/verify");
    }, 10000);

    return () => clearTimeout(t);
  }, [router]);

  return null;
}
