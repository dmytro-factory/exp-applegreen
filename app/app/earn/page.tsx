"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { usePwaSession } from "@/components/pwa/pwa-shell";
import { brand } from "@/lib/brand";
import { EARN_TYPES, type EarnType, findEarnTypeOption, isPositiveEarnAmount, resolveEarnUpdate } from "@/lib/loyalty/earn";
import { saveLoyaltyUser } from "@/lib/loyalty/storage";

export default function EarnPage() {
  const { hydrated, user, setUser } = usePwaSession();

  const [earnType, setEarnType] = useState<EarnType>("fuel");
  const [amountInput, setAmountInput] = useState(findEarnTypeOption("fuel").defaultAmount);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [animatedPoints, setAnimatedPoints] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastEarnedPoints, setLastEarnedPoints] = useState<number | null>(null);
  const [tierUpgradeMessage, setTierUpgradeMessage] = useState<string | null>(null);

  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tierBadgeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedOption = useMemo(() => findEarnTypeOption(earnType), [earnType]);
  const amountNumber = Number(amountInput);
  const canSubmit = Boolean(user) && !isAnimating && isPositiveEarnAmount(amountNumber);

  useEffect(() => {
    setAmountInput(selectedOption.defaultAmount);
    setValidationMessage(null);
  }, [selectedOption]);

  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      if (tierBadgeTimeoutRef.current) {
        clearTimeout(tierBadgeTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      return;
    }

    if (!isPositiveEarnAmount(amountNumber)) {
      setValidationMessage("Enter a positive amount before scanning the receipt.");
      return;
    }

    const outcome = resolveEarnUpdate(user, earnType, amountNumber);
    if (outcome.earnedPoints <= 0) {
      setValidationMessage("Enter a larger amount to earn at least 1 point.");
      return;
    }

    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    setValidationMessage(null);
    setIsAnimating(true);
    setAnimatedPoints(outcome.earnedPoints);
    setLastEarnedPoints(null);
    setTierUpgradeMessage(null);

    animationTimeoutRef.current = setTimeout(() => {
      const savedUser = saveLoyaltyUser(outcome.updatedUser);
      setUser(savedUser);
      setIsAnimating(false);
      setAnimatedPoints(null);
      setLastEarnedPoints(outcome.earnedPoints);

      if (outcome.tierUpgraded) {
        setTierUpgradeMessage(`Tier upgrade unlocked: Welcome to ${savedUser.tier}!`);

        if (tierBadgeTimeoutRef.current) {
          clearTimeout(tierBadgeTimeoutRef.current);
        }

        tierBadgeTimeoutRef.current = setTimeout(() => {
          setTierUpgradeMessage(null);
        }, 3500);
      }
    }, 1200);
  };

  if (!hydrated || !user) {
    return <p className="rounded-2xl border bg-card p-4 text-sm text-muted-foreground">Loading earn flow…</p>;
  }

  return (
    <section className="space-y-5 pb-8">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Earn points</p>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Scan receipt</h1>
        <p className="text-sm text-muted-foreground">Current balance: {user.points} pts</p>
      </header>

      <article className="rounded-2xl border bg-card p-4 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">Earn type</h2>
        <ul className="mt-3 grid gap-2">
          {EARN_TYPES.map((option) => {
            const isSelected = option.value === earnType;

            return (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => setEarnType(option.value)}
                  aria-pressed={isSelected}
                  className="w-full rounded-xl border px-3 py-2 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{
                    borderColor: isSelected ? "var(--brand-primary)" : "rgb(212 212 216)",
                    backgroundColor: isSelected ? "rgb(245 250 238)" : "white",
                    outlineColor: "var(--brand-primary)",
                  }}
                >
                  <p className="text-sm font-semibold text-foreground">{option.label}</p>
                  <p className="text-xs text-muted-foreground">{option.helperText}</p>
                </button>
              </li>
            );
          })}
        </ul>
      </article>

      <form className="space-y-3 rounded-2xl border bg-card p-4 shadow-sm" onSubmit={handleSubmit} noValidate>
        <label htmlFor="earn-amount" className="text-sm font-medium text-foreground">
          {selectedOption.amountLabel}
        </label>
        <div className="flex items-center gap-2">
          <input
            id="earn-amount"
            name="amount"
            inputMode="decimal"
            value={amountInput}
            onChange={(event) => {
              setAmountInput(event.target.value);
              if (validationMessage) {
                setValidationMessage(null);
              }
            }}
            step={selectedOption.step}
            min="0"
            className="w-full rounded-xl border bg-white px-3 py-2 text-sm text-foreground outline-none transition-shadow focus-visible:ring-2"
            style={{ borderColor: "rgb(212 212 216)", boxShadow: "none", caretColor: brand.colors.primary }}
          />
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">{selectedOption.amountSuffix}</span>
        </div>

        {validationMessage ? (
          <p className="text-sm font-medium text-red-600" role="alert">
            {validationMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
          style={{ backgroundColor: brand.colors.primary }}
        >
          Scan receipt
        </button>
      </form>

      <div aria-live="polite" className="min-h-12">
        <AnimatePresence>
          {isAnimating && animatedPoints ? (
            <motion.div
              key={`earn-animation-${animatedPoints}`}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: -4, scale: 1.03 }}
              exit={{ opacity: 0, y: -20, scale: 1 }}
              transition={{ duration: 0.35, repeat: 1, repeatType: "reverse" }}
              className="rounded-xl border px-4 py-3 text-center text-lg font-semibold"
              style={{ borderColor: "var(--brand-primary)", color: "var(--brand-dark)", backgroundColor: "rgb(245 250 238)" }}
            >
              +{animatedPoints} pts
            </motion.div>
          ) : null}
        </AnimatePresence>

        {!isAnimating && lastEarnedPoints ? (
          <p className="mt-2 text-center text-sm text-muted-foreground">Added +{lastEarnedPoints} pts to your account.</p>
        ) : null}
      </div>

      <AnimatePresence>
        {tierUpgradeMessage ? (
          <motion.div
            key={tierUpgradeMessage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border px-4 py-3 text-sm font-semibold"
            style={{ borderColor: "var(--brand-primary)", color: "var(--brand-dark)", backgroundColor: "rgb(245 250 238)" }}
            role="status"
          >
            {tierUpgradeMessage}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
