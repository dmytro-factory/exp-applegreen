import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  deliverables,
  missionExecutionNotes,
  missionSectionOrder,
  originalUserPrompt,
  orchestratorGoal,
  techStackDependencies,
} from "../../app/(marketing)/mission/data";

const missionPagePath = new URL("../../app/(marketing)/mission/page.tsx", import.meta.url);
const marketingLayoutPath = new URL("../../app/(marketing)/layout.tsx", import.meta.url);

describe("mission narrative f17 content contract", () => {
  it("keeps the original input prompt and orchestrator goal populated", () => {
    expect(originalUserPrompt.trim().length).toBeGreaterThan(0);
    expect(originalUserPrompt).toContain("applegreenstores.com");
    expect(originalUserPrompt.toLowerCase()).toContain("loyalty");
    expect(orchestratorGoal.trim().length).toBeGreaterThan(0);
  });

  it("defines the required mission section order", () => {
    expect(missionSectionOrder).toEqual([
      "input",
      "orchestrator-goal",
      "gantt",
      "milestone-breakdown",
      "sealed-milestones",
      "execution-notes",
      "tech-stack",
      "deliverables",
      "phase-two",
    ]);
  });

  it("lists required tech stack dependencies and non-empty execution notes", () => {
    const normalizedTechStack = techStackDependencies.join(" ").toLowerCase();
    expect(normalizedTechStack).toContain("next.js");
    expect(normalizedTechStack).toContain("tailwind");
    expect(normalizedTechStack).toContain("recharts");
    expect(normalizedTechStack).toContain("passkit-generator");
    expect(normalizedTechStack).toContain("vitest");

    expect(missionExecutionNotes.length).toBeGreaterThan(0);
    missionExecutionNotes.forEach((note) => expect(note.trim().length).toBeGreaterThan(0));
  });

  it("lists required deliverable links", () => {
    expect(deliverables.map((deliverable) => deliverable.label)).toEqual([
      "Marketing site",
      "PWA prototype",
      "GitHub repository",
      "Wallet pass endpoint",
    ]);
    deliverables.forEach((deliverable) => {
      expect(deliverable.href.startsWith("https://")).toBe(true);
    });
  });

  it("adds a mission page with a single h1 and ordered section ids", () => {
    expect(existsSync(missionPagePath)).toBe(true);
    const source = readFileSync(missionPagePath, "utf8");

    expect((source.match(/<h1[\s>]/g) ?? []).length).toBe(1);
    missionSectionOrder.forEach((sectionId) => {
      expect(source).toContain(`id="${sectionId}"`);
    });
  });

  it("adds a /mission link in marketing layout navigation or footer", () => {
    const layoutSource = readFileSync(marketingLayoutPath, "utf8");
    expect(layoutSource).toContain('href="/mission"');
  });
});
