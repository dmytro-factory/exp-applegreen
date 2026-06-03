import { describe, expect, it } from "vitest";
import {
  BLOOM_COFFEE_BONUS_POINTS,
  EARN_TYPES,
  calculateEarnPoints,
  isPositiveEarnAmount,
  resolveEarnUpdate,
} from "../../lib/loyalty/earn";

describe("pwa earn contracts", () => {
  it("exposes the three required earn types", () => {
    expect(EARN_TYPES.map((earnType) => earnType.label)).toEqual([
      "Fuel litres",
      "In-store spend",
      "Bloom coffee bonus",
    ]);
  });

  it("awards 1 point per litre of fuel", () => {
    expect(calculateEarnPoints("fuel", 25)).toBe(25);
  });

  it("awards 1 point per euro of in-store spend", () => {
    expect(calculateEarnPoints("inStore", 10)).toBe(10);
  });

  it("awards the fixed Bloom coffee bonus per coffee", () => {
    expect(BLOOM_COFFEE_BONUS_POINTS).toBeGreaterThan(0);
    expect(calculateEarnPoints("bloomCoffee", 1)).toBe(BLOOM_COFFEE_BONUS_POINTS);
    expect(calculateEarnPoints("bloomCoffee", 2)).toBe(BLOOM_COFFEE_BONUS_POINTS * 2);
  });

  it("requires a positive amount for earn submissions", () => {
    expect(isPositiveEarnAmount(0)).toBe(false);
    expect(isPositiveEarnAmount(-1)).toBe(false);
    expect(isPositiveEarnAmount(Number.NaN)).toBe(false);
    expect(isPositiveEarnAmount(0.01)).toBe(true);
  });

  it("marks tier upgrades when crossing threshold boundaries", () => {
    const outcome = resolveEarnUpdate(
      { name: "Dmytro", points: 490, tier: "Bronze" },
      "fuel",
      25,
    );

    expect(outcome.earnedPoints).toBe(25);
    expect(outcome.updatedUser.points).toBe(515);
    expect(outcome.updatedUser.tier).toBe("Silver");
    expect(outcome.tierUpgraded).toBe(true);
  });
});
