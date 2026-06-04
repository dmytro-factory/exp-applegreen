import { TechStackSection } from "@/components/marketing/tech-stack-section";
import { MilestoneGantt } from "@/components/mission/milestone-gantt";
import {
  deliverables,
  milestones,
  missionExecutionNotes,
  orchestratorGoal,
  originalUserPrompt,
  pushbackHighlights,
} from "./data";

const sectionClassName =
  "mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-10 md:py-12";

function formatDuration(durationMinutes: number) {
  if (durationMinutes >= 60) {
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    if (minutes === 0) {
      return `${hours} ${hours === 1 ? "hour" : "hours"}`;
    }

    return `${hours}h ${minutes}m`;
  }

  return `${durationMinutes} minutes`;
}

export default function MissionNarrativePage() {
  return (
    <div className="pb-12">
      <section id="input" className={sectionClassName}>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Mission narrative
        </p>
        <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          Applegreen Rewards 2.0 execution story
        </h1>
        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Input</h2>
        <blockquote className="mt-4 rounded-2xl border border-border bg-card p-5 text-sm leading-7 text-foreground md:text-base">
          {originalUserPrompt}
        </blockquote>
      </section>

      <section id="orchestrator-goal" className={`${sectionClassName} border-t`}>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Orchestrator goal</h2>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-muted-foreground md:text-base">
          {orchestratorGoal}
        </p>
      </section>

      <section id="gantt" className={`${sectionClassName} border-t`}>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Milestones gantt</h2>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-muted-foreground md:text-base">
          Timeline view of worker, scrutiny, and user-testing phases across the mission.
        </p>
        <div className="mt-6">
          <MilestoneGantt milestones={milestones} />
        </div>
      </section>

      <section id="milestone-breakdown" className={`${sectionClassName} border-t`}>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Milestone breakdown</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {milestones.map((milestone) => (
            <article key={milestone.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground">{milestone.title}</h3>
              <p className="mt-1 text-sm font-medium text-muted-foreground">
                Duration: {formatDuration(milestone.durationMinutes)}
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{milestone.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="sealed-milestones" className={`${sectionClassName} border-t`}>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Sealed milestones</h2>
        <ul className="mt-4 space-y-3">
          {pushbackHighlights.map((highlight) => (
            <li key={highlight.milestoneId} className="rounded-xl border border-border bg-card px-4 py-3 text-sm">
              <span className="font-semibold text-foreground">{highlight.copy}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="execution-notes" className={`${sectionClassName} border-t`}>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Execution notes</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
          {missionExecutionNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>

      <section id="tech-stack">
        <TechStackSection className={sectionClassName} />
      </section>

      <section id="deliverables" className={`${sectionClassName} border-y`}>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Deliverables</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {deliverables.map((deliverable) => (
            <article key={deliverable.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h3 className="text-base font-semibold text-foreground">
                <a
                  href={deliverable.href}
                  className="rounded-sm underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary)]"
                  target="_blank"
                  rel="noreferrer"
                >
                  {deliverable.label}
                </a>
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{deliverable.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="phase-two" className={`${sectionClassName} border-t`}>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Phase Two</h2>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-muted-foreground md:text-base">
          Items that need to go through before a full production rollout.
        </p>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          <li className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="text-base font-semibold text-foreground">Apple Pass Type ID</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Register an official Pass Type ID with Apple and switch from demo .pkpass files to real Apple Wallet passes that update live points balances via push notifications.
            </p>
          </li>
          <li className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="text-base font-semibold text-foreground">User database</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Move from localStorage mock profiles to a real backend database for member accounts, transaction history, and points reconciliation.
            </p>
          </li>
          <li className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="text-base font-semibold text-foreground">POS integration</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Wire the loyalty flows into actual points-of-sale: coffee purchases, fuel payments, and in-store transactions so points are earned and redeemed in real time.
            </p>
          </li>
          <li className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="text-base font-semibold text-foreground">Polish UX</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Run a dedicated Figma pass over the PWA and marketing site for micro-interactions, accessibility, and iOS-native feel before App Store review.
            </p>
          </li>
          <li className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="text-base font-semibold text-foreground">Production infrastructure</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Set up monitoring, rate limiting, and a proper Apple Developer account for production signing certificates and Wallet push services.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );
}
