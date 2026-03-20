import Image from "next/image";
import { LanguageToggle } from "@/components/LanguageToggle";
import { PageFlowNav } from "@/components/PageFlowNav";
import { SiteShell } from "@/components/SiteShell";
import { getLocale, getWeddingCopy } from "@/lib/weddingCopy";

const bottomImagePaths = ["/4R4A4328.jpg", "/4R4A4319.jpg"];
export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  const locale = getLocale(params.lang ?? null);
  const t = getWeddingCopy(locale);

  return (
    <SiteShell locale={locale}>
      <main className="relative min-h-screen overflow-hidden bg-white px-5 py-5 sm:px-8">
        <div className="relative mx-auto w-full max-w-3xl">
          <section className="rounded-3xl">
            <LanguageToggle locale={locale} />

            <div className="mt-6 space-y-2">
              <h1 className="font-display text-xl leading-tight sm:text-4xl">{t.scheduleTitle}</h1>
              <p className="text-sm font-semibold tracking-[0.08em] text-[#5c5358]">{t.dateLabel}</p>
            </div>


            <figure className="relative mt-5 aspect-[25/24] overflow-hidden bg-[var(--surface-soft)] shadow-[0_10px_30px_rgba(51,44,48,0.08)] sm:aspect-[4/3]">
              <Image
                src="/4R4A4298.jpg"
                alt={t.heroPhotoAlts[0] ?? "Couple hero photo"}
                fill
                className="no-image-save object-cover object-[center_26%] sm:object-[center_22%]"
                sizes="(min-width: 1024px) 832px, 100vw"
                unoptimized
                draggable={false}
                priority
              />
            </figure>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <article className="flex h-full flex-col gap-3 rounded-2xl border border-[var(--border-muted)] bg-white p-4 shadow-[0_8px_24px_rgba(51,44,48,0.06)] sm:p-5">
                <h2 className="font-display text-2xl leading-tight sm:text-[1.7rem]">{t.ceremonyTitle}</h2>
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#5c5358] sm:text-sm">
                  {t.ceremonyTime}
                </p>
                <p className="text-[15px] leading-7">{t.ceremonyVenue}</p>
                <p className="text-[15px] leading-7 text-[#5c5358]">1847 Boul. Gouin E, Montréal, QC H2C 1C8</p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=1847+Boul.+Gouin+E%2C+Montr%C3%A9al%2C+QC+H2C+1C8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 sm:mt-auto inline-flex items-center justify-center self-start rounded-xl border border-[#332c30] bg-[#332c30] px-4 py-1 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#332c30]/40 focus-visible:ring-offset-2"
                >
                  {t.openMap}
                </a>
              </article>

              <article className="flex h-full flex-col gap-3 rounded-2xl border border-[var(--border-muted)] bg-white p-4 shadow-[0_8px_24px_rgba(51,44,48,0.06)] sm:p-5">
                <h2 className="font-display text-2xl leading-tight sm:text-[1.7rem]">{t.receptionTitle}</h2>
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#5c5358] sm:text-sm">
                  {t.receptionTime}
                </p>
                <p className="text-[15px] leading-7">{t.receptionVenue}</p>
                <p className="text-[15px] leading-7 text-[#5c5358]">
                  7550 Boulevard Henri-Bourassa E, Anjou, QC H1J 2K9
                </p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=7550+Boulevard+Henri-Bourassa+E%2C+Anjou%2C+QC+H1J+2K9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 sm:mt-auto inline-flex items-center justify-center self-start rounded-xl border border-[#332c30] bg-[#332c30] px-4 py-1 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#332c30]/40 focus-visible:ring-offset-2"
                >
                  {t.openMap}
                </a>
              </article>
            </div>
          </section>

          {/* <div className="mt-5 grid w-full grid-cols-2 gap-3">
            {bottomImagePaths.map((src, index) => (
              <figure
                key={`${src}-${index}`}
                className="relative aspect-[9/10] overflow-hidden bg-[var(--surface-soft)] shadow-[0_10px_30px_rgba(51,44,48,0.08)] sm:aspect-[4/4]"
              >
                <Image
                  src={src}
                  alt={t.heroPhotoAlts[index + 1] ?? `Couple photo ${index + 2}`}
                  fill
                  className={`no-image-save object-cover ${src === "/4R4A4328.jpg" ? "object-[center_3%] sm:object-[center_12%] scale-[1.12]" : ""}`}
                  sizes="(min-width: 1024px) 400px, 50vw"
                  unoptimized
                  draggable={false}
                />
              </figure>
            ))}
          </div> */}

          <div className="mt-12 sm:mt-0">
            <PageFlowNav
              locale={locale}
              previous={{
                href: "/",
                label: t.backToWelcome,
              }}
              next={{
                href: "/rsvp",
                label: t.nextToRsvp,
              }}
            />
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
