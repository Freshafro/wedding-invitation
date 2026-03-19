import Link from "next/link";
import type { Locale } from "@/lib/weddingCopy";

type FlowLink = {
  href: string;
  label: string;
};

export function PageFlowNav({
  locale,
  previous,
  next,
}: {
  locale: Locale;
  previous?: FlowLink;
  next?: FlowLink;
}) {
  const withLang = (path: string) => `${path}?lang=${locale}`;

  return (
    <div className="mt-8 hidden items-center justify-between gap-3 sm:flex">
      <div>
        {previous ? (
          <Link
            href={withLang(previous.href)}
            className="inline-flex items-center justify-center rounded-xl border border-[var(--border-muted)] bg-[var(--surface-soft)] px-4 py-2 text-sm font-semibold text-[#332c30] transition hover:bg-[var(--surface-warm)]/50"
          >
            {previous.label}
          </Link>
        ) : null}
      </div>
      <div>
        {next ? (
          <Link
            href={withLang(next.href)}
            className="inline-flex items-center justify-center rounded-xl border border-[var(--border-muted)] bg-[var(--surface-soft)] px-4 py-2 text-sm font-semibold text-[#332c30] transition hover:bg-[var(--surface-warm)]/50"
          >
            {next.label}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
