export type MissionPhase = "WORKER" | "SCRUTINY" | "USER-TESTING";

export type MissionPhaseDetail = {
  phase: MissionPhase;
  start: string;
  end: string;
  durationMinutes: number;
  pushbackCount: number;
};

export type MissionMilestone = {
  id: string;
  title: string;
  start: string;
  end: string;
  durationMinutes: number;
  phases: MissionPhaseDetail[];
  summary: string;
  pushbackCount: number;
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
  "sealed-milestones",
  "execution-notes",
  "tech-stack",
  "deliverables",
  "phase-two",
] as const;

export const originalUserPrompt =
  "Research applegreenstores.com to understand their services and retail footprint across Ireland and the UK. The goal is to build a loyalty application prototype, using Shell Go+ as a reference for what a petrol-station loyalty platform should feel like. The demo must be runnable locally on a MacBook (browser + iOS Simulator), produce a static marketing site about the mission with milestones and validator timeline, and ideally support real .pkpass cards stored in Apple Wallet on an iPhone — that is the North Star. Flag anything that is hard to achieve before committing to it. Everything should be styled in Apple Green's brand colours and visual identity.";

export const orchestratorGoal =
  "Ship a mission narrative page that mirrors the snow-migration structure, proves each milestone outcome with evidence-ready sections, and keeps the marketing-to-mission path obvious for reviewers.";

export const workerValidatorExplainer = [
  "Worker lanes deliver product increments and move each milestone to a reviewable state.",
  "scrutiny-validator enforces code-quality gates and requests pushback when evidence is incomplete.",
  "user-testing-validator validates user-facing behavior at desktop and mobile viewport sizes.",
] as const;

