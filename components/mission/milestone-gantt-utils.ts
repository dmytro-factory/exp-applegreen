import type { MissionMilestone, MissionPhase, MissionPhaseDetail } from "@/app/(marketing)/mission/data";
import { brand } from "@/lib/brand";
import { missionPalette } from "@/lib/mission-palette";

const MINUTE_MS = 60_000;

export type GanttPhase = MissionPhase | "ORCHESTRATOR";

export const MISSION_PHASE_COLORS: Record<GanttPhase, string> = {
  WORKER: brand.colors.primary,
  SCRUTINY: missionPalette.scrutiny,
  "USER-TESTING": missionPalette.userTesting,
  ORCHESTRATOR: missionPalette.orchestrator,
};

export const MISSION_PHASE_LABELS: Record<GanttPhase, string> = {
  WORKER: "Worker",
  SCRUTINY: "Scrutiny Validator",
  "USER-TESTING": "User-testing Validator",
  ORCHESTRATOR: "Orchestrator",
};

export type MilestoneGanttPhase = MissionPhaseDetail & {
  startOffsetMinutes: number;
};

export type OrchestratorSegment = {
  phase: "ORCHESTRATOR";
  startOffsetMinutes: number;
  durationMinutes: number;
  pushbackCount: 0;
};

export type MilestoneGanttDatum = Omit<MissionMilestone, "phases"> & {
  startOffsetMinutes: number;
  phases: MilestoneGanttPhase[];
  orchestratorSegments: OrchestratorSegment[];
};

export type MilestoneGanttModel = {
  rows: MilestoneGanttDatum[];
  timelineStartMs: number;
  timelineEndMs: number;
  totalDurationMinutes: number;
};

function buildOrchestratorSegments(
  phases: MilestoneGanttPhase[],
): OrchestratorSegment[] {
  if (phases.length < 2) return [];

  const sorted = [...phases].sort(
    (a, b) => a.startOffsetMinutes - b.startOffsetMinutes,
  );
  const segments: OrchestratorSegment[] = [];

  for (let i = 0; i < sorted.length - 1; i++) {
    const currentEnd = sorted[i].startOffsetMinutes + sorted[i].durationMinutes;
    const nextStart = sorted[i + 1].startOffsetMinutes;
    const gap = nextStart - currentEnd;

    if (gap > 0.5) {
      segments.push({
        phase: "ORCHESTRATOR",
        startOffsetMinutes: currentEnd,
        durationMinutes: Math.round(gap * 10) / 10,
        pushbackCount: 0,
      });
    }
  }

  return segments;
}

export function buildMilestoneGanttModel(milestones: MissionMilestone[]): MilestoneGanttModel {
  if (milestones.length === 0) {
    const now = Date.now();

    return {
      rows: [],
      timelineStartMs: now,
      timelineEndMs: now,
      totalDurationMinutes: 0,
    };
  }

  const timelineStartMs = Math.min(
    ...milestones.map((milestone) => Math.min(...milestone.phases.map((phase) => Date.parse(phase.start)))),
  );
  const timelineEndMs = Math.max(
    ...milestones.map((milestone) => Math.max(...milestone.phases.map((phase) => Date.parse(phase.end)))),
  );
  const totalDurationMinutes = Math.max(1, (timelineEndMs - timelineStartMs) / MINUTE_MS);
  const rows = [...milestones]
    .sort((left, right) => Date.parse(left.start) - Date.parse(right.start))
    .map((milestone) => {
      const phases = milestone.phases.map((phase) => ({
        ...phase,
        startOffsetMinutes: (Date.parse(phase.start) - timelineStartMs) / MINUTE_MS,
      }));

      return {
        ...milestone,
        startOffsetMinutes: (Date.parse(milestone.start) - timelineStartMs) / MINUTE_MS,
        phases,
        orchestratorSegments: buildOrchestratorSegments(phases),
      };
    });

  return {
    rows,
    timelineStartMs,
    timelineEndMs,
    totalDurationMinutes,
  };
}

export function buildMissionTickOffsets(totalDurationMinutes: number, tickCount = 5): number[] {
  const safeTickCount = Math.max(tickCount, 3);
  const maxValue = Math.max(totalDurationMinutes, 1);
  const step = maxValue / (safeTickCount - 1);
  const ticks = Array.from({ length: safeTickCount }, (_, index) =>
    Number((index * step).toFixed(2)),
  );

  ticks[0] = 0;
  ticks[ticks.length - 1] = Number(maxValue.toFixed(2));

  return ticks;
}

export function formatMissionTickLabel(timelineStartMs: number, offsetMinutes: number): string {
  const tickDate = new Date(timelineStartMs + offsetMinutes * MINUTE_MS);

  return new Intl.DateTimeFormat("en-IE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(tickDate);
}

export function formatMissionDateTime(isoDate: string): string {
  return new Intl.DateTimeFormat("en-IE", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(isoDate));
}
