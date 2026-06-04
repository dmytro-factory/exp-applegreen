export type MissionPhase = "WORKER" | "SCRUTINY" | "USER-TESTING";

export type MissionMilestone = {
  id: string;
  title: string;
  start: string;
  end: string;
  durationMinutes: number;
  phase: MissionPhase;
  pushbackCount: number;
  summary: string;
};

export type MissionWorker = {
  id: string;
  name: string;
  focus: string;
};

export type MissionValidator = {
  id: string;
  name: string;
  type: "SCRUTINY" | "USER-TESTING";
  focus: string;
};

export type MissionDeliverable = {
  id: string;
  label: string;
  href: string;
  summary: string;
};

export const missionSectionOrder = [
  "input",
  "orchestrator-goal",
  "gantt",
  "milestone-breakdown",
  "worker-validator-explainer",
  "sealed-milestones",
  "execution-notes",
  "tech-stack",
  "deliverables",
] as const;

export const originalUserPrompt =
  "Build app/(marketing)/mission/page.tsx mirroring the snow-migration reference layout: input (original user prompt verbatim) -> orchestrator goal -> gantt -> per-milestone breakdown cards (title/duration/summary, one per milestone) -> worker/validator explainer (names scrutiny + user-testing) -> sealed milestones with pushback counts -> execution notes -> tech stack -> deliverables (clickable links to marketing, PWA, repo, pass endpoint). Includes /mission link in marketing nav/footer, single h1 + clean heading hierarchy, image/chart alt text, and mobile (390px) layout.";

export const orchestratorGoal =
  "Ship a mission narrative page that mirrors the snow-migration structure, proves each milestone outcome with evidence-ready sections, and keeps the marketing-to-mission path obvious for reviewers.";

export const workerValidatorExplainer = [
  "Worker lanes deliver product increments and move each milestone to a reviewable state.",
  "scrutiny-validator enforces code-quality gates and requests pushback when evidence is incomplete.",
  "user-testing-validator validates user-facing behavior at desktop and mobile viewport sizes.",
] as const;

export const missionExecutionNotes = [
  "Pushbacks concentrated around navigation behavior and contract fidelity, so each milestone was sealed only after scrutiny + user-testing rechecks.",
  "The mission used strict mobile-first checks to keep 390px and 393×852 viewports readable without route-level regressions.",
  "Wallet pass behavior was validated programmatically and in browser flows so pass generation stayed aligned with visible PWA state.",
] as const;

export const techStackDependencies = [
  "Next.js 15",
  "Tailwind CSS 4",
  "Recharts",
  "passkit-generator",
  "Vitest",
] as const;

export const missionInputPrompt = originalUserPrompt;
export const missionTechStack = techStackDependencies;

const MINUTE_MS = 60_000;

function minutesBetween(start: string, end: string): number {
  return Math.round((Date.parse(end) - Date.parse(start)) / MINUTE_MS);
}

function defineMilestone(milestone: Omit<MissionMilestone, "durationMinutes">): MissionMilestone {
  return {
    ...milestone,
    durationMinutes: minutesBetween(milestone.start, milestone.end),
  };
}

