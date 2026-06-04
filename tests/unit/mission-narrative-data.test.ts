import { describe, expect, it } from "vitest";
import {
  deliverables,
  milestones,
  pushbackHighlights,
  validators,
  workers,
} from "../../app/(marketing)/mission/data";
import {
  MISSION_PHASE_COLORS,
  buildMilestoneGanttModel,
  buildMissionTickOffsets,
} from "../../components/mission/milestone-gantt-utils";
import { brand } from "../../lib/brand";
import { missionPalette } from "../../lib/mission-palette";

describe("mission narrative data contract", () => {
  it("exports milestones, workers, validators, and deliverables", () => {
    expect(milestones.length).toBeGreaterThanOrEqual(7);
    expect(workers.length).toBeGreaterThan(0);
    expect(validators.length).toBeGreaterThan(0);
    expect(deliverables.length).toBeGreaterThan(0);
  });

  it("keeps milestone duration and pushback copy internally consistent", () => {
    for (const milestone of milestones) {
      expect(milestone.id).toBeTruthy();
      expect(milestone.title).toBeTruthy();
      expect(milestone.summary).toBeTruthy();
      expect(milestone.durationMinutes).toBeGreaterThan(0);

      const startMs = Date.parse(milestone.start);
      const endMs = Date.parse(milestone.end);
      expect(endMs).toBeGreaterThan(startMs);
      expect((endMs - startMs) / 60_000).toBe(milestone.durationMinutes);
    }

    for (const highlight of pushbackHighlights) {
      const matchedMilestone = milestones.find((milestone) => milestone.id === highlight.milestoneId);
      expect(matchedMilestone).toBeDefined();
      expect(highlight.pushbackCount).toBe(matchedMilestone?.pushbackCount);
      expect(highlight.copy).toContain(String(highlight.pushbackCount));
    }
  });

  it("uses phase colors that keep worker on brand and supports all phase keys", () => {
    expect(MISSION_PHASE_COLORS.WORKER).toBe(brand.colors.primary);
    expect(MISSION_PHASE_COLORS.SCRUTINY).toBe(missionPalette.scrutiny);
    expect(MISSION_PHASE_COLORS["USER-TESTING"]).toBe(missionPalette.userTesting);
  });

  it("builds axis ticks that span the full mission timeline with at least three labels", () => {
    const ganttModel = buildMilestoneGanttModel(milestones);
    const ticks = buildMissionTickOffsets(ganttModel.totalDurationMinutes, 5);

    expect(ticks.length).toBeGreaterThanOrEqual(3);
    expect(ticks[0]).toBe(0);
    expect(ticks.at(-1)).toBe(ganttModel.totalDurationMinutes);
  });

  it("contains no placeholder markers", () => {
    const serialized = JSON.stringify({
      milestones,
      workers,
      validators,
      deliverables,
      pushbackHighlights,
    }).toLowerCase();

    expect(serialized).not.toContain("lorem");
    expect(serialized).not.toContain("todo");
    expect(serialized).not.toContain("fixme");
  });
});
