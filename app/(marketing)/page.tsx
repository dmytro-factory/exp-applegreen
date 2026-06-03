import { brand } from "@/lib/brand";
import { heroKpis } from "@/lib/marketing/page-map";
import {
  livePrototypeConfig,
  problemComparisonColumns,
  problemComparisonFeatures,
  visionBodyCopy,
  visionMockups,
} from "@/lib/marketing/problem-vision-content";

const sectionClassName =
  "mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-16 md:min-h-[65vh] md:py-20";

export default function MarketingPage() {
  return (
    <>
      <section id="hero" className={sectionClassName}>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Applegreen Rewards 2.0
            </p>
            <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
              Applegreen Rewards 2.0 for every road, every stop, one wallet.
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
              A loyalty-first experience for drivers and families across the Applegreen network.
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
                href="#try-it-now"
                className="inline-flex w-fit items-center justify-center rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ outlineColor: brand.colors.primary }}
              >
                Jump to try it now
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

      <section id="problem" className={`${sectionClassName} border-t`}>
        <h2 className="font-heading text-3xl font-semibold tracking-tight">Problem</h2>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Applegreen customers are comparing us to Shell Go+ features they already expect at every stop.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {problemComparisonColumns.map((column) => (
            <article key={column.key} className="rounded-2xl border bg-card p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {column.subtitle}
              </p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">{column.label}</h3>
              <ul className="mt-6 space-y-4">
                {problemComparisonFeatures.map((feature) => {
                  const isAvailable =
                    column.key === "applegreen"
                      ? feature.availability.applegreen
                      : feature.availability.shellGoPlus;

                  return (
                    <li key={feature.title} className="flex items-start gap-3">
                      <span
                        aria-hidden
                        className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-semibold"
                        style={{
                          borderColor: isAvailable ? brand.colors.primary : "rgb(209 213 219)",
                          backgroundColor: isAvailable ? brand.colors.primary : "transparent",
                          color: isAvailable ? brand.colors.white : "rgb(107 114 128)",
                        }}
                      >
                        {isAvailable ? "✓" : "–"}
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-foreground">{feature.title}</span>
                        <span className="text-sm text-muted-foreground">{feature.description}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="vision" className={`${sectionClassName} border-t`}>
        <h2 className="font-heading text-3xl font-semibold tracking-tight">Vision</h2>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          {visionBodyCopy}
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {visionMockups.map((mockup) => (
            <article key={mockup.src} className="mx-auto w-full max-w-[280px] rounded-[2rem] border bg-white p-2 shadow-lg">
              <div className="overflow-hidden rounded-[1.65rem] border border-border bg-zinc-100">
                <img
                  src={mockup.src}
                  alt={mockup.alt}
                  width={mockup.width}
                  height={mockup.height}
                  loading="lazy"
                  className="h-auto w-full"
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="try-it-now" className={`${sectionClassName} border-t`}>
        <h2 className="font-heading text-3xl font-semibold tracking-tight">Try it now</h2>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Open the prototype, explore the flows, and preview the Wallet pass experience in a guided demo.
        </p>
      </section>

      <section id="live-prototype" className={`${sectionClassName} border-t`}>
        <h2 className="font-heading text-3xl font-semibold tracking-tight">Live prototype</h2>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Open the real app shell below or launch it in a full tab to walk the reward journey end-to-end.
        </p>
        <div className="mt-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="space-y-4">
            <p className="text-sm leading-6 text-muted-foreground">
              Inside the prototype you can preview the mobile-first loyalty surface and the core Applegreen rewards
              interactions.
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
                title="Applegreen Rewards live prototype"
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="mission-narrative" className={`${sectionClassName} border-t`}>
        <h2 className="font-heading text-3xl font-semibold tracking-tight">Mission narrative</h2>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Follow the execution story from idea to delivery, including milestones, validators, and outcomes.
        </p>
      </section>

      <section
        id="tech-stack"
        className={`${sectionClassName} border-y`}
        style={{ minHeight: "80vh" }}
      >
        <h2 className="font-heading text-3xl font-semibold tracking-tight">Tech stack</h2>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Built with Next.js, Tailwind CSS, and a reusable Applegreen brand system designed for rapid iteration.
        </p>
      </section>
    </>
  );
}