export const missionExecutionNotes = [
  "The timeline aggregates worker, scrutiny, and user-testing phases under each milestone, matching the snow-migration Gantt style.",
  "Validator pushback was concentrated in M3 PWA Loyalty user-testing, with 2 failed runs before the successful sealing pass.",
  "Session mapping for workers and validators comes directly from features.json workerSessionIds[] so each lane points at real mission sessions.",
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

function definePhase(phase: Omit<MissionPhaseDetail, "durationMinutes">): MissionPhaseDetail {
  return {
    ...phase,
    durationMinutes: minutesBetween(phase.start, phase.end),
  };
}

function defineMilestone(
  milestone: Omit<MissionMilestone, "durationMinutes" | "phases" | "pushbackCount"> & {
    phases: Omit<MissionPhaseDetail, "durationMinutes">[];
  },
): MissionMilestone {
  const phases = milestone.phases.map(definePhase);
  const start = phases.length > 0 ? phases[0].start : milestone.start;
  const end = phases.length > 0 ? phases[phases.length - 1].end : milestone.end;
  const pushbackCount = phases.reduce((sum, phase) => sum + phase.pushbackCount, 0);

  return {
    ...milestone,
    phases,
    start,
    end,
    durationMinutes: minutesBetween(start, end),
    pushbackCount,
  };
}

export const milestones: MissionMilestone[] = [
  defineMilestone({
    id: "m1",
    title: "M1 Bootstrap",
    start: "2026-06-03T15:16:54.099Z",
    end: "2026-06-03T15:37:56.970Z",
    summary:
      "Scaffolded Next.js app, configured Apple Green brand system, and performed first Vercel deploy. Sealed with no validator pushbacks.",
    phases: [
      {
        phase: "WORKER",
        start: "2026-06-03T15:16:54.099Z",
        end: "2026-06-03T15:26:09.501Z",
        pushbackCount: 0,
      },
      {
        phase: "SCRUTINY",
        start: "2026-06-03T15:31:54.337Z",
        end: "2026-06-03T15:31:54.337Z",
        pushbackCount: 0,
      },
      {
        phase: "USER-TESTING",
        start: "2026-06-03T15:37:56.970Z",
        end: "2026-06-03T15:37:56.970Z",
        pushbackCount: 0,
      },
    ],
  }),
  defineMilestone({
    id: "m2",
    title: "M2 Marketing",
    start: "2026-06-03T15:50:15.668Z",
    end: "2026-06-03T16:32:34.750Z",
    summary:
      "Built marketing landing page with hero, problem, vision, try-it-now and tech-stack sections. Sealed with no validator pushbacks.",
    phases: [
      {
        phase: "WORKER",
        start: "2026-06-03T15:50:15.668Z",
        end: "2026-06-03T16:16:28.551Z",
        pushbackCount: 0,
      },
      {
        phase: "SCRUTINY",
        start: "2026-06-03T16:22:08.086Z",
        end: "2026-06-03T16:22:08.086Z",
        pushbackCount: 0,
      },
      {
        phase: "USER-TESTING",
        start: "2026-06-03T16:32:34.750Z",
        end: "2026-06-03T16:32:34.750Z",
        pushbackCount: 0,
      },
    ],
  }),
  defineMilestone({
    id: "m3",
    title: "M3 PWA Loyalty",
    start: "2026-06-03T16:51:09.414Z",
    end: "2026-06-03T22:28:13.995Z",
    summary:
      "Built PWA loyalty flows — onboarding, home screen, earn, redeem, and clubs. User-testing required 2 pushbacks before seal.",
    phases: [
      {
        phase: "WORKER",
        start: "2026-06-03T16:51:09.414Z",
        end: "2026-06-03T20:16:31.537Z",
        pushbackCount: 0,
      },
      {
        phase: "SCRUTINY",
        start: "2026-06-03T21:47:52.098Z",
        end: "2026-06-03T21:47:52.098Z",
        pushbackCount: 0,
      },
      {
        phase: "USER-TESTING",
        start: "2026-06-03T22:24:18.069Z",
        end: "2026-06-03T22:28:13.995Z",
        pushbackCount: 2,
      },
    ],
  }),
  defineMilestone({
    id: "m4",
    title: "M4 Stations & Road Trip",
    start: "2026-06-03T22:28:41.375Z",
    end: "2026-06-03T23:25:16.422Z",
    summary:
      "Built station locator with real Ireland/UK data and road-trip planner with corridor routing. Sealed with no validator pushbacks.",
    phases: [
      {
        phase: "WORKER",
        start: "2026-06-03T22:28:41.375Z",
        end: "2026-06-03T23:00:13.706Z",
        pushbackCount: 0,
      },
      {
        phase: "SCRUTINY",
        start: "2026-06-03T23:05:38.479Z",
        end: "2026-06-03T23:05:38.479Z",
        pushbackCount: 0,
      },
      {
        phase: "USER-TESTING",
        start: "2026-06-03T23:07:06.189Z",
        end: "2026-06-03T23:25:16.422Z",
        pushbackCount: 0,
      },
    ],
  }),
  defineMilestone({
    id: "m5",
    title: "M5 Apple Wallet",
    start: "2026-06-03T23:27:23.065Z",
    end: "2026-06-04T00:29:13.682Z",
    summary:
      "Generated signing certificates, built wallet pass API, added CTAs and disclaimers, and configured production env. Sealed with no validator pushbacks.",
    phases: [
      {
        phase: "WORKER",
        start: "2026-06-03T23:27:23.065Z",
        end: "2026-06-04T00:10:08.750Z",
        pushbackCount: 0,
      },
      {
        phase: "SCRUTINY",
        start: "2026-06-04T00:12:14.627Z",
        end: "2026-06-04T00:16:51.187Z",
        pushbackCount: 0,
      },
      {
        phase: "USER-TESTING",
        start: "2026-06-04T00:20:28.658Z",
        end: "2026-06-04T00:29:13.682Z",
        pushbackCount: 0,
      },
    ],
  }),
  defineMilestone({
    id: "m6",
    title: "M6 Mission Narrative",
    start: "2026-06-04T00:35:46.140Z",
    end: "2026-06-04T01:08:05.119Z",
    summary:
      "Created mission narrative data model, built Gantt chart with Recharts, and added all sections and cards. Sealed with no validator pushbacks.",
    phases: [
      {
        phase: "WORKER",
        start: "2026-06-04T00:35:46.140Z",
        end: "2026-06-04T00:54:41.692Z",
        pushbackCount: 0,
      },
      {
        phase: "SCRUTINY",
        start: "2026-06-04T00:56:49.034Z",
        end: "2026-06-04T00:56:49.034Z",
        pushbackCount: 0,
      },
      {
        phase: "USER-TESTING",
        start: "2026-06-04T00:59:00.171Z",
        end: "2026-06-04T01:08:05.119Z",
        pushbackCount: 0,
      },
    ],
  }),
  defineMilestone({
    id: "m7",
    title: "M7 Polish & Runbook",
    start: "2026-06-04T01:10:47.943Z",
    end: "2026-06-04T02:09:14.670Z",
    summary:
      "Wrote README and demo runbook, applied final polish across marketing and PWA, and performed production deploy. Sealed with no validator pushbacks.",
    phases: [
      {
        phase: "WORKER",
        start: "2026-06-04T01:10:47.943Z",
        end: "2026-06-04T02:05:27.631Z",
        pushbackCount: 0,
      },
      {
        phase: "SCRUTINY",
        start: "2026-06-04T02:06:40.583Z",
        end: "2026-06-04T02:06:40.583Z",
        pushbackCount: 0,
      },
      {
        phase: "USER-TESTING",
        start: "2026-06-04T02:09:14.670Z",
        end: "2026-06-04T02:09:14.670Z",
        pushbackCount: 0,
      },
    ],
  }),
];

export const workers: MissionWorker[] = [
  {
    id: "f01-scaffold-and-brand-system",
    name: "fullstack-worker",
    focus: "Session IDs: 7b53d866-42c6-4d8a-bebc-181b4e4f46a8",
  },
  {
    id: "f02-github-repo-and-first-deploy",
    name: "deploy-worker",
    focus: "Session IDs: 91e64d2b-d063-4df5-a3be-55c1a25864f6",
  },
  {
    id: "f03-marketing-shell-and-hero",
    name: "fullstack-worker",
    focus: "Session IDs: eb622941-c013-409d-92ea-d1151f0e2be3",
  },
  {
    id: "f04-marketing-problem-and-vision-sections",
    name: "fullstack-worker",
    focus: "Session IDs: 0f818c32-c80a-4f03-9e6a-f1d0eb83c2d8",
  },
  {
    id: "f05-marketing-try-it-and-tech-stack-sections",
    name: "fullstack-worker",
    focus: "Session IDs: f6de74b6-a312-4d5d-adb2-685c99fd2943",
  },
  {
    id: "f06-pwa-shell-and-onboarding",
    name: "fullstack-worker",
    focus: "Session IDs: 823a102f-49d7-42ab-8468-6725737d6956",
  },
  {
    id: "f07-pwa-home-screen",
    name: "fullstack-worker",
    focus: "Session IDs: c928ee4e-b25a-4a99-a191-a69d0fdee13f",
  },
  {
    id: "f08-pwa-earn-flow",
    name: "fullstack-worker",
    focus: "Session IDs: bf10ab0c-a789-4ea3-843c-cea0db5f97ff",
  },
  {
    id: "f09-pwa-redeem-and-clubs",
    name: "fullstack-worker",
    focus: "Session IDs: ecb8ed7b-5f47-4f95-8409-5e17778f2c9e",
  },
  {
    id: "f10-station-locator",
    name: "fullstack-worker",
    focus: "Session IDs: 25b9cea0-f20d-4d80-a875-60760a17bd27",
  },
  {
    id: "f11-road-trip-planner",
    name: "fullstack-worker",
    focus: "Session IDs: d2a336db-0783-4cb9-827e-b89f3d918864",
  },
  {
    id: "f12-cert-generator-script",
    name: "fullstack-worker",
    focus: "Session IDs: e3d0f149-b399-4478-8cd6-e4031777ddc7",
  },
  {
    id: "f13-wallet-pass-api-and-internals",
    name: "fullstack-worker",
    focus: "Session IDs: fea0c232-2f24-41f9-9fd5-7449942dffdb",
  },
  {
    id: "f14-wallet-ctas-and-disclaimers",
    name: "fullstack-worker",
    focus: "Session IDs: 0f3ac05f-db3d-4b16-9fd5-74562ab8facc",
  },
  {
    id: "f15-wallet-production-env-and-redeploy",
    name: "deploy-worker",
    focus: "Session IDs: e13774da-5c65-484d-89e0-ff6d077b98f1, 4ba6cb3b-b1d4-4cad-8bb8-4dc584f8afee",
  },
  {
    id: "f16-narrative-data-and-gantt",
    name: "fullstack-worker",
    focus: "Session IDs: cf0d0de2-4b9f-4765-b5be-234ff0d8e2a6",
  },
  {
    id: "f17-narrative-sections-and-cards",
    name: "fullstack-worker",
    focus: "Session IDs: f49d0bc0-6fcb-49d4-9121-150a25a24fed, ef4d5d3a-efbb-401d-bc1e-0ca4ccaca2f6",
  },
  {
    id: "f18-readme-and-demo-runbook",
    name: "fullstack-worker",
    focus: "Session IDs: e51be2aa-50c2-40c0-b4d5-579798afbaa3",
  },
  {
    id: "f19-final-polish-and-production-deploy",
    name: "fullstack-worker",
    focus: "Session IDs: 5cab00c4-0fbf-408f-ab59-de07db98d463",
  },
];

export const validators: MissionValidator[] = [
  {
    id: "scrutiny-validator-m1-bootstrap",
    name: "scrutiny-validator",
    type: "SCRUTINY",
    focus: "Session IDs: 902d1f4e-8c81-44aa-894e-906dec9bdeba",
  },
  {
    id: "scrutiny-validator-m2-marketing",
    name: "scrutiny-validator",
    type: "SCRUTINY",
    focus: "Session IDs: 23d09b3a-e097-4ffa-8116-e91d05c29907",
  },
  {
    id: "scrutiny-validator-m3-pwa-loyalty",
    name: "scrutiny-validator",
    type: "SCRUTINY",
    focus: "Session IDs: ee7fc200-599c-4c94-b651-43dc3a0bfcad",
  },
  {
    id: "scrutiny-validator-m4-stations-and-roadtrip",
    name: "scrutiny-validator",
    type: "SCRUTINY",
    focus: "Session IDs: add0e018-77d2-4971-85c8-5211f23b5f87, 3418e350-73bc-4d66-9168-f992a970d362",
  },
  {
    id: "scrutiny-validator-m5-apple-wallet",
    name: "scrutiny-validator",
    type: "SCRUTINY",
    focus: "Session IDs: fb2cc885-8ffd-4fec-8f7c-579e0e1ae4a5",
  },
  {
    id: "scrutiny-validator-m6-mission-narrative",
    name: "scrutiny-validator",
    type: "SCRUTINY",
    focus: "Session IDs: a3cd6d52-0477-4db6-8ffb-3726cfe0654d",
  },
  {
    id: "scrutiny-validator-m7-polish-and-runbook",
    name: "scrutiny-validator",
    type: "SCRUTINY",
    focus: "Session IDs: f8967b59-5dcd-47a7-8a2d-3ecc977c4a4e, 3f05ca4f-cc7d-4f8c-b1ac-e32dee9b5752",
  },
  {
    id: "user-testing-validator-m1-bootstrap",
    name: "user-testing-validator",
    type: "USER-TESTING",
    focus: "Session IDs: 95bc9b16-91b5-4552-aef1-9e0083f560ab",
  },
  {
    id: "user-testing-validator-m2-marketing",
    name: "user-testing-validator",
    type: "USER-TESTING",
    focus: "Session IDs: 5f191fc3-0ec1-4b24-8930-c79e4dc76ac8",
  },
  {
    id: "user-testing-validator-m3-pwa-loyalty",
    name: "user-testing-validator",
    type: "USER-TESTING",
    focus: "Session IDs: 31332f64-9a3e-431d-ac2d-e58f96788515, 2158a308-f323-4a0c-910c-1ed84614401b",
  },
  {
    id: "user-testing-validator-m4-stations-and-roadtrip",
    name: "user-testing-validator",
    type: "USER-TESTING",
    focus: "Session IDs: b3b79648-d101-45dd-8602-b003006cadb0, f0662ffa-af94-40e9-a9a9-1abe74575dcb",
  },
  {
    id: "user-testing-validator-m5-apple-wallet",
    name: "user-testing-validator",
    type: "USER-TESTING",
    focus: "Session IDs: 41a47ff1-6e4e-4010-be63-34f73889c940",
  },
  {
    id: "user-testing-validator-m6-mission-narrative",
    name: "user-testing-validator",
    type: "USER-TESTING",
    focus: "Session IDs: 641db1e3-fe1d-4e5c-932f-ee9307806918",
  },
  {
    id: "user-testing-validator-m7-polish-and-runbook",
    name: "user-testing-validator",
    type: "USER-TESTING",
    focus: "Session IDs: fef02053-c305-4364-abd7-2ee448b46dae",
  },
];

export const deliverables: MissionDeliverable[] = [
  {
    id: "marketing-site",
    label: "Marketing site",
    href: "https://exp-applegreen.vercel.app",
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
    href: "https://exp-applegreen.vercel.app/api/wallet/pass?member=demo&points=750",
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
