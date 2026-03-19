"use client";

import type { ReactNode } from "react";
import type { Locale } from "@/lib/weddingCopy";
import { FloatingPageNav } from "@/components/FloatingPageNav";

export function SiteShell({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <div className="pb-10 lg:pt-14 lg:pb-10">
      {children}
      <FloatingPageNav locale={locale} />
    </div>
  );
}
