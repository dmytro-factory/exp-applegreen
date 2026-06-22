import Image from "next/image";
import { brand } from "@/lib/brand";
import { heroKpis } from "@/lib/marketing/page-map";
import {
  appStoreInfo,
  appTodayThemes,
  driverQuotes,
  explainerIntro,
  figmaShowcase,
  livePrototypeConfig,
  loyaltyAdditions,
  loyaltyShots,
  rebuildSteps,
  walletCardCta,
} from "@/lib/marketing/explainer-content";

const sectionClassName =
  "mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-16 md:min-h-[65vh] md:py-20";

export default function MarketingPage() {
  return (
    <>
      <section id="hero" className={sectionClassName}>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Applegreen Fast Charge
            </p>
            <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
              Your charging app, reverse-engineered, back in your hands, and ready to reward.
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
              {explainerIntro}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={livePrototypeConfig.ctaHref}
                className="inline-flex w-fit items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ backgroundColor: brand.colors.primary, outlineColor: brand.colors.primary }}
              >
                {livePrototypeConfig.ctaLabel}
              </a>
              <a
                href="#control"
                className="inline-flex w-fit items-center justify-center rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ outlineColor: brand.colors.primary }}
              >
                See how it was rebuilt
              </a>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {heroKpis.map((kpi) => (
              <article
                key={kpi.label}
                className="rounded-2xl border border-border bg-card p-4 text-center shadow-sm"
                style={{ borderTopColor: brand.colors.primary, borderTopWidth: "4px" }}
              >
                <p className="text-3xl font-semibold leading-none text-foreground md:text-4xl">{kpi.value}</p>
                <p className="mt-2 text-xs font-medium uppercase tracking-wide text-muted-foreground md:text-sm">
                  {kpi.label}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="today" className={`${sectionClassName} border-t`}>
        <h2 className="font-heading text-3xl font-semibold tracking-tight">The app today</h2>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          The Fast Charge hardware delivers, but the app is holding the experience back. Drivers love the chargers and
          tell a consistent story about where the journey gets stuck.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <div
            className="rounded-2xl border bg-card px-5 py-4 shadow-sm"
            style={{ borderLeftColor: brand.colors.primary, borderLeftWidth: "4px" }}
          >
            <p className="text-3xl font-semibold leading-none text-foreground">
              {appStoreInfo.rating.toFixed(1)}
              <span className="text-amber-500"> ★</span>
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              App Store, {appStoreInfo.ratingCount} ratings
            </p>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            That gap between great chargers and a frustrating app is exactly the opportunity, and the easiest win to
            put right.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {appTodayThemes.map((theme) => (
            <article key={theme.title} className="rounded-2xl border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">{theme.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{theme.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {driverQuotes.map((item) => (
            <blockquote
              key={item.quote}
              className="rounded-2xl border bg-muted/40 p-5 text-sm text-foreground shadow-sm"
            >
              <p className="leading-6">&ldquo;{item.quote}&rdquo;</p>
              <footer className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {item.source}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section id="control" className={`${sectionClassName} border-t`}>
        <h2 className="font-heading text-3xl font-semibold tracking-tight">In your control</h2>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          We took the live app from the App Store, rebuilt every flow, and brought it into tools your team owns. The
          full screen set now lives in an editable Figma file and a deployable codebase.
        </p>

        <figure className="mt-10 overflow-hidden rounded-2xl border bg-card shadow-sm">
          <Image
            src={figmaShowcase.src}
            alt={figmaShowcase.alt}
            width={figmaShowcase.width}
            height={figmaShowcase.height}
            className="h-auto w-full"
          />
          <figcaption className="border-t px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {figmaShowcase.fileLabel}
          </figcaption>
        </figure>

        <ol className="mt-10 grid gap-4 md:grid-cols-5">
          {rebuildSteps.map((item) => (
            <li key={item.step} className="rounded-2xl border bg-card p-5 shadow-sm">
              <span
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white"
                style={{ backgroundColor: brand.colors.primary }}
              >
                {item.step}
              </span>
              <h3 className="mt-3 text-sm font-semibold tracking-tight text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="loyalty" className={`${sectionClassName} border-t`}>
        <h2 className="font-heading text-3xl font-semibold tracking-tight">The loyalty layer</h2>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          With the charging journey rebuilt, we added the piece that was missing: a reason for drivers to come back.
          Points, tiers and rewards sit on top of flows that already work.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-start">
          <div className="grid gap-4 sm:grid-cols-2">
            {loyaltyAdditions.map((item) => (
              <article key={item.title} className="rounded-2xl border bg-card p-5 shadow-sm">
                <h3 className="text-sm font-semibold tracking-tight text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </article>
            ))}
            <a
              href={walletCardCta.href}
              className="sm:col-span-2 inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ backgroundColor: brand.colors.dark, outlineColor: brand.colors.primary }}
            >
              {walletCardCta.label}
            </a>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {loyaltyShots.map((shot) => (
              <figure key={shot.src} className="text-center">
                <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                  <Image src={shot.src} alt={shot.alt} width={760} height={639} className="h-auto w-full" />
                </div>
                <figcaption className="mt-2 text-xs font-medium text-muted-foreground">{shot.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="live-prototype" className={`${sectionClassName} border-t`}>
        <h2 className="font-heading text-3xl font-semibold tracking-tight">Live demo</h2>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Open the rebuilt app below or launch it in a full tab to walk the charging and loyalty journey end-to-end,
          running on real station data.
        </p>
        <div className="mt-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="space-y-4">
            <p className="text-sm leading-6 text-muted-foreground">
              Find a charger, start a session, watch the points land, and redeem a reward, the same flows your drivers
              would use day to day.
            </p>
            <a
              href={livePrototypeConfig.ctaHref}
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ backgroundColor: brand.colors.primary, outlineColor: brand.colors.primary }}
            >
              {livePrototypeConfig.ctaLabel}
            </a>
          </div>
          <div className="mx-auto w-full max-w-[360px] rounded-[2.25rem] border border-border bg-zinc-900 p-2 shadow-xl">
            <div className="aspect-[1/2.1] overflow-hidden rounded-[1.7rem] border border-zinc-700 bg-white">
              <iframe
                src={livePrototypeConfig.iframeSrc}
                title="Applegreen Fast Charge live demo"
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
