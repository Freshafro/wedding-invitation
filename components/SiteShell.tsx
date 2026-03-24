"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/weddingCopy";
import { FloatingPageNav } from "@/components/FloatingPageNav";

const INVITE_CODE_SESSION_KEY = "inviteCode";

export function SiteShell({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const codeParam = searchParams.get("code");
    if (!codeParam) {
      return;
    }

    const normalized = codeParam.trim().toUpperCase();
    if (normalized) {
      window.sessionStorage.setItem(INVITE_CODE_SESSION_KEY, normalized);
    }

  }, [searchParams]);

  return (
    <div className="pb-10 lg:pt-14 lg:pb-10">
      {children}
      <FloatingPageNav locale={locale} />
    </div>
  );
}
