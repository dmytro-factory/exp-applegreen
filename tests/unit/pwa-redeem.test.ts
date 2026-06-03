import { describe, expect, it } from "vitest";
import {
  ACTIVE_FUEL_DISCOUNT_STORAGE_KEY,
  CAR_WASH_CLUB_PUNCHES_STORAGE_KEY,
  COFFEE_CLUB_PUNCHES_STORAGE_KEY,
  clearActiveFuelDiscount,
  readActiveFuelDiscount,
  readCarWashClubPunches,
  readCoffeeClubPunches,
  saveActiveFuelDiscount,
  saveCarWashClubPunches,
  saveCoffeeClubPunches,
} from "../../lib/loyalty/storage";
import {
  CAR_WASH_CLUB_TARGET_PUNCHES,
  COFFEE_CLUB_TARGET_PUNCHES,
  FUEL_REDEEM_MIN_POINTS,
  FUEL_REDEEM_STEP_POINTS,
  addClubPunch,
  calculateFuelDiscountCents,
  getMaxFuelRedeemPoints,
  isClubClaimAvailable,
  isFuelRedeemAvailable,
  resetClubPunches,
  resolveFuelRedemption,
} from "../../lib/loyalty/redeem";

class MemoryStorage implements Storage {
  private store = new Map<string, string>();

  get length() {
    return this.store.size;
  }

  clear() {
    this.store.clear();
  }

  getItem(key: string) {
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  key(index: number) {
    return Array.from(this.store.keys())[index] ?? null;
  }

  removeItem(key: string) {
    this.store.delete(key);
  }

  setItem(key: string, value: string) {
    this.store.set(key, value);
  }
}

describe("pwa redeem contracts", () => {
  it("maps fuel redemption conversion with 100 pts per 1c/L", () => {
    expect(FUEL_REDEEM_MIN_POINTS).toBe(500);
    expect(FUEL_REDEEM_STEP_POINTS).toBe(100);
    expect(calculateFuelDiscountCents(500)).toBe(5);
    expect(calculateFuelDiscountCents(1000)).toBe(10);
    expect(calculateFuelDiscountCents(1500)).toBe(15);
  });

  it("caps redeem max points to balance and configured step", () => {
    expect(getMaxFuelRedeemPoints(0)).toBe(0);
    expect(getMaxFuelRedeemPoints(499)).toBe(400);
    expect(getMaxFuelRedeemPoints(575)).toBe(500);
    expect(getMaxFuelRedeemPoints(1249)).toBe(1200);
    expect(isFuelRedeemAvailable(499)).toBe(false);
    expect(isFuelRedeemAvailable(500)).toBe(true);
  });

  it("decrements balance by exact redeemed points on successful fuel redeem", () => {
    const result = resolveFuelRedemption(1200, 500);
    expect(result.success).toBe(true);
    expect(result.updatedPoints).toBe(700);
    expect(result.redeemedPoints).toBe(500);
    expect(result.centsOffPerLitre).toBe(5);
  });

  it("rejects fuel redemption below threshold or above available capped max", () => {
    expect(resolveFuelRedemption(450, 500).success).toBe(false);
    expect(resolveFuelRedemption(1200, 400).success).toBe(false);
    expect(resolveFuelRedemption(1200, 1300).success).toBe(false);
  });

  it("increments punch cards one at a time and enables claim at thresholds", () => {
    let coffeePunches = 0;
    let washPunches = 0;

    for (let i = 0; i < COFFEE_CLUB_TARGET_PUNCHES; i += 1) {
      coffeePunches = addClubPunch(coffeePunches, COFFEE_CLUB_TARGET_PUNCHES);
    }
    for (let i = 0; i < CAR_WASH_CLUB_TARGET_PUNCHES; i += 1) {
      washPunches = addClubPunch(washPunches, CAR_WASH_CLUB_TARGET_PUNCHES);
    }

    expect(coffeePunches).toBe(COFFEE_CLUB_TARGET_PUNCHES);
    expect(washPunches).toBe(CAR_WASH_CLUB_TARGET_PUNCHES);
    expect(isClubClaimAvailable(coffeePunches, COFFEE_CLUB_TARGET_PUNCHES)).toBe(true);
    expect(isClubClaimAvailable(washPunches, CAR_WASH_CLUB_TARGET_PUNCHES)).toBe(true);

    expect(resetClubPunches()).toBe(0);
  });

  it("persists coffee/car wash punches and fuel discount artifact in namespaced storage", () => {
    const storage = new MemoryStorage();

    expect(COFFEE_CLUB_PUNCHES_STORAGE_KEY).toBe("applegreen:coffee-club-punches");
    expect(CAR_WASH_CLUB_PUNCHES_STORAGE_KEY).toBe("applegreen:car-wash-club-punches");
    expect(ACTIVE_FUEL_DISCOUNT_STORAGE_KEY).toBe("applegreen:active-fuel-discount");

    expect(readCoffeeClubPunches(storage)).toBe(0);
    expect(readCarWashClubPunches(storage)).toBe(0);
    expect(readActiveFuelDiscount(storage)).toBeNull();

    saveCoffeeClubPunches(3, storage);
    saveCarWashClubPunches(2, storage);
    saveActiveFuelDiscount({ pointsSpent: 500, centsOffPerLitre: 5, createdAtIso: "2026-01-01T12:00:00.000Z" }, storage);

    expect(readCoffeeClubPunches(storage)).toBe(3);
    expect(readCarWashClubPunches(storage)).toBe(2);
    expect(readActiveFuelDiscount(storage)).toEqual({
      pointsSpent: 500,
      centsOffPerLitre: 5,
      createdAtIso: "2026-01-01T12:00:00.000Z",
    });

    clearActiveFuelDiscount(storage);
    expect(readActiveFuelDiscount(storage)).toBeNull();
  });
});
