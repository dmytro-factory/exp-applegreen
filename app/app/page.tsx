"use client";

import { usePwaSession } from "@/components/pwa/pwa-shell";
import { brand } from "@/lib/brand";

export default function AppHomePage() {
  const { user } = usePwaSession();

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Rewards home</p>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Hi, {user?.name ?? "there"}.
        </h1>
        <p className="text-sm text-muted-foreground">Your Applegreen loyalty profile is saved on this device.</p>
      </header>

      <article className="rounded-2xl border bg-card p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Current balance</p>
        <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{user?.points ?? 0} pts</p>
        <p className="mt-1 text-sm text-foreground">
          Tier:{" "}
          <span className="font-semibold" style={{ color: brand.colors.primary }}>
            {user?.tier ?? "Bronze"}
          </span>
        </p>
      </article>

      <div className="space-y-3 pb-12">
        {[
          "Navigate with the bottom tabs to preview shell routes.",
          "Earn and redeem interactions land in the next milestone.",
          "Road-trip and station experiences are scaffolded for upcoming features.",
          "Wallet linking stays available under the Wallet tab.",
          "This home screen is intentionally long to validate sticky bottom navigation behavior.",
          "All app state in this milestone is persisted in localStorage under the applegreen namespace.",
        ].map((note) => (
          <p key={note} className="rounded-xl border bg-white p-3 text-sm text-muted-foreground">
            {note}
          </p>
        ))}
      </div>
    </section>
  );
}
