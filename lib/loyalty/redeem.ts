export const FUEL_REDEEM_MIN_POINTS = 500;
export const FUEL_REDEEM_STEP_POINTS = 100;

export const COFFEE_CLUB_TARGET_PUNCHES = 9;
export const CAR_WASH_CLUB_TARGET_PUNCHES = 4;

export type FuelRedemptionResult = {
  success: boolean;
  updatedPoints: number;
  redeemedPoints: number;
  centsOffPerLitre: number;
};

function normalizePoints(points: number): number {
  if (!Number.isFinite(points)) {
    return 0;
  }

  return Math.max(0, Math.floor(points));
}

export function calculateFuelDiscountCents(points: number): number {
  return Math.floor(normalizePoints(points) / FUEL_REDEEM_STEP_POINTS);
}

export function getMaxFuelRedeemPoints(balancePoints: number): number {
  const normalizedBalance = normalizePoints(balancePoints);
  return Math.floor(normalizedBalance / FUEL_REDEEM_STEP_POINTS) * FUEL_REDEEM_STEP_POINTS;
}

export function isFuelRedeemAvailable(balancePoints: number): boolean {
  return getMaxFuelRedeemPoints(balancePoints) >= FUEL_REDEEM_MIN_POINTS;
}

function isValidRedeemSelection(redeemedPoints: number): boolean {
  return (
    redeemedPoints >= FUEL_REDEEM_MIN_POINTS &&
    redeemedPoints % FUEL_REDEEM_STEP_POINTS === 0
  );
}

export function resolveFuelRedemption(balancePoints: number, redeemedPoints: number): FuelRedemptionResult {
  const normalizedBalance = normalizePoints(balancePoints);
  const normalizedRedeemed = normalizePoints(redeemedPoints);
  const maxRedeemable = getMaxFuelRedeemPoints(normalizedBalance);

  if (
    !isValidRedeemSelection(normalizedRedeemed) ||
    normalizedRedeemed > maxRedeemable
  ) {
    return {
      success: false,
      updatedPoints: normalizedBalance,
      redeemedPoints: 0,
      centsOffPerLitre: 0,
    };
  }

  return {
    success: true,
    updatedPoints: normalizedBalance - normalizedRedeemed,
    redeemedPoints: normalizedRedeemed,
    centsOffPerLitre: calculateFuelDiscountCents(normalizedRedeemed),
  };
}

export function addClubPunch(currentPunches: number, targetPunches: number): number {
  const normalizedTarget = Math.max(1, Math.floor(targetPunches));
  const normalizedCurrent = Math.max(0, Math.floor(currentPunches));
  return Math.min(normalizedTarget, normalizedCurrent + 1);
}

export function isClubClaimAvailable(currentPunches: number, targetPunches: number): boolean {
  const normalizedTarget = Math.max(1, Math.floor(targetPunches));
  const normalizedCurrent = Math.max(0, Math.floor(currentPunches));
  return normalizedCurrent >= normalizedTarget;
}

export function resetClubPunches() {
  return 0;
}
