"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import type { Locale } from "@/lib/weddingCopy";

type FloatingPageNavProps = {
  locale: Locale;
};

export function FloatingPageNav({ locale }: FloatingPageNavProps) {
  const pathname = usePathname();

  const labels = useMemo(
    () =>
      locale === "fr"
        ? {
            menu: "Navigation",
            welcome: "Accueil",
            schedule: "Programme",
            rsvp: "RSVP",
          }
        : {
            menu: "Navigation",
            welcome: "Welcome",
            schedule: "Schedule",
            rsvp: "RSVP",
          },
    [locale]
  );

  const navItems = [
    { href: "/", label: labels.welcome, active: pathname === "/" },
    { href: "/schedule", label: labels.schedule, active: pathname === "/schedule" },
    { href: "/rsvp", label: labels.rsvp, active: pathname === "/rsvp" },
  ];

  return (
    <>
      <div className="fixed top-4 left-1/2 z-50 hidden -translate-x-1/2 lg:block">
        <nav
          aria-label={labels.menu}
          className="inline-flex items-center gap-1 rounded-full border border-[var(--border-muted)] bg-white/95 p-1 shadow-[0_12px_28px_rgba(51,44,48,0.15)] backdrop-blur-sm"
        >
          {navItems.map((item) => (
            <Link
              key={`desktop-${item.href}`}
              href={`${item.href}?lang=${locale}`}
              aria-current={item.active ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#332c30]/40 focus-visible:ring-offset-2 ${
                item.active
                  ? "bg-[var(--surface-soft)] text-[#332c30]"
                  : "text-[#332c30] hover:bg-[var(--surface-soft)]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="fixed right-0 bottom-0 left-0 z-50 border-t border-[var(--border-muted)] bg-white/95 px-3 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.55rem)] backdrop-blur-sm lg:hidden">
        <nav aria-label={labels.menu} className="mx-auto grid max-w-md grid-cols-3 gap-2">
          {navItems.map((item) => (
            <Link
              key={`mobile-${item.href}`}
              href={`${item.href}?lang=${locale}`}
              aria-current={item.active ? "page" : undefined}
              className={`inline-flex min-h-11 items-center justify-center rounded-xl px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#332c30]/40 focus-visible:ring-offset-2 ${
                item.active
                  ? "bg-[var(--surface-soft)] text-[#332c30]"
                  : "text-[#332c30] hover:bg-[var(--surface-soft)]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
