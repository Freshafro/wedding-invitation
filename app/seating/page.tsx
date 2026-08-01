import type { Metadata } from "next";
import { LanguageToggle } from "@/components/LanguageToggle";
import { SeatingLookup } from "@/components/SeatingLookup";
import { SiteShell } from "@/components/SiteShell";
import { getLocale, getWeddingCopy } from "@/lib/weddingCopy";

// Reached by QR code at the entrance only. Keeping it out of search results means
// the table list is not discoverable before the day.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function SeatingPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  const locale = getLocale(params.lang ?? null);
  const t = getWeddingCopy(locale);

  return (
    <SiteShell locale={locale}>
      <main className="relative min-h-screen bg-white px-5 py-5 sm:px-8">
        <div className="relative mx-auto w-full max-w-xl">
          <LanguageToggle locale={locale} />

          <div className="mt-6 space-y-3">
            <h1 className="font-display text-3xl leading-tight sm:text-4xl">{t.seatingTitle}</h1>
            <p className="font-display text-lg leading-8 sm:text-xl">{t.seatingIntro}</p>
          </div>

          <div className="mt-6">
            <SeatingLookup locale={locale} />
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
