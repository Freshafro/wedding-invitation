import Image from "next/image";
import { Great_Vibes } from "next/font/google";
import { LanguageToggle } from "@/components/LanguageToggle";
import { PageFlowNav } from "@/components/PageFlowNav";
import { SiteShell } from "@/components/SiteShell";
import { getLocale, getWeddingCopy } from "@/lib/weddingCopy";

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
});

const photoImagePaths = ["/4R4A4423.jpg", "/4R4A4249.jpg", "/4R4A4319.jpg"];

export default async function Home({
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
          <section>
            <LanguageToggle locale={locale} />

            <div className="mt-1 space-y-5">
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

            <p className="my-10 font-display mx-auto w-full max-w-prose text-lg leading-8 sm:text-xl text-center">
              {t.announcement}
            </p>

            <div className="mt-10 space-y-4">
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
                    priority
                  />
                </figure>

                <div className="grid w-full grid-cols-2 gap-3">
                  {photoImagePaths.slice(1, 3).map((src, index) => (
                    <figure
                      key={`${src}-${index}`}
                      className="relative aspect-[9/10] overflow-hidden bg-[var(--surface-soft)] shadow-[0_10px_30px_rgba(51,44,48,0.08)] sm:aspect-[4/4]"
                    >
                      <Image
                        src={src}
                        alt={t.heroPhotoAlts[index + 1] ?? `Couple photo ${index + 2}`}
                        fill
                        className={`no-image-save object-cover  ${src === "/4R4A4249.jpg" ? "object-[center_11%] sm:object-[center_12%] scale-[1.12]" : ""}`}
                        sizes="(min-width: 1024px) 400px, 50vw"
                        unoptimized
                        draggable={false}
                      />
                    </figure>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="mt-12 sm:mt-0">
            <PageFlowNav
              locale={locale}
              next={{
                href: "/schedule",
                label: t.nextToSchedule,
              }}
            />
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
