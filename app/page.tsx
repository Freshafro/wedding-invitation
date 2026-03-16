"use client";

import Image from "next/image";
import { Suspense, useMemo, useState } from "react";
import { Great_Vibes } from "next/font/google";
import { RsvpForm } from "@/components/RsvpForm";

type Locale = "en" | "fr";

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
});

const photoImagePaths = ["/4R4A4423.jpg", "/4R4A4249.jpg", "/4R4A4401.jpg", "/4R4A4353.jpg"];

export default function Home() {
  const [locale, setLocale] = useState<Locale>("fr");

  const copy = useMemo(
    () => ({
      en: {
        coupleNames: "Georges & Christella",
        heroKicker: "We are getting married",
        heroDate: "August 15, 2026",
        announcement: (
          <>
            With grateful hearts, the families of <strong>Samuel Simon Boum</strong> and{" "}
            <strong>Rosa Marie Ngo Um</strong>, together with <strong>Anastase Nzobonimpa</strong> and{" "}
            <strong>Joze Tuyisenge</strong>, request the honor of your presence at the wedding celebration of their
            children, <strong>Georges Anthony Boum</strong> and <strong>Christella Emerusenge</strong>, 
            on the <br /><strong>15th of August, 2026</strong>.
          </>
        ),
        scheduleTitle: "Wedding Day Schedule",
        dateLabel: "Saturday, August 15, 2026",
        ceremonyTitle: "Wedding Ceremony",
        ceremonyTime: "1:30 PM - 2:30 PM",
        ceremonyVenue: "La Visitation-de-la-Bienheureuse-Vierge-Marie",
        receptionTitle: "Reception",
        receptionTime: "Starting 5:00 PM",
        receptionVenue: "Centre des congrès et banquets Renaissance",
        openMap: "Open in Google Maps",
        heroPhotoAlts: [
          "Georges and Christella smiling together",
          "Georges and Christella portrait",
          "Georges and Christella candid moment",
        ],
        closingMessage: (
          <>
            We would be delighted to celebrate this moment with you. Please confirm your attendance below before{" "}
            <strong>July 1, 2026</strong>.
          </>
        ),
        maxPeoplePerInvitation: "Please note that there is a maximum number of people per invitation code and that children under the age of 16 are unfortunately not allowed to attend the reception.",
      },
      fr: {
        coupleNames: "Georges & Christella",
        heroKicker: "Nous nous marions",
        heroDate: "15 août 2026",
        announcement: (
          <>
            C&apos;est avec une immense joie que les familles de <strong>Samuel Simon Boum</strong> et{" "}
            <strong>Rosa Marie Ngo Um Epse Boum</strong>, ainsi qu&apos;<strong>Anastase Nzobonimpa</strong> et{" "}
            <strong>Joze Tuyisenge</strong>, ont l&apos;honneur de vous convier au mariage de leurs enfants,{" "}
            <strong>Georges Anthony Boum</strong> et <strong>Christella Emerusenge</strong>, qui sera célébré le <br /><strong>15 août 2026</strong>.
          </>
        ),
        scheduleTitle: "Programme de la journée",
        dateLabel: "Samedi 15 août 2026",
        ceremonyTitle: "Cérémonie de mariage",
        ceremonyTime: "13 h 30 - 14 h 30",
        ceremonyVenue: "La Visitation-de-la-Bienheureuse-Vierge-Marie",
        receptionTitle: "Réception",
        receptionTime: "À partir de 17 h 00",
        receptionVenue: "Centre des congrès et banquets Renaissance",
        openMap: "Ouvrir dans Google Maps",
        heroPhotoAlts: [
          "Georges et Christella souriants ensemble",
          "Portrait de Georges et Christella",
          "Moment spontané de Georges et Christella",
        ],
        closingMessage: <>Nous serions ravis de célébrer ce moment avec vous. Merci de confirmer votre présence ci-dessous avant le <strong>1er juillet 2026</strong>.</>,
        maxPeoplePerInvitation: "Prenez note qu'il y a un nombre maximum de personnes par code d'invitation et que les enfants de moins de 16 ans ne sont malheureusement pas autorisés à participer à la réception.",
      },
    }),
    []
  );

  const t = copy[locale];

  return (
    <main className="relative min-h-screen overflow-hidden bg-white px-5 py-5 sm:px-8">
      <div className="relative mx-auto w-full max-w-3xl">
        <section>
          <div className="flex justify-end">
            <div className="inline-flex items-center gap-1 rounded-full border border-[var(--border-muted)] bg-[var(--surface-soft)] p-1 text-xs font-semibold uppercase tracking-[0.12em]">
              <button
                type="button"
                onClick={() => setLocale("en")}
                className={`rounded-full px-4 py-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#332c30]/40 focus-visible:ring-offset-2 ${
                  locale === "en"
                    ? "bg-[#332c30] text-white"
                    : "text-[#332c30] hover:bg-[var(--surface-warm)]/70"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLocale("fr")}
                className={`rounded-full px-4 py-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#332c30]/40 focus-visible:ring-offset-2 ${
                  locale === "fr"
                    ? "bg-[#332c30] text-white"
                    : "text-[#332c30] hover:bg-[var(--surface-warm)]/70"
                }`}
              >
                FR
              </button>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em]">{t.heroKicker}</p>
            <h1 className={`${greatVibes.className} text-center text-5xl leading-tight font-normal sm:text-6xl`}>
              {t.coupleNames}
            </h1>
          </div>

          <div className="mt-5 mb-10 flex items-center gap-4" aria-hidden>
            <span className="h-px flex-1 border-t border-[var(--border-muted)]" />
            <span className="rounded-full border border-[var(--border-muted)] bg-[var(--surface-soft)] px-4 py-1 text-xs font-semibold uppercase tracking-[0.12em]">
              {t.heroDate}
            </span>
            <span className="h-px flex-1 border-t border-[var(--border-muted)]" />
          </div>

          <p className="my-10 font-display mx-auto w-full max-w-prose text-lg leading-8 sm:text-xl text-center">{t.announcement}</p>

          <div className="mt-10 space-y-4">
            {/* Mobile-specific horizontal snap gallery is temporarily disabled for testing. */}
            {/* <div className="sm:hidden">
              <div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {photoImagePaths.slice(0, 3).map((src, index) => (
                  <figure
                    key={`mobile-${index}`}
                    className="relative aspect-[4/5] w-[82%] shrink-0 snap-center overflow-hidden rounded-2xl bg-[var(--surface-soft)] shadow-[0_10px_30px_rgba(51,44,48,0.08)]"
                  >
                    <Image
                      src={src}
                      alt={t.heroPhotoAlts[index] ?? `Couple photo ${index + 1}`}
                      fill
                      className={`object-cover ${index === 1 ? "scale-[1.03] saturate-110" : ""}`}
                      sizes="82vw"
                      priority={index === 1}
                    />
                  </figure>
                ))}
              </div>
            </div> */}

            <div className="w-full space-y-3">
              <figure className="relative aspect-square overflow-hidden bg-[var(--surface-soft)] shadow-[0_10px_30px_rgba(51,44,48,0.08)] sm:aspect-[4/3]">
                <Image
                  src={photoImagePaths[0]}
                  alt={t.heroPhotoAlts[0] ?? "Couple hero photo"}
                  fill
                  className={`no-image-save object-cover ${photoImagePaths[0] === "/4R4A4423.jpg" ? "object-[center_16%]" : ""}`}
                  sizes="(min-width: 1024px) 832px, 100vw"
                  unoptimized
                  draggable={false}
                  onContextMenu={(event) => event.preventDefault()}
                  onDragStart={(event) => event.preventDefault()}
                  priority
                />
              </figure>

              <div className="grid w-full grid-cols-2 gap-3">
                {photoImagePaths.slice(1, 3).map((src, index) => (
                  <figure
                    key={`${src}-${index}`}
                    className="relative aspect-[4/4] overflow-hidden bg-[var(--surface-soft)] shadow-[0_10px_30px_rgba(51,44,48,0.08)]"
                  >
                    <Image
                      src={src}
                      alt={t.heroPhotoAlts[index + 1] ?? `Couple photo ${index + 2}`}
                      fill
                      className={`no-image-save object-cover ${src === "/4R4A4249.jpg" ? "object-[center_12%] scale-[1.12]" : ""}`}
                      sizes="(min-width: 1024px) 400px, 50vw"
                      unoptimized
                      draggable={false}
                      onContextMenu={(event) => event.preventDefault()}
                      onDragStart={(event) => event.preventDefault()}
                    />
                  </figure>
                ))}
              </div>
            </div>
          </div>

          <div className="my-10 flex items-center justify-center gap-3 py-0.5" aria-hidden>
            <span className="h-px w-16 bg-[var(--border-muted)]/70" />
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--border-muted)]" />
            <span className="h-px w-16 bg-[var(--border-muted)]/70" />
          </div>

          <div className="space-y-5 rounded-3xl">
            <div className="space-y-2">
              <h2 className="font-display text-2xl leading-tight sm:text-3xl">{t.scheduleTitle}</h2>
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#5c5358]">{t.dateLabel}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <article className="flex h-full flex-col gap-3 rounded-2xl border border-[var(--border-muted)] bg-white p-4 shadow-[0_8px_24px_rgba(51,44,48,0.06)] sm:p-5">
                <h3 className="font-display text-2xl leading-tight sm:text-[1.7rem]">{t.ceremonyTitle}</h3>
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#5c5358] sm:text-sm">{t.ceremonyTime}</p>
                <p className="text-[15px] leading-7">{t.ceremonyVenue}</p>
                <p className="text-[15px] leading-7 text-[#5c5358]">1847 Boul. Gouin E, Montreal, QC H2C 1C8</p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=1847+Boul.+Gouin+E%2C+Montreal%2C+QC+H2C+1C8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center justify-center self-start rounded-xl border border-[#332c30] bg-[#332c30] px-4 py-1 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#332c30]/40 focus-visible:ring-offset-2"
                >
                  {t.openMap}
                </a>
              </article>

              <article className="flex h-full flex-col gap-3 rounded-2xl border border-[var(--border-muted)] bg-white p-4 shadow-[0_8px_24px_rgba(51,44,48,0.06)] sm:p-5">
                <h3 className="font-display text-2xl leading-tight sm:text-[1.7rem]">{t.receptionTitle}</h3>
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#5c5358] sm:text-sm">{t.receptionTime}</p>
                <p className="text-[15px] leading-7">{t.receptionVenue}</p>
                <p className="text-[15px] leading-7 text-[#5c5358]">7550 Boulevard Henri-Bourassa E, QC H1J 2K9</p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=7550+Boulevard+Henri-Bourassa+E"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center justify-center self-start rounded-xl border border-[#332c30] bg-[#332c30] px-4 py-1 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#332c30]/40 focus-visible:ring-offset-2"
                >
                  {t.openMap}
                </a>
              </article>
            </div>
          </div>
        </section>

        <div className="my-10 flex items-center justify-center gap-3 py-0.5" aria-hidden>
          <span className="h-px w-16 bg-[var(--border-muted)]/70" />
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--border-muted)]" />
          <span className="h-px w-16 bg-[var(--border-muted)]/70" />
        </div>

        <div className="space-y-10">
          <figure className="relative mx-auto w-full max-w-2xl overflow-hidden bg-[var(--surface-soft)] shadow-[0_10px_30px_rgba(51,44,48,0.08)] aspect-[16/10] sm:aspect-[16/9]">
            <Image
              src={photoImagePaths[3]}
              alt="Georges and Christella laughing together"
              fill
              className={`no-image-save object-cover ${photoImagePaths[3] === "/4R4A4353.jpg" ? "object-center" : ""}`}
              sizes="(min-width: 1024px) 832px, 100vw"
              unoptimized
              draggable={false}
              onContextMenu={(event) => event.preventDefault()}
              onDragStart={(event) => event.preventDefault()}
            />
          </figure>

          <p className="font-display mx-auto mb-5 mt-10 w-full max-w-prose text-lg leading-8 sm:text-xl text-center">{t.closingMessage}</p>

          <p className="font-display mx-auto my-5 w-full max-w-prose text-lg leading-8 sm:text-xl text-center">
            {t.maxPeoplePerInvitation}
          </p>

          <Suspense fallback={<div className="rounded-3xl border border-[var(--border-muted)] bg-[var(--surface-soft)] p-7 text-sm">Loading RSVP form...</div>}>
            <RsvpForm locale={locale} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
