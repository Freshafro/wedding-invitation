"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/weddingCopy";

export function LanguageToggle({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  return (
    <div className="flex justify-end">
      <div className="inline-flex items-center gap-1 rounded-full border border-[var(--border-muted)] bg-[var(--surface-soft)] p-1 text-xs font-semibold uppercase tracking-[0.12em]">
        <Link
          href={`${pathname}?lang=en`}
          className={`rounded-full px-4 py-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#332c30]/40 focus-visible:ring-offset-2 ${
            locale === "en" ? "bg-[#332c30] text-white" : "text-[#332c30] hover:bg-[var(--surface-warm)]/70"
          }`}
          prefetch={false}
        >
          EN
        </Link>
        <Link
          href={`${pathname}?lang=fr`}
          className={`rounded-full px-4 py-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#332c30]/40 focus-visible:ring-offset-2 ${
            locale === "fr" ? "bg-[#332c30] text-white" : "text-[#332c30] hover:bg-[var(--surface-warm)]/70"
          }`}
          prefetch={false}
        >
          FR
        </Link>
      </div>
    </div>
  );
}
