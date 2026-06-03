export const APPLEGREEN_STORAGE_PREFIX = "applegreen:";
export const LOYALTY_USER_STORAGE_KEY = `${APPLEGREEN_STORAGE_PREFIX}user`;

export type LoyaltyTier = "Bronze" | "Silver" | "Gold";

export type LoyaltyUser = {
  name: string;
  points: number;
  tier: LoyaltyTier;
};

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

const fallbackUser: LoyaltyUser = {
  name: "Guest",
  points: 0,
  tier: "Bronze",
};

function resolveStorage(storage?: StorageLike | null): StorageLike | null {
  if (storage) {
    return storage;
  }

  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

export function tierFromPoints(points: number): LoyaltyTier {
  if (points >= 1500) {
    return "Gold";
  }

  if (points >= 500) {
    return "Silver";
  }

  return "Bronze";
}

function normalizePoints(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallbackUser.points;
  }

  return Math.max(0, Math.round(value));
}

function normalizeName(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function normalizeTier(value: unknown, points: number): LoyaltyTier {
  if (value === "Bronze" || value === "Silver" || value === "Gold") {
    return value;
  }

  return tierFromPoints(points);
}

export function createOnboardedUser(name: string): LoyaltyUser {
  const normalizedName = normalizeName(name);

  return {
    name: normalizedName,
    points: fallbackUser.points,
    tier: fallbackUser.tier,
  };
}

export function readLoyaltyUser(storage?: StorageLike | null): LoyaltyUser | null {
  const storageRef = resolveStorage(storage);
  if (!storageRef) {
    return null;
  }

  const raw = storageRef.getItem(LOYALTY_USER_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<LoyaltyUser> | null;
    if (!parsed) {
      return null;
    }

    const name = normalizeName(parsed.name);
    if (!name) {
      return null;
    }

    const points = normalizePoints(parsed.points);
    const tier = normalizeTier(parsed.tier, points);

    return { name, points, tier };
  } catch {
    return null;
  }
}

export function saveLoyaltyUser(user: LoyaltyUser, storage?: StorageLike | null): LoyaltyUser {
  const storageRef = resolveStorage(storage);
  const points = normalizePoints(user.points);
  const normalized: LoyaltyUser = {
    name: normalizeName(user.name),
    points,
    tier: normalizeTier(user.tier, points),
  };

  if (storageRef) {
    storageRef.setItem(LOYALTY_USER_STORAGE_KEY, JSON.stringify(normalized));
  }

  return normalized;
}

export function saveOnboardedUser(name: string, storage?: StorageLike | null): LoyaltyUser | null {
  const normalizedName = normalizeName(name);
  if (!normalizedName) {
    return null;
  }

  const user = createOnboardedUser(normalizedName);
  return saveLoyaltyUser(user, storage);
}

export function resetLoyaltyUser(storage?: StorageLike | null) {
  const storageRef = resolveStorage(storage);
  if (!storageRef) {
    return;
  }

  storageRef.removeItem(LOYALTY_USER_STORAGE_KEY);
}
