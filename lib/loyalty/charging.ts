import type { ConnectorType, Currency } from "@/lib/charging/model";

export const FASTCHARGE_ACCOUNT_KEY = "applegreen:fastcharge:account";
export const FASTCHARGE_UPDATED_EVENT = "applegreen:fastcharge:updated";

export type FastChargeTier = "Seedling" | "Sprout" | "Orchard";

export type VehicleKind = "ev" | "ice";

export type ChargeVehicle = {
  id: string;
  nickname: string;
  make: string;
  model: string;
  kind: VehicleKind;
  connector: ConnectorType | null;
  isDefault: boolean;
};

export type ChargeActivity = {
  id: string;
  stationId: string;
  stationName: string;
  connector: ConnectorType;
  kwh: number;
  cost: number;
  currency: Currency;
  pointsEarned: number;
  dateIso: string;
};

export type Redemption = {
  id: string;
  rewardId: string;
  title: string;
  pointsSpent: number;
  dateIso: string;
};

export type FastChargeAccount = {
  name: string;
  guest: boolean;
  points: number;
  vehicles: ChargeVehicle[];
  activity: ChargeActivity[];
  redemptions: Redemption[];
};

export type ChargeReward = {
  id: string;
  title: string;
  description: string;
  cost: number;
};

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export const POINTS_PER_KWH = 5;

export const TIER_THRESHOLDS: { tier: FastChargeTier; min: number }[] = [
  { tier: "Orchard", min: 1500 },
  { tier: "Sprout", min: 500 },
  { tier: "Seedling", min: 0 },
];

export const REWARDS: ChargeReward[] = [
  {
    id: "free-coffee",
    title: "Free barista coffee",
    description: "Any regular hot drink at Welcome Break or Applegreen.",
    cost: 250,
  },
  {
    id: "5-off-charge",
    title: "£5 off your next charge",
    description: "Applied automatically to your next session.",
    cost: 500,
  },
  {
    id: "10-off-charge",
    title: "£10 off your next charge",
    description: "For when you need a bigger top-up.",
    cost: 900,
  },
  {
    id: "free-meal",
    title: "Free meal deal",
    description: "Main, snack and drink while you charge.",
    cost: 1200,
  },
];

export function pointsForKwh(kwh: number): number {
  return Math.max(0, Math.round(kwh * POINTS_PER_KWH));
}

export function tierFromPoints(points: number): FastChargeTier {
  for (const { tier, min } of TIER_THRESHOLDS) {
    if (points >= min) {
      return tier;
    }
  }
  return "Seedling";
}

export function nextTierProgress(points: number): {
  current: FastChargeTier;
  next: FastChargeTier | null;
  pointsToNext: number;
  ratio: number;
} {
  const current = tierFromPoints(points);
  const ascending = [...TIER_THRESHOLDS].reverse();
  const currentIndex = ascending.findIndex((entry) => entry.tier === current);
  const nextEntry = ascending[currentIndex + 1] ?? null;

  if (!nextEntry) {
    return { current, next: null, pointsToNext: 0, ratio: 1 };
  }

  const floor = ascending[currentIndex].min;
  const span = nextEntry.min - floor;
  const progressed = points - floor;
  const ratio = span <= 0 ? 1 : Math.min(1, Math.max(0, progressed / span));

  return {
    current,
    next: nextEntry.tier,
    pointsToNext: Math.max(0, nextEntry.min - points),
    ratio,
  };
}

function resolveStorage(storage?: StorageLike | null): StorageLike | null {
  if (storage) {
    return storage;
  }

  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

function notifyUpdated() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(FASTCHARGE_UPDATED_EVENT));
}

function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

const SEED_VEHICLES: ChargeVehicle[] = [
  {
    id: "seed-ev",
    nickname: "My EV",
    make: "Tesla",
    model: "Model 3",
    kind: "ev",
    connector: "CCS",
    isDefault: true,
  },
];

export function createAccount(name: string, guest: boolean): FastChargeAccount {
  return {
    name: name.trim() || (guest ? "Guest" : "Driver"),
    guest,
    points: 0,
    vehicles: guest ? [] : SEED_VEHICLES.map((vehicle) => ({ ...vehicle })),
    activity: [],
    redemptions: [],
  };
}

