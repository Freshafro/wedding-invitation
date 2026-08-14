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
    document.documentElement.lang = locale;
  }, [locale]);

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

  // The mobile nav is fixed to the bottom and ~62px tall before the safe-area
  // inset, so pb-10 did not clear it and the seating result card ran underneath.
  // The inset is added on top so notched phones get the same clearance as flat ones.
  return (
    <div className="pb-[calc(env(safe-area-inset-bottom)+5.5rem)] lg:pt-14 lg:pb-10">
      {children}
      <FloatingPageNav locale={locale} />
    </div>
  );
}
