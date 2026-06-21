import { describe, expect, it } from "vitest";
import {
  REWARDS,
  addVehicle,
  createAccount,
  nextTierProgress,
  pointsForKwh,
  recordChargeSession,
  redeemReward,
  removeVehicle,
  setDefaultVehicle,
  tierFromPoints,
} from "../../lib/loyalty/charging";

describe("fast charge loyalty", () => {
  it("awards points per kWh and maps tiers", () => {
    expect(pointsForKwh(34.8)).toBe(174);
    expect(tierFromPoints(0)).toBe("Seedling");
    expect(tierFromPoints(500)).toBe("Sprout");
    expect(tierFromPoints(1500)).toBe("Orchard");
  });

  it("reports progress toward the next tier", () => {
    const progress = nextTierProgress(250);
    expect(progress.current).toBe("Seedling");
    expect(progress.next).toBe("Sprout");
    expect(progress.pointsToNext).toBe(250);
    expect(progress.ratio).toBeCloseTo(0.5, 2);
    expect(nextTierProgress(2000).next).toBeNull();
  });

  it("creates seeded vs guest accounts", () => {
    expect(createAccount("Ada", false).vehicles).toHaveLength(1);
    expect(createAccount("", true).name).toBe("Guest");
    expect(createAccount("", true).vehicles).toHaveLength(0);
  });

  it("records a charge session and prepends activity", () => {
    const account = createAccount("Ada", false);
    const { account: next, activity } = recordChargeSession(account, {
      stationId: "np-north",
      stationName: "Newport Pagnell North",
      connector: "CCS",
      kwh: 40,
      cost: 31.6,
      currency: "GBP",
    });
    expect(activity.pointsEarned).toBe(200);
    expect(next.points).toBe(200);
    expect(next.activity[0].id).toBe(activity.id);
  });

  it("redeems rewards only with enough points", () => {
    const reward = REWARDS[0];
    const poor = redeemReward(createAccount("Ada", false), reward);
    expect(poor.ok).toBe(false);

    const rich = redeemReward({ ...createAccount("Ada", false), points: 1000 }, reward);
    expect(rich.ok).toBe(true);
    expect(rich.account.points).toBe(1000 - reward.cost);
    expect(rich.account.redemptions).toHaveLength(1);
  });

  it("manages vehicle defaults", () => {
    let account = createAccount("", true);
    account = addVehicle(account, { nickname: "EV", make: "Kia", model: "EV6", kind: "ev", connector: "CCS", isDefault: false });
    expect(account.vehicles[0].isDefault).toBe(true);

    account = addVehicle(account, { nickname: "Van", make: "Ford", model: "Transit", kind: "ice", connector: null, isDefault: true });
    expect(account.vehicles.find((v) => v.make === "Ford")?.isDefault).toBe(true);
    expect(account.vehicles.find((v) => v.make === "Kia")?.isDefault).toBe(false);

    const kiaId = account.vehicles.find((v) => v.make === "Kia")!.id;
    account = setDefaultVehicle(account, kiaId);
    expect(account.vehicles.find((v) => v.id === kiaId)?.isDefault).toBe(true);

    const fordId = account.vehicles.find((v) => v.make === "Ford")!.id;
    account = removeVehicle(account, kiaId);
    expect(account.vehicles).toHaveLength(1);
    expect(account.vehicles.find((v) => v.id === fordId)?.isDefault).toBe(true);
  });
});
