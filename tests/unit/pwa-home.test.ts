import { describe, expect, it } from "vitest";
import {
  PARCELCONNECT_NOTIFICATION_COPY,
  PARTNER_OFFERS,
  ROAD_TRIP_CTA_HREF,
  TODAYS_OFFERS,
  getTierProgress,
} from "../../lib/loyalty/home";
import {
  PARCELCONNECT_DISMISSED_STORAGE_KEY,
  readParcelconnectDismissed,
  saveParcelconnectDismissed,
  tierFromPoints,
} from "../../lib/loyalty/storage";

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

describe("pwa home contracts", () => {
  it("maps tier thresholds at all boundary seeds", () => {
    expect(tierFromPoints(0)).toBe("Bronze");
    expect(tierFromPoints(499)).toBe("Bronze");
    expect(tierFromPoints(500)).toBe("Silver");
    expect(tierFromPoints(1499)).toBe("Silver");
    expect(tierFromPoints(1500)).toBe("Gold");
    expect(tierFromPoints(2500)).toBe("Gold");
  });

  it("computes progress correctly for Bronze and Silver tiers", () => {
    expect(getTierProgress(0)).toEqual({ tier: "Bronze", percent: 0, remainingPoints: 500 });
    expect(getTierProgress(750)).toEqual({ tier: "Silver", percent: 25, remainingPoints: 750 });
  });

  it("marks Gold as top tier with no remaining progress requirement", () => {
    expect(getTierProgress(1500)).toEqual({ tier: "Gold", percent: 100, remainingPoints: 0 });
    expect(getTierProgress(2500)).toEqual({ tier: "Gold", percent: 100, remainingPoints: 0 });
  });

  it("defines required home content contracts", () => {
    expect(PARCELCONNECT_NOTIFICATION_COPY).toBe("Parcel ready at Applegreen Naas Road");
    expect(ROAD_TRIP_CTA_HREF).toBe("/app/road-trip");
    expect(TODAYS_OFFERS.length).toBeGreaterThanOrEqual(3);
    expect(PARTNER_OFFERS.length).toBeGreaterThanOrEqual(3);
  });

  it("requires each partner offer to include name, logo, and discount", () => {
    for (const offer of PARTNER_OFFERS) {
      expect(offer.name).toBeTruthy();
      expect(offer.logoSrc).toBeTruthy();
      expect(offer.discountLabel).toBeTruthy();
    }
  });

  it("persists parcel notification dismissal in namespaced localStorage", () => {
    const storage = new MemoryStorage();

    expect(PARCELCONNECT_DISMISSED_STORAGE_KEY).toBe("applegreen:parcelconnect-dismissed");
    expect(readParcelconnectDismissed(storage)).toBe(false);

    saveParcelconnectDismissed(true, storage);
    expect(readParcelconnectDismissed(storage)).toBe(true);

    saveParcelconnectDismissed(false, storage);
    expect(readParcelconnectDismissed(storage)).toBe(false);
  });
});
