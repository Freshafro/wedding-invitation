"use client";

import Image from "next/image";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Great_Vibes } from "next/font/google";
import { RsvpForm } from "@/components/RsvpForm";

type Locale = "en" | "fr";

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
});

const photoImagePaths = ["/food-optimized.jpg", "/netflix-optimized.jpg", "/youtube-optimized.jpg"];

export default function Home() {
  const [locale, setLocale] = useState<Locale>("fr");
  const [activeSlide, setActiveSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const copy = useMemo(
    () => ({
      en: {
        coupleNames: "Georges & Christella",
        heroKicker: "We are getting married",
        heroDate: "August 15, 2026",
        intro: "We would be so excited to celebrate with you. Please RSVP below and let us know your attendance details.",
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
        previousSlide: "Previous",
        nextSlide: "Next",
        photoSlides: ["Couple photo 1", "Couple photo 2", "Couple photo 3"],
      },
      fr: {
        coupleNames: "Georges & Christella",
        heroKicker: "Nous nous marions",
        heroDate: "15 août 2026",
        intro: "Nous saurions ravis de célébrer ce moment avec vous. Merci de confirmer votre présence ci-dessous.",
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
        previousSlide: "Précédent",
        nextSlide: "Suivant",
        photoSlides: ["Photo du couple 1", "Photo du couple 2", "Photo du couple 3"],
      },
    }),
    []
  );

  const t = copy[locale];
  const totalSlides = photoImagePaths.length;

  useEffect(() => {
    if (activeSlide >= totalSlides) {
      setActiveSlide(0);
    }
  }, [activeSlide, totalSlides]);

  useEffect(() => {
    if (totalSlides <= 1) return;

    const intervalId = window.setInterval(() => {
      setActiveSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, [totalSlides]);

  const showPreviousSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const showNextSlide = () => {
    setActiveSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;

    const touchEndX = event.changedTouches[0]?.clientX;
    if (typeof touchEndX !== "number") {
      touchStartX.current = null;
      return;
    }

    const swipeDistance = touchEndX - touchStartX.current;
    const swipeThreshold = 40;

    if (swipeDistance > swipeThreshold) {
      showPreviousSlide();
    } else if (swipeDistance < -swipeThreshold) {
      showNextSlide();
    }

    touchStartX.current = null;
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-white px-5 py-10 sm:px-8">
      <div className="relative mx-auto w-full max-w-3xl space-y-10">
        <section className="space-y-10">
          <div className="flex justify-end">
            <div className="inline-flex items-center gap-1 rounded-full border border-[var(--border-muted)] bg-[var(--surface-soft)] p-1 text-xs font-semibold uppercase tracking-[0.12em]">
              <button
                type="button"
                onClick={() => setLocale("en")}
                className={`rounded-full px-4 py-2 transition ${
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
                className={`rounded-full px-4 py-2 transition ${
                  locale === "fr"
                    ? "bg-[#332c30] text-white"
                    : "text-[#332c30] hover:bg-[var(--surface-warm)]/70"
                }`}
              >
                FR
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em]">{t.heroKicker}</p>
            <h1 className={`${greatVibes.className} text-center text-5xl leading-tight font-normal sm:text-6xl`}>
              {t.coupleNames}
            </h1>
          </div>

          <div className="flex items-center gap-4" aria-hidden>
            <span className="h-px flex-1 border-t border-[var(--border-muted)]" />
            <span className="rounded-full border border-[var(--border-muted)] bg-[var(--surface-soft)] px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
              {t.heroDate}
            </span>
            <span className="h-px flex-1 border-t border-[var(--border-muted)]" />
          </div>

          <p className="font-display text-lg leading-8 sm:text-xl text-center">{t.announcement}</p>

          <div className="space-y-4">
            <div
              className="relative mx-auto aspect-square w-full max-w-xl overflow-hidden rounded-2xl border border-dashed border-[var(--border-muted)] bg-[var(--surface-soft)]"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex h-full transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
              >
                {photoImagePaths.map((src, index) => (
                  <div
                    key={index}
                    className="relative h-full w-full shrink-0"
                  >
                    <Image
                      src={src}
                      alt={t.photoSlides[index] ?? `Slide ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 768px, 100vw"
                      priority={index === 0}
                    />
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={showPreviousSlide}
                aria-label={t.previousSlide}
                className="absolute inset-y-0 left-0 hidden w-1/4 cursor-pointer bg-gradient-to-r from-black/15 to-transparent opacity-0 transition hover:opacity-100 focus:opacity-100 focus:outline-none md:block"
              >
                <span className="sr-only">{t.previousSlide}</span>
              </button>
              <button
                type="button"
                onClick={showNextSlide}
                aria-label={t.nextSlide}
                className="absolute inset-y-0 right-0 hidden w-1/4 cursor-pointer bg-gradient-to-l from-black/15 to-transparent opacity-0 transition hover:opacity-100 focus:opacity-100 focus:outline-none md:block"
              >
                <span className="sr-only">{t.nextSlide}</span>
              </button>
            </div>

            <div className="flex justify-center gap-2">
              {photoImagePaths.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    activeSlide === index ? "bg-[#332c30]" : "bg-[var(--border-muted)]"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[var(--border-muted)] bg-[var(--surface-soft)] p-7">
            <h2 className="font-display text-2xl sm:text-3xl">{t.scheduleTitle}</h2>
            <p className="mt-2">{t.dateLabel}</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <article className="rounded-2xl border border-[var(--border-muted)] bg-white p-5">
                <h3 className="font-display text-xl sm:text-2xl">{t.ceremonyTitle}</h3>
                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em]">{t.ceremonyTime}</p>
                <p className="mt-2">{t.ceremonyVenue}</p>
                <p className="mt-3">1847 Boul. Gouin E, Montreal, QC H2C 1C8</p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=1847+Boul.+Gouin+E%2C+Montreal%2C+QC+H2C+1C8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm font-semibold underline underline-offset-4"
                >
                  {t.openMap}
                </a>
              </article>

              <article className="rounded-2xl border border-[var(--border-muted)] bg-white p-5">
                <h3 className="font-display text-xl sm:text-2xl">{t.receptionTitle}</h3>
                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em]">{t.receptionTime}</p>
                <p className="mt-2">{t.receptionVenue}</p>
                <p className="mt-3">7550 Boulevard Henri-Bourassa E, QC H1J 2K9</p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=7550+Boulevard+Henri-Bourassa+E"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm font-semibold underline underline-offset-4"
                >
                  {t.openMap}
                </a>
              </article>
            </div>
          </div>
        </section>

        <p className="font-display mx-auto w-full max-w-prose text-lg leading-8 sm:text-xl text-center">{t.intro}</p>
        
        <Suspense fallback={<div className="rounded-3xl border border-[var(--border-muted)] bg-[var(--surface-soft)] p-7 text-sm">Loading RSVP form...</div>}>
          <RsvpForm locale={locale} />
        </Suspense>
      </div>
    </main>
  );
}
