export const APPLEGREEN_STORAGE_PREFIX = "applegreen:";
export const LOYALTY_USER_STORAGE_KEY = `${APPLEGREEN_STORAGE_PREFIX}user`;
export const PARCELCONNECT_DISMISSED_STORAGE_KEY = `${APPLEGREEN_STORAGE_PREFIX}parcelconnect-dismissed`;
export const COFFEE_CLUB_PUNCHES_STORAGE_KEY = `${APPLEGREEN_STORAGE_PREFIX}coffee-club-punches`;
export const CAR_WASH_CLUB_PUNCHES_STORAGE_KEY = `${APPLEGREEN_STORAGE_PREFIX}car-wash-club-punches`;
export const ACTIVE_FUEL_DISCOUNT_STORAGE_KEY = `${APPLEGREEN_STORAGE_PREFIX}active-fuel-discount`;

export type LoyaltyTier = "Bronze" | "Silver" | "Gold";

export type LoyaltyUser = {
  name: string;
  points: number;
  tier: LoyaltyTier;
};

export type ActiveFuelDiscount = {
  pointsSpent: number;
  centsOffPerLitre: number;
  createdAtIso: string;
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

function normalizePunchCount(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.floor(value));
}

function readPunchCount(storageKey: string, storage?: StorageLike | null): number {
  const storageRef = resolveStorage(storage);
  if (!storageRef) {
    return 0;
  }

  const raw = storageRef.getItem(storageKey);
  if (!raw) {
    return 0;
  }

  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return normalizePunchCount(parsed);
}

function savePunchCount(storageKey: string, punches: number, storage?: StorageLike | null): number {
  const storageRef = resolveStorage(storage);
  const normalized = normalizePunchCount(punches);

  if (storageRef) {
    storageRef.setItem(storageKey, String(normalized));
  }

  return normalized;
}

function normalizeIsoTimestamp(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  return normalized;
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

export function readParcelconnectDismissed(storage?: StorageLike | null): boolean {
  const storageRef = resolveStorage(storage);
  if (!storageRef) {
    return false;
  }

  const raw = storageRef.getItem(PARCELCONNECT_DISMISSED_STORAGE_KEY);
  return raw === "1" || raw === "true";
}

export function saveParcelconnectDismissed(dismissed: boolean, storage?: StorageLike | null) {
  const storageRef = resolveStorage(storage);
  if (!storageRef) {
    return;
  }

  if (!dismissed) {
    storageRef.removeItem(PARCELCONNECT_DISMISSED_STORAGE_KEY);
    return;
  }

  storageRef.setItem(PARCELCONNECT_DISMISSED_STORAGE_KEY, "1");
}

export function readCoffeeClubPunches(storage?: StorageLike | null): number {
  return readPunchCount(COFFEE_CLUB_PUNCHES_STORAGE_KEY, storage);
}

export function saveCoffeeClubPunches(punches: number, storage?: StorageLike | null): number {
  return savePunchCount(COFFEE_CLUB_PUNCHES_STORAGE_KEY, punches, storage);
}

export function readCarWashClubPunches(storage?: StorageLike | null): number {
  return readPunchCount(CAR_WASH_CLUB_PUNCHES_STORAGE_KEY, storage);
}

export function saveCarWashClubPunches(punches: number, storage?: StorageLike | null): number {
  return savePunchCount(CAR_WASH_CLUB_PUNCHES_STORAGE_KEY, punches, storage);
}

export function readActiveFuelDiscount(storage?: StorageLike | null): ActiveFuelDiscount | null {
  const storageRef = resolveStorage(storage);
  if (!storageRef) {
    return null;
  }

  const raw = storageRef.getItem(ACTIVE_FUEL_DISCOUNT_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<ActiveFuelDiscount> | null;
    if (!parsed) {
      return null;
    }

    const pointsSpent = normalizePoints(parsed.pointsSpent);
    const centsOffPerLitre = normalizePoints(parsed.centsOffPerLitre);
    const createdAtIso = normalizeIsoTimestamp(parsed.createdAtIso);

    if (pointsSpent <= 0 || centsOffPerLitre <= 0 || !createdAtIso) {
      return null;
    }

    return {
      pointsSpent,
      centsOffPerLitre,
      createdAtIso,
    };
  } catch {
    return null;
  }
}

export function saveActiveFuelDiscount(discount: ActiveFuelDiscount, storage?: StorageLike | null): ActiveFuelDiscount {
  const storageRef = resolveStorage(storage);

  const normalized: ActiveFuelDiscount = {
    pointsSpent: Math.max(0, normalizePoints(discount.pointsSpent)),
    centsOffPerLitre: Math.max(0, normalizePoints(discount.centsOffPerLitre)),
    createdAtIso: discount.createdAtIso.trim(),
  };

  if (storageRef) {
    storageRef.setItem(ACTIVE_FUEL_DISCOUNT_STORAGE_KEY, JSON.stringify(normalized));
  }

  return normalized;
}

export function clearActiveFuelDiscount(storage?: StorageLike | null) {
  const storageRef = resolveStorage(storage);
  if (!storageRef) {
    return;
  }

  storageRef.removeItem(ACTIVE_FUEL_DISCOUNT_STORAGE_KEY);
}
