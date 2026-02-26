"use client";

import { useMemo, useState } from "react";
import { RsvpForm } from "@/components/RsvpForm";

type Locale = "en" | "fr";

export default function Home() {
  const [locale, setLocale] = useState<Locale>("fr");

  const copy = useMemo(
    () => ({
      en: {
        coupleNames: "Georges and Christella",
        heroKicker: "We are getting married",
        intro: "We are so excited to celebrate with you. Please RSVP below and let us know your attendance details.",
        announcement: (
          <>
            With grateful hearts, the families of <strong>Samuel Simon Boum</strong> and{" "}
            <strong>Rosa Marie Ngo Um</strong>, together with <strong>Anastase Nzobonimpa</strong> and{" "}
            <strong>Josee Tuyisenge</strong>, request the honor of your presence at the wedding celebration of their
            children, <strong>Georges Anthony Boum</strong> and <strong>Christella Emerusenge</strong>, 
            on the <strong>15th of August, 2026</strong>.
          </>
        ),
        scheduleTitle: "Wedding Day Schedule",
        dateLabel: "Saturday, August 15, 2026",
        ceremonyTitle: "Wedding Ceremony",
        ceremonyTime: "1:30 PM - 2:30 PM",
        ceremonyVenue: "La Visitation-de-la-Bienheureuse-Vierge-Marie",
        receptionTitle: "Reception",
        receptionTime: "Starting 5:00 PM",
        receptionVenue: "Centre des congres et banquets Renaissance",
        openMap: "Open in Google Maps",
        photoPlaceholder1: "Photo Placeholder 1",
        photoPlaceholder2: "Photo Placeholder 2",
      },
      fr: {
        coupleNames: "Georges et Christella",
        heroKicker: "Nous nous marions",
        intro: "Nous sommes ravis de célébrer ce moment avec vous. Merci de confirmer votre présence ci-dessous.",
        announcement: (
          <>
            C&apos;est avec une immense joie que les familles de <strong>Samuel Simon Boum</strong> et{" "}
            <strong>Rosa Marie Ngo Um</strong>, ainsi qu&apos;<strong>Anastase Nzobonimpa</strong> et{" "}
            <strong>Josee Tuyisenge</strong>, ont l&apos;honneur de vous convier au mariage de leurs enfants,{" "}
            <strong>Georges Anthony Boum</strong> et <strong>Christella Emerusenge</strong>, qui sera célébré le 
            <strong>15 août 2026</strong>.
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
        photoPlaceholder1: "Espace photo 1",
        photoPlaceholder2: "Espace photo 2",
      },
    }),
    []
  );

  const t = copy[locale];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fefcf5] px-5 py-10 text-zinc-900 sm:px-8">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-amber-200/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 top-1/3 h-80 w-80 rounded-full bg-rose-200/30 blur-3xl" />

      <div className="relative mx-auto w-full max-w-3xl space-y-10">
        <section className="space-y-10">
          <div className="flex justify-end">
            <div className="inline-flex overflow-hidden rounded-full border border-amber-300 bg-white/80 text-xs font-semibold uppercase tracking-[0.12em]">
              <button
                type="button"
                onClick={() => setLocale("en")}
                className={`px-4 py-2 transition ${locale === "en" ? "bg-amber-700 text-white" : "text-amber-800 hover:bg-amber-50"}`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLocale("fr")}
                className={`px-4 py-2 transition ${locale === "fr" ? "bg-amber-700 text-white" : "text-amber-800 hover:bg-amber-50"}`}
              >
                FR
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">{t.heroKicker}</p>
            <h1 className="font-script text-center text-6xl leading-tight text-zinc-900 sm:text-7xl">{t.coupleNames}</h1>
            <p className="font-display max-w-prose text-lg leading-8 text-zinc-700 sm:text-xl">{t.intro}</p>
          </div>

          <div className="flex items-center gap-4" aria-hidden>
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />
            <span className="rounded-full border border-amber-300/80 bg-amber-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
              August 15, 2026
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />
          </div>

          <p className="font-display text-xl leading-9 text-zinc-700 sm:text-2xl">{t.announcement}</p>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-amber-300 bg-white/75 text-sm font-medium text-zinc-500 shadow-sm">
              {t.photoPlaceholder1}
            </div>
            <div className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-amber-300 bg-white/75 text-sm font-medium text-zinc-500 shadow-sm">
              {t.photoPlaceholder2}
            </div>
          </div>

          <div className="rounded-3xl border border-amber-200 bg-white/90 p-7 shadow-[0_14px_35px_rgba(113,63,18,0.12)]">
            <h2 className="font-display text-4xl text-zinc-900">{t.scheduleTitle}</h2>
            <p className="mt-2 text-zinc-700">{t.dateLabel}</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <article className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5">
                <h3 className="font-display text-3xl text-zinc-900">{t.ceremonyTitle}</h3>
                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-amber-700">{t.ceremonyTime}</p>
                <p className="mt-2 text-zinc-800">{t.ceremonyVenue}</p>
                <p className="mt-3 text-zinc-700">1847 Boul. Gouin E, Montreal, QC H2C 1C8</p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=1847+Boul.+Gouin+E%2C+Montreal%2C+QC+H2C+1C8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm font-semibold text-amber-800 underline decoration-amber-400 underline-offset-4 hover:text-amber-900"
                >
                  {t.openMap}
                </a>
              </article>

              <article className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5">
                <h3 className="font-display text-3xl text-zinc-900">{t.receptionTitle}</h3>
                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-amber-700">{t.receptionTime}</p>
                <p className="mt-2 text-zinc-800">{t.receptionVenue}</p>
                <p className="mt-3 text-zinc-700">7550 Boulevard Henri-Bourassa E, QC H1J 2K9</p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=7550+Boulevard+Henri-Bourassa+E"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm font-semibold text-amber-800 underline decoration-amber-400 underline-offset-4 hover:text-amber-900"
                >
                  {t.openMap}
                </a>
              </article>
            </div>
          </div>
        </section>
        <RsvpForm locale={locale} />
      </div>
    </main>
  );
}
