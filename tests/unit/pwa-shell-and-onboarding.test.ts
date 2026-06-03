import { describe, expect, it } from "vitest";
import {
  APPLEGREEN_STORAGE_PREFIX,
  LOYALTY_USER_STORAGE_KEY,
  createOnboardedUser,
  readLoyaltyUser,
  resetLoyaltyUser,
  saveOnboardedUser,
} from "../../lib/loyalty/storage";
import { pwaNavItems, resolveAppAuthRedirect } from "../../lib/loyalty/shell";

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

describe("pwa shell and onboarding contracts", () => {
  it("defines the exact five nav tabs in order", () => {
    expect(pwaNavItems.map((item) => item.label)).toEqual([
      "Home",
      "Earn",
      "Redeem",
      "Stations",
      "Wallet",
    ]);
  });

  it("uses applegreen namespaced localStorage keys", () => {
    expect(APPLEGREEN_STORAGE_PREFIX).toBe("applegreen:");
    expect(LOYALTY_USER_STORAGE_KEY).toBe("applegreen:user");
  });

  it("creates a new onboarded user with 0 points and Bronze tier", () => {
    expect(createOnboardedUser("  Dmytro  ")).toMatchObject({
      name: "Dmytro",
      points: 0,
      tier: "Bronze",
    });
  });

  it("saves, reads, and resets the user record", () => {
    const storage = new MemoryStorage();

    const saved = saveOnboardedUser("Ava", storage);
    const loaded = readLoyaltyUser(storage);

    expect(saved?.name).toBe("Ava");
    expect(loaded?.name).toBe("Ava");
    expect(loaded?.points).toBe(0);
    expect(loaded?.tier).toBe("Bronze");

    resetLoyaltyUser(storage);
    expect(readLoyaltyUser(storage)).toBeNull();
  });

  it("disables onboarding progression when name is empty/whitespace", () => {
    const storage = new MemoryStorage();

    expect(saveOnboardedUser("", storage)).toBeNull();
    expect(saveOnboardedUser("   ", storage)).toBeNull();
    expect(readLoyaltyUser(storage)).toBeNull();
  });

  it("resolves auth redirects for onboarding gating", () => {
    expect(resolveAppAuthRedirect("/app", false)).toBe("/app/onboarding");
    expect(resolveAppAuthRedirect("/app/earn", false)).toBe("/app/onboarding");
    expect(resolveAppAuthRedirect("/app/onboarding", false)).toBeNull();
    expect(resolveAppAuthRedirect("/app/onboarding", true)).toBe("/app");
    expect(resolveAppAuthRedirect("/app/wallet", true)).toBeNull();
  });
});
