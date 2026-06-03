import { tierFromPoints, type LoyaltyUser } from "./storage";

export type EarnType = "fuel" | "inStore" | "bloomCoffee";

export type EarnTypeOption = {
  value: EarnType;
  label: string;
  amountLabel: string;
  helperText: string;
  amountSuffix: string;
  defaultAmount: string;
  step: string;
};

export const FUEL_POINTS_PER_LITRE = 1;
export const IN_STORE_POINTS_PER_EURO = 1;
export const BLOOM_COFFEE_BONUS_POINTS = 10;

export const EARN_TYPES: EarnTypeOption[] = [
  {
    value: "fuel",
    label: "Fuel litres",
    amountLabel: "Fuel litres",
    helperText: `Rule: ${FUEL_POINTS_PER_LITRE} point per litre.`,
    amountSuffix: "L",
    defaultAmount: "25",
    step: "0.1",
  },
  {
    value: "inStore",
    label: "In-store spend",
    amountLabel: "In-store spend",
    helperText: `Rule: ${IN_STORE_POINTS_PER_EURO} point per €1 spent.`,
    amountSuffix: "€",
    defaultAmount: "10",
    step: "0.01",
  },
  {
    value: "bloomCoffee",
    label: "Bloom coffee bonus",
    amountLabel: "Bloom coffee count",
    helperText: `Rule: +${BLOOM_COFFEE_BONUS_POINTS} points per Bloom coffee.`,
    amountSuffix: "cups",
    defaultAmount: "1",
    step: "1",
  },
];

export type EarnUpdateOutcome = {
  earnedPoints: number;
  updatedUser: LoyaltyUser;
  tierUpgraded: boolean;
};

export function isPositiveEarnAmount(amount: number): boolean {
  return Number.isFinite(amount) && amount > 0;
}

function normalizeAmount(amount: number): number {
  if (!isPositiveEarnAmount(amount)) {
    return 0;
  }

  return amount;
}

export function calculateEarnPoints(type: EarnType, amount: number): number {
  const normalizedAmount = normalizeAmount(amount);
  if (normalizedAmount <= 0) {
    return 0;
  }

  if (type === "fuel") {
    return Math.round(normalizedAmount * FUEL_POINTS_PER_LITRE);
  }

  if (type === "inStore") {
    return Math.round(normalizedAmount * IN_STORE_POINTS_PER_EURO);
  }

  return Math.round(normalizedAmount) * BLOOM_COFFEE_BONUS_POINTS;
}

export function resolveEarnUpdate(user: LoyaltyUser, type: EarnType, amount: number): EarnUpdateOutcome {
  const earnedPoints = calculateEarnPoints(type, amount);
  const updatedPoints = Math.max(0, user.points + earnedPoints);
  const updatedTier = tierFromPoints(updatedPoints);

  return {
    earnedPoints,
    updatedUser: {
      ...user,
      points: updatedPoints,
      tier: updatedTier,
    },
    tierUpgraded: updatedTier !== user.tier,
  };
}

export function findEarnTypeOption(type: EarnType): EarnTypeOption {
  return EARN_TYPES.find((option) => option.value === type) ?? EARN_TYPES[0];
}
