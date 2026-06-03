import { brand } from "@/lib/brand";
import { heroKpis } from "@/lib/marketing/page-map";

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
            <a
              href="#try-it-now"
              className="mt-8 inline-flex w-fit items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ backgroundColor: brand.colors.primary, outlineColor: brand.colors.primary }}
            >
              Jump to try it now
            </a>
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
          Applegreen customers need one simple rewards flow that feels modern across stations, store purchases,
          and wallet experiences.
        </p>
      </section>

      <section id="vision" className={`${sectionClassName} border-t`}>
        <h2 className="font-heading text-3xl font-semibold tracking-tight">Vision</h2>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          A seamless loyalty journey with clear value, mobile-first interactions, and fewer steps between earning
          and redeeming.
        </p>
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
          The live prototype section anchors the embedded demo experience and links into the interactive app shell.
        </p>
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
