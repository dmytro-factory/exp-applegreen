"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePwaSession } from "@/components/pwa/pwa-shell";
import { brand } from "@/lib/brand";
import {
  PARCELCONNECT_NOTIFICATION_COPY,
  PARTNER_OFFERS,
  ROAD_TRIP_CTA_HREF,
  TODAYS_OFFERS,
  getTierProgress,
} from "@/lib/loyalty/home";
import { readParcelconnectDismissed, saveParcelconnectDismissed } from "@/lib/loyalty/storage";

export default function AppHomePage() {
  const { user } = usePwaSession();
  const [parcelDismissed, setParcelDismissed] = useState<boolean | null>(null);

  const points = user?.points ?? 0;
  const greetingName = user?.name ?? "there";
  const tierProgress = useMemo(() => getTierProgress(points), [points]);

  useEffect(() => {
    setParcelDismissed(readParcelconnectDismissed());
  }, []);

  const nextTier = tierProgress.tier === "Bronze" ? "Silver" : tierProgress.tier === "Silver" ? "Gold" : null;

  const dismissParcelBanner = () => {
    saveParcelconnectDismissed(true);
    setParcelDismissed(true);
  };

  return (
    <section className="space-y-5 pb-8">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Rewards home</p>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Hi, {greetingName}.
        </h1>
        <p className="text-sm text-muted-foreground">Your Applegreen rewards are ready for today&apos;s journey.</p>
      </header>

      <article className="rounded-2xl border bg-card p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Points balance</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{points} pts</p>
          </div>
          <span
            className="inline-flex rounded-full px-3 py-1 text-xs font-semibold text-white"
            style={{ backgroundColor: "var(--brand-primary)" }}
          >
            {tierProgress.tier}
          </span>
        </div>

        {tierProgress.tier === "Gold" ? (
          <p className="mt-3 rounded-xl bg-muted px-3 py-2 text-xs font-medium text-foreground">
            Gold unlocked — top tier reached.
          </p>
        ) : (
          <div className="mt-4 space-y-2">
            <div
              className="h-2.5 w-full overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-label="Tier progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={tierProgress.percent}
            >
              <div
                className="h-full rounded-full transition-[width]"
                style={{
                  width: `${tierProgress.percent}%`,
                  backgroundColor: brand.colors.primary,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {tierProgress.remainingPoints} pts to {nextTier}
            </p>
          </div>
        )}
      </article>

      {parcelDismissed === false ? (
        <section
          className="rounded-2xl border p-4 shadow-sm"
          style={{ borderColor: "var(--brand-primary)", backgroundColor: "rgb(245 250 238)" }}
          aria-label="Parcelconnect notification"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--brand-dark)" }}>
                Parcelconnect
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">{PARCELCONNECT_NOTIFICATION_COPY}</p>
            </div>
            <button
              type="button"
              onClick={dismissParcelBanner}
              aria-label="Dismiss parcel notification"
              className="rounded-full border bg-white px-2 py-1 text-xs font-semibold text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ outlineColor: "var(--brand-primary)" }}
            >
              ✕
            </button>
          </div>
        </section>
      ) : null}

      <section className="space-y-2" aria-label="Today's offers carousel">
        <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">Today&apos;s Offers</h2>
        <div className="-mx-1 overflow-x-auto pb-1">
          <ul className="flex min-w-max gap-3 px-1">
            {TODAYS_OFFERS.map((offer) => (
              <li key={offer.title} className="w-[250px] shrink-0 rounded-2xl border bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--brand-primary)" }}>
                  {offer.badge}
                </p>
                <h3 className="mt-2 text-base font-semibold text-foreground">{offer.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{offer.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-2" aria-label="Partner offers carousel">
        <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">Partner offers</h2>
        <div className="-mx-1 overflow-x-auto pb-1">
          <ul className="flex min-w-max gap-3 px-1">
            {PARTNER_OFFERS.map((partner) => (
              <li key={partner.name} className="w-[250px] shrink-0 rounded-2xl border bg-card p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <Image
                    src={partner.logoSrc}
                    alt={`${partner.name} logo`}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-md border bg-white p-0.5"
                  />
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{partner.name}</h3>
                    <p className="text-xs text-muted-foreground">{partner.discountLabel}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Road-trip planner</p>
        <h2 className="mt-1 font-heading text-lg font-semibold tracking-tight text-foreground">Plan your next stop route</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Build a quick motorway plan with family-friendly Applegreen stops and open it in Google Maps.
        </p>
        <Link
          href={ROAD_TRIP_CTA_HREF}
          className="mt-3 inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ backgroundColor: "var(--brand-primary)", outlineColor: "var(--brand-primary)" }}
        >
          Plan a road trip
        </Link>
      </section>
    </section>
  );
}
