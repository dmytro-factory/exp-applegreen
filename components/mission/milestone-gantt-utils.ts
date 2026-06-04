import type { MissionMilestone, MissionPhase } from "@/app/(marketing)/mission/data";
import { brand } from "@/lib/brand";
import { missionPalette } from "@/lib/mission-palette";

const MINUTE_MS = 60_000;

export const MISSION_PHASE_COLORS: Record<MissionPhase, string> = {
  WORKER: brand.colors.primary,
  SCRUTINY: missionPalette.scrutiny,
  "USER-TESTING": missionPalette.userTesting,
};

export const MISSION_PHASE_LABELS: Record<MissionPhase, string> = {
  WORKER: "WORKER",
  SCRUTINY: "SCRUTINY",
  "USER-TESTING": "USER-TESTING",
};

export type MilestoneGanttDatum = MissionMilestone & {
  startOffsetMinutes: number;
};

export type MilestoneGanttModel = {
  rows: MilestoneGanttDatum[];
  timelineStartMs: number;
  timelineEndMs: number;
  totalDurationMinutes: number;
};

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

  const timelineStartMs = Math.min(...milestones.map((milestone) => Date.parse(milestone.start)));
  const timelineEndMs = Math.max(...milestones.map((milestone) => Date.parse(milestone.end)));
  const totalDurationMinutes = Math.max(1, (timelineEndMs - timelineStartMs) / MINUTE_MS);
  const rows = [...milestones]
    .sort((left, right) => Date.parse(left.start) - Date.parse(right.start))
    .map((milestone) => ({
      ...milestone,
      startOffsetMinutes: (Date.parse(milestone.start) - timelineStartMs) / MINUTE_MS,
    }));

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
