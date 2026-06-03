import { describe, expect, it } from "vitest";
import {
  livePrototypeConfig,
  problemComparisonColumns,
  problemComparisonFeatures,
  visionBodyCopy,
  visionMockups,
} from "../../lib/marketing/problem-vision-content";

describe("marketing f04 content", () => {
  it("defines Applegreen vs Shell Go+ comparison columns", () => {
    expect(problemComparisonColumns.map((column) => column.label)).toEqual([
      "Applegreen Rewards",
      "Shell Go+",
    ]);
  });

  it("enumerates the required loyalty features and shows fewer Applegreen ticks", () => {
    expect(problemComparisonFeatures.map((feature) => feature.title)).toEqual([
      "Coffee Club",
      "Fuel discount",
      "Partner offers",
      "Station locator",
    ]);

    const applegreenTickCount = problemComparisonFeatures.filter((feature) =>
      feature.availability.applegreen,
    ).length;
    const shellTickCount = problemComparisonFeatures.filter((feature) =>
      feature.availability.shellGoPlus,
    ).length;

    expect(applegreenTickCount).toBeLessThan(shellTickCount);
  });

  it("keeps the vision copy anchored on road-trip, family, and Parcelconnect", () => {
    const normalizedCopy = visionBodyCopy.toLowerCase();
    expect(normalizedCopy).toContain("road-trip");
    expect(normalizedCopy).toContain("family");
    expect(normalizedCopy).toContain("parcelconnect");
  });

  it("defines at least two portrait mockups and a CTA to /app", () => {
    expect(visionMockups.length).toBeGreaterThanOrEqual(2);

    for (const mockup of visionMockups) {
      const aspectRatio = mockup.width / mockup.height;
      expect(aspectRatio).toBeGreaterThanOrEqual(1 / 2.4);
      expect(aspectRatio).toBeLessThanOrEqual(1 / 1.8);
    }

    expect(livePrototypeConfig.iframeSrc).toBe("/app");
    expect(livePrototypeConfig.ctaHref).toBe("/app");
    expect(livePrototypeConfig.ctaLabel).toBe("Try the prototype");
  });
});