export function readAccount(storage?: StorageLike | null): FastChargeAccount | null {
  const storageRef = resolveStorage(storage);
  if (!storageRef) {
    return null;
  }

  const raw = storageRef.getItem(FASTCHARGE_ACCOUNT_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<FastChargeAccount> | null;
    if (!parsed || typeof parsed.name !== "string") {
      return null;
    }

    return {
      name: parsed.name,
      guest: Boolean(parsed.guest),
      points: typeof parsed.points === "number" && Number.isFinite(parsed.points) ? Math.max(0, Math.round(parsed.points)) : 0,
      vehicles: Array.isArray(parsed.vehicles) ? parsed.vehicles : [],
      activity: Array.isArray(parsed.activity) ? parsed.activity : [],
      redemptions: Array.isArray(parsed.redemptions) ? parsed.redemptions : [],
    };
  } catch {
    return null;
  }
}

export function saveAccount(account: FastChargeAccount, storage?: StorageLike | null): FastChargeAccount {
  const storageRef = resolveStorage(storage);
  if (storageRef) {
    storageRef.setItem(FASTCHARGE_ACCOUNT_KEY, JSON.stringify(account));
  }
  notifyUpdated();
  return account;
}

export function resetAccount(storage?: StorageLike | null) {
  const storageRef = resolveStorage(storage);
  if (storageRef) {
    storageRef.removeItem(FASTCHARGE_ACCOUNT_KEY);
  }
  notifyUpdated();
}

export function recordChargeSession(
  account: FastChargeAccount,
  session: Omit<ChargeActivity, "id" | "dateIso" | "pointsEarned"> & { dateIso?: string },
): { account: FastChargeAccount; activity: ChargeActivity } {
  const pointsEarned = pointsForKwh(session.kwh);
  const activity: ChargeActivity = {
    id: makeId("act"),
    dateIso: session.dateIso ?? new Date().toISOString(),
    pointsEarned,
    stationId: session.stationId,
    stationName: session.stationName,
    connector: session.connector,
    kwh: session.kwh,
    cost: session.cost,
    currency: session.currency,
  };

  return {
    account: {
      ...account,
      points: account.points + pointsEarned,
      activity: [activity, ...account.activity],
    },
    activity,
  };
}

export function redeemReward(
  account: FastChargeAccount,
  reward: ChargeReward,
): { account: FastChargeAccount; ok: boolean } {
  if (account.points < reward.cost) {
    return { account, ok: false };
  }

  const redemption: Redemption = {
    id: makeId("red"),
    rewardId: reward.id,
    title: reward.title,
    pointsSpent: reward.cost,
    dateIso: new Date().toISOString(),
  };

  return {
    account: {
      ...account,
      points: account.points - reward.cost,
      redemptions: [redemption, ...account.redemptions],
    },
    ok: true,
  };
}

export function addVehicle(account: FastChargeAccount, vehicle: Omit<ChargeVehicle, "id">): FastChargeAccount {
  const id = makeId("veh");
  const makeDefault = vehicle.isDefault || account.vehicles.length === 0;
  const vehicles = account.vehicles.map((existing) =>
    makeDefault ? { ...existing, isDefault: false } : existing,
  );
  vehicles.push({ ...vehicle, id, isDefault: makeDefault });
  return { ...account, vehicles };
}

export function removeVehicle(account: FastChargeAccount, vehicleId: string): FastChargeAccount {
  const remaining = account.vehicles.filter((vehicle) => vehicle.id !== vehicleId);
  if (remaining.length > 0 && !remaining.some((vehicle) => vehicle.isDefault)) {
    remaining[0] = { ...remaining[0], isDefault: true };
  }
  return { ...account, vehicles: remaining };
}

export function setDefaultVehicle(account: FastChargeAccount, vehicleId: string): FastChargeAccount {
  return {
    ...account,
    vehicles: account.vehicles.map((vehicle) => ({
      ...vehicle,
      isDefault: vehicle.id === vehicleId,
    })),
  };
}
