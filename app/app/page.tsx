import { brand } from "@/lib/brand";

const prototypeTabs = ["Home", "Earn", "Redeem", "Stations", "Wallet"] as const;

export default function AppPrototypePage() {
  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground">
      <div className="mx-auto flex w-full max-w-sm flex-col gap-6 rounded-3xl border bg-white p-5 shadow-sm">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Live prototype</p>
          <h1 className="font-heading text-xl font-semibold tracking-tight">Applegreen Rewards app shell</h1>
          <p className="text-sm text-muted-foreground">
            Welcome to the interactive prototype. Core flows are shipping in the next milestone.
          </p>
        </header>

        <section className="rounded-2xl border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Member preview</p>
          <p className="mt-2 text-sm text-foreground">Points: 0 · Tier: Bronze</p>
        </section>

        <nav aria-label="Prototype navigation" className="grid grid-cols-5 gap-2 rounded-2xl border bg-card p-2">
          {prototypeTabs.map((tab, index) => (
            <span
              key={tab}
              className="inline-flex items-center justify-center rounded-xl px-2 py-2 text-xs font-semibold"
              style={{
                backgroundColor: index === 0 ? brand.colors.primary : "transparent",
                color: index === 0 ? brand.colors.white : "rgb(75 85 99)",
              }}
            >
              {tab}
            </span>
          ))}
        </nav>
      </div>
    </main>
  );
}
