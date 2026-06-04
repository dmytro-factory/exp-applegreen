"use client";

import { useEffect, useMemo, useState } from "react";
import { usePwaSession } from "@/components/pwa/pwa-shell";
import { brand } from "@/lib/brand";
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
} from "@/lib/loyalty/redeem";
import {
  readCarWashClubPunches,
  readCoffeeClubPunches,
  saveActiveFuelDiscount,
  saveCarWashClubPunches,
  saveCoffeeClubPunches,
  saveLoyaltyUser,
} from "@/lib/loyalty/storage";

function PunchSlots({ total, filled, label }: { total: number; filled: number; label: string }) {
  return (
    <ul
      className="grid gap-2"
      aria-label={label}
      style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: total }, (_, index) => {
        const slotFilled = index < filled;
        return (
          <li
            key={`${label}-${index + 1}`}
            className="h-7 w-7 rounded-full border"
            aria-label={`${label} slot ${index + 1} ${slotFilled ? "filled" : "empty"}`}
            style={{
              borderColor: slotFilled ? "var(--brand-primary)" : "rgb(212 212 216)",
              backgroundColor: slotFilled ? "rgb(245 250 238)" : "white",
            }}
          />
        );
      })}
    </ul>
  );
}

export default function RedeemPage() {
  const { hydrated, user, setUser } = usePwaSession();

  const [fuelRedeemPoints, setFuelRedeemPoints] = useState(FUEL_REDEEM_MIN_POINTS);
  const [fuelConfirmation, setFuelConfirmation] = useState<string | null>(null);

  const [coffeePunches, setCoffeePunches] = useState(0);
  const [coffeeConfirmation, setCoffeeConfirmation] = useState<string | null>(null);

  const [carWashPunches, setCarWashPunches] = useState(0);
  const [carWashConfirmation, setCarWashConfirmation] = useState<string | null>(null);

  const pointsBalance = user?.points ?? 0;
  const maxFuelRedeemPoints = useMemo(() => getMaxFuelRedeemPoints(pointsBalance), [pointsBalance]);
  const fuelRedeemSliderMax = useMemo(
    () => Math.max(maxFuelRedeemPoints, FUEL_REDEEM_MIN_POINTS),
    [maxFuelRedeemPoints],
  );
  const canRedeemFuel = useMemo(() => isFuelRedeemAvailable(pointsBalance), [pointsBalance]);
  const selectedCentsOff = useMemo(() => calculateFuelDiscountCents(fuelRedeemPoints), [fuelRedeemPoints]);

  const coffeeClaimAvailable = isClubClaimAvailable(coffeePunches, COFFEE_CLUB_TARGET_PUNCHES);
  const carWashClaimAvailable = isClubClaimAvailable(carWashPunches, CAR_WASH_CLUB_TARGET_PUNCHES);

  useEffect(() => {
    if (!hydrated || !user) {
      return;
    }

    setCoffeePunches(readCoffeeClubPunches());
    setCarWashPunches(readCarWashClubPunches());
  }, [hydrated, user]);

  useEffect(() => {
    if (!canRedeemFuel) {
      setFuelRedeemPoints(FUEL_REDEEM_MIN_POINTS);
      return;
    }

    setFuelRedeemPoints((current) => {
      if (current < FUEL_REDEEM_MIN_POINTS) {
        return FUEL_REDEEM_MIN_POINTS;
      }
      if (current > maxFuelRedeemPoints) {
        return maxFuelRedeemPoints;
      }
      return current;
    });
  }, [canRedeemFuel, maxFuelRedeemPoints]);

  const handleFuelRedeem = () => {
    if (!user) {
      return;
    }

    const outcome = resolveFuelRedemption(user.points, fuelRedeemPoints);
    if (!outcome.success) {
      setFuelConfirmation(`Need at least ${FUEL_REDEEM_MIN_POINTS} pts to redeem fuel discounts.`);
      return;
    }

    const savedUser = saveLoyaltyUser({
      ...user,
      points: outcome.updatedPoints,
    });

    saveActiveFuelDiscount({
      pointsSpent: outcome.redeemedPoints,
      centsOffPerLitre: outcome.centsOffPerLitre,
      createdAtIso: new Date().toISOString(),
    });

    setUser(savedUser);
    setFuelConfirmation(`Success! ${outcome.centsOffPerLitre}c/L off your next fill is now active.`);
  };

  const handleCoffeePunch = () => {
    const updated = addClubPunch(coffeePunches, COFFEE_CLUB_TARGET_PUNCHES);
    const saved = saveCoffeeClubPunches(updated);
    setCoffeePunches(saved);
    setCoffeeConfirmation("Coffee punch added.");
  };

  const handleClaimCoffee = () => {
    if (!coffeeClaimAvailable) {
      return;
    }

    const saved = saveCoffeeClubPunches(resetClubPunches());
    setCoffeePunches(saved);
    setCoffeeConfirmation("Free coffee claimed. Punch card reset.");
  };

  const handleCarWashPunch = () => {
    const updated = addClubPunch(carWashPunches, CAR_WASH_CLUB_TARGET_PUNCHES);
    const saved = saveCarWashClubPunches(updated);
    setCarWashPunches(saved);
    setCarWashConfirmation("Car wash punch added.");
  };

  const handleClaimCarWash = () => {
    if (!carWashClaimAvailable) {
      return;
    }

    const saved = saveCarWashClubPunches(resetClubPunches());
    setCarWashPunches(saved);
    setCarWashConfirmation("Free car wash claimed. Punch card reset.");
  };

  if (!hydrated || !user) {
    return <p className="rounded-2xl border bg-card p-4 text-sm text-muted-foreground">Loading redeem flow…</p>;
  }

  return (
    <section className="space-y-5 pb-8">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Redeem rewards</p>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Redeem</h1>
        <p className="text-sm text-muted-foreground">Current balance: {pointsBalance} pts</p>
      </header>

      <article className="space-y-4 rounded-2xl border bg-card p-4 shadow-sm">
        <div>
          <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">Fuel discount</h2>
          <p className="text-xs text-muted-foreground">
            Minimum {FUEL_REDEEM_MIN_POINTS} pts. Every {FUEL_REDEEM_STEP_POINTS} pts gives 1c/L off.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-foreground">{fuelRedeemPoints} pts</p>
            <p className="text-sm font-semibold" style={{ color: "var(--brand-dark)" }}>
              {selectedCentsOff}c/L off
            </p>
          </div>
          <input
            type="range"
            min={FUEL_REDEEM_MIN_POINTS}
            max={fuelRedeemSliderMax}
            step={FUEL_REDEEM_STEP_POINTS}
            value={fuelRedeemPoints}
            disabled={!canRedeemFuel}
            onChange={(event) => setFuelRedeemPoints(Number(event.target.value))}
            aria-label="Fuel discount points slider"
            className="w-full accent-[var(--brand-primary)]"
          />
        </div>

        {!canRedeemFuel ? (
          <p className="text-sm font-medium text-muted-foreground">Need at least 500 pts to redeem.</p>
        ) : null}

        <button
          type="button"
          onClick={handleFuelRedeem}
          disabled={!canRedeemFuel}
          className="inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
          style={{ backgroundColor: brand.colors.primary }}
        >
          Redeem fuel discount
        </button>

        {fuelConfirmation ? (
          <p className="rounded-xl border px-3 py-2 text-sm font-medium" style={{ borderColor: "var(--brand-primary)" }} role="status">
            {fuelConfirmation}
          </p>
        ) : null}
      </article>

      <article className="space-y-4 rounded-2xl border bg-card p-4 shadow-sm">
        <div>
          <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">Coffee Club</h2>
          <p className="text-xs text-muted-foreground">{coffeePunches}/{COFFEE_CLUB_TARGET_PUNCHES} punches</p>
        </div>

        <PunchSlots total={COFFEE_CLUB_TARGET_PUNCHES} filled={coffeePunches} label="Coffee Club punch card" />

        {coffeeClaimAvailable ? (
          <button
            type="button"
            onClick={handleClaimCoffee}
            className="inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
            style={{ backgroundColor: brand.colors.primary }}
          >
            Claim free coffee
          </button>
        ) : (
          <button
            type="button"
            onClick={handleCoffeePunch}
            className="inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
            style={{ backgroundColor: brand.colors.primary }}
          >
            I bought a coffee
          </button>
        )}

        {coffeeConfirmation ? (
          <p className="rounded-xl border px-3 py-2 text-sm font-medium" style={{ borderColor: "var(--brand-primary)" }} role="status">
            {coffeeConfirmation}
          </p>
        ) : null}
      </article>

      <article className="space-y-4 rounded-2xl border bg-card p-4 shadow-sm">
        <div>
          <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">Car Wash Club</h2>
          <p className="text-xs text-muted-foreground">{carWashPunches}/{CAR_WASH_CLUB_TARGET_PUNCHES} punches</p>
        </div>

        <PunchSlots total={CAR_WASH_CLUB_TARGET_PUNCHES} filled={carWashPunches} label="Car Wash Club punch card" />

        {carWashClaimAvailable ? (
          <button
            type="button"
            onClick={handleClaimCarWash}
            className="inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
            style={{ backgroundColor: brand.colors.primary }}
          >
            Claim free car wash
          </button>
        ) : (
          <button
            type="button"
            onClick={handleCarWashPunch}
            className="inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
            style={{ backgroundColor: brand.colors.primary }}
          >
            I bought a car wash
          </button>
        )}

        {carWashConfirmation ? (
          <p className="rounded-xl border px-3 py-2 text-sm font-medium" style={{ borderColor: "var(--brand-primary)" }} role="status">
            {carWashConfirmation}
          </p>
        ) : null}
      </article>
    </section>
  );
}