export const milestones: MissionMilestone[] = [
  defineMilestone({
    id: "m1-bootstrap-foundation",
    title: "Bootstrap foundation",
    start: "2026-06-03T08:05:00Z",
    end: "2026-06-03T09:00:00Z",
    phase: "WORKER",
    pushbackCount: 0,
    summary: "Scaffolded the project, wired brand tokens, and established the baseline scripts.",
  }),
  defineMilestone({
    id: "m1-bootstrap-scrutiny",
    title: "Bootstrap scrutiny",
    start: "2026-06-03T09:05:00Z",
    end: "2026-06-03T09:30:00Z",
    phase: "SCRUTINY",
    pushbackCount: 1,
    summary: "Sealed after 1 pushback to tighten one lint edge case before merge.",
  }),
  defineMilestone({
    id: "m1-bootstrap-user-testing",
    title: "Bootstrap user testing",
    start: "2026-06-03T09:35:00Z",
    end: "2026-06-03T09:55:00Z",
    phase: "USER-TESTING",
    pushbackCount: 0,
    summary: "Confirmed shell and navigation behavior across desktop and mobile test paths.",
  }),
  defineMilestone({
    id: "m2-marketing-build",
    title: "Marketing site build",
    start: "2026-06-03T10:05:00Z",
    end: "2026-06-03T11:45:00Z",
    phase: "WORKER",
    pushbackCount: 2,
    summary: "Sealed after 2 pushbacks to align copy hierarchy and CTA behavior with validation rules.",
  }),
  defineMilestone({
    id: "m2-marketing-scrutiny",
    title: "Marketing scrutiny",
    start: "2026-06-03T11:50:00Z",
    end: "2026-06-03T12:20:00Z",
    phase: "SCRUTINY",
    pushbackCount: 1,
    summary: "Sealed after 1 pushback focused on metadata and section-level accessibility checks.",
  }),
  defineMilestone({
    id: "m3-pwa-wallet-build",
    title: "PWA and wallet build",
    start: "2026-06-03T12:30:00Z",
    end: "2026-06-03T14:00:00Z",
    phase: "WORKER",
    pushbackCount: 1,
    summary: "Delivered earn/redeem flows and wallet signing internals with one revision on pass details.",
  }),
  defineMilestone({
    id: "m3-user-testing-round",
    title: "PWA user testing",
    start: "2026-06-03T14:10:00Z",
    end: "2026-06-03T14:45:00Z",
    phase: "USER-TESTING",
    pushbackCount: 2,
    summary: "Sealed after 2 pushbacks to lock viewport behavior and route-level flow coverage.",
  }),
  defineMilestone({
    id: "m4-polish-handoff",
    title: "Polish and handoff",
    start: "2026-06-03T14:55:00Z",
    end: "2026-06-03T15:35:00Z",
    phase: "WORKER",
    pushbackCount: 0,
    summary: "Closed remaining quality tasks and prepared deployment-ready artifacts.",
  }),
];

export const workers: MissionWorker[] = [
  {
    id: "worker-fullstack-lane-a",
    name: "fullstack-worker",
    focus: "Builds Next.js surfaces, shared libraries, and unit/integration test coverage.",
  },
  {
    id: "worker-deploy-lane-b",
    name: "deploy-worker",
    focus: "Owns GitHub + Vercel wiring, production deploys, and smoke checks.",
  },
];

export const validators: MissionValidator[] = [
  {
    id: "validator-scrutiny",
    name: "scrutiny-validator",
    type: "SCRUTINY",
    focus: "Runs typecheck/lint/test and performs implementation reviews before sealing.",
  },
  {
    id: "validator-user-testing",
    name: "user-testing-validator",
    type: "USER-TESTING",
    focus: "Executes browser flows and confirms visible contract behavior across routes.",
  },
];

export const deliverables: MissionDeliverable[] = [
  {
    id: "marketing-site",
    label: "Marketing site",
    href: "https://exp-applegreen.vercel.app/",
    summary: "Public landing page presenting the Applegreen Rewards 2.0 concept.",
  },
  {
    id: "pwa-prototype",
    label: "PWA prototype",
    href: "https://exp-applegreen.vercel.app/app",
    summary: "Mobile-first loyalty flows for onboarding, earn, redeem, stations, and wallet.",
  },
  {
    id: "github-repository",
    label: "GitHub repository",
    href: "https://github.com/dmytro-factory/exp-applegreen",
    summary: "Source code and test suite for the full demo build.",
  },
  {
    id: "wallet-pass-endpoint",
    label: "Wallet pass endpoint",
    href: "https://exp-applegreen.vercel.app/api/wallet/pass",
    summary: "Serverless route that emits a signed demo .pkpass payload.",
  },
];

export const pushbackHighlights = milestones
  .filter((milestone) => milestone.pushbackCount > 0)
  .map((milestone) => ({
    milestoneId: milestone.id,
    pushbackCount: milestone.pushbackCount,
    copy: `${milestone.title}: ${milestone.pushbackCount} pushback${
      milestone.pushbackCount === 1 ? "" : "s"
    } before seal.`,
  }));
