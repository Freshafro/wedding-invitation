"use client";

import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { RsvpForm } from "@/components/RsvpForm";
import { LanguageToggle } from "@/components/LanguageToggle";
import { PageFlowNav } from "@/components/PageFlowNav";
import { SiteShell } from "@/components/SiteShell";
import { getLocale, getWeddingCopy } from "@/lib/weddingCopy";

export default function RsvpPage() {
  const [locale, setLocale] = useState(() => getLocale(null));

  useEffect(() => {
    const nextLocale = getLocale(new URLSearchParams(window.location.search).get("lang"));
    setLocale(nextLocale);
  }, []);

  const t = getWeddingCopy(locale);

  return (
    <SiteShell locale={locale}>
      <main className="relative min-h-screen bg-white px-5 py-5 sm:px-8 sm:pb-5">
        <div className="relative mx-auto w-full max-w-3xl">
          <section className="space-y-10">
            <LanguageToggle locale={locale} />

            <figure className="relative mx-auto w-full max-w-2xl overflow-hidden bg-[var(--surface-soft)] shadow-[0_10px_30px_rgba(51,44,48,0.08)] aspect-[16/10] sm:aspect-[16/9]">
              <Image
                src="/4R4A4353.jpg"
                alt="Georges and Christella laughing together"
                fill
                className="no-image-save object-cover object-center"
                sizes="(min-width: 1024px) 832px, 100vw"
                unoptimized
                draggable={false}
                onContextMenu={(event) => event.preventDefault()}
                onDragStart={(event) => event.preventDefault()}
              />
            </figure>

            <p className="font-display mx-auto mb-5 mt-10 w-full max-w-prose text-center text-lg leading-8 sm:text-xl">
              {t.closingMessage}
            </p>

            <Suspense
              fallback={
                <div className="rounded-3xl border border-[var(--border-muted)] bg-[var(--surface-soft)] p-7 text-sm">
                  Loading RSVP form...
                </div>
              }
            >
              <RsvpForm locale={locale} maxPeoplePerInvitationMessage={t.maxPeoplePerInvitation} />
            </Suspense>
          </section>

          <div className="mt-12 sm:mt-0">
            <PageFlowNav
              locale={locale}
              previous={{
                href: "/schedule",
                label: t.backToSchedule,
              }}
            />
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
