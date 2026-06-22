"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Gift, List, Map as MapIcon, User } from "lucide-react";
import { useEffect } from "react";
import { ApplegreenLogo } from "@/components/brand/applegreen-logo";
import { useCharging } from "@/components/charging/context";

const NAV_ITEMS = [
  { href: "/app/map", label: "Map", icon: MapIcon },
  { href: "/app", label: "List", icon: List },
  { href: "/app/rewards", label: "Rewards", icon: Gift },
  { href: "/app/profile", label: "Profile", icon: User },
] as const;

function isActive(href: string, pathname: string): boolean {
  if (href === "/app") {
    return pathname === "/app";
  }
  if (href === "/app/rewards") {
    return pathname.startsWith("/app/rewards") || pathname.startsWith("/app/activity");
  }
  if (href === "/app/profile") {
    return pathname.startsWith("/app/profile") || pathname.startsWith("/app/vehicles");
  }
  return pathname.startsWith(href);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/app";
  const router = useRouter();
  const { hydrated, account } = useCharging();

  const isAuthRoute = pathname === "/app/auth";
  const isChargingRoute = pathname.startsWith("/app/charge/");

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    if (!account && !isAuthRoute) {
      router.replace("/app/auth");
    }
    if (account && isAuthRoute) {
      router.replace("/app");
    }
  }, [hydrated, account, isAuthRoute, router]);

  const showChrome = hydrated && Boolean(account) && !isAuthRoute && !isChargingRoute;

  return (
    <div className="flex min-h-screen w-full justify-center bg-[#0d1117] sm:items-center sm:p-6">
      <div
        className="relative flex h-[100dvh] w-full max-w-[400px] flex-col overflow-hidden sm:h-[860px] sm:max-h-[calc(100dvh-3rem)] sm:rounded-[2.75rem] sm:border-[11px] sm:border-black sm:shadow-2xl"
        style={{ backgroundColor: "var(--brand-app-bg)" }}
      >
        {showChrome ? (
          <header className="z-30 flex shrink-0 items-center justify-between gap-2 border-b border-[var(--brand-hairline,#e3e7f2)] bg-white/95 px-4 py-3 backdrop-blur">
            <Link href="/app" aria-label="Applegreen Fast Charge home" className="inline-flex items-center">
              <ApplegreenLogo />
            </Link>
            <Link
              href="/"
              className="rounded-full border px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
            >
              About
            </Link>
          </header>
        ) : null}

        <main className="min-h-0 flex-1 overflow-y-auto">
          {!hydrated ? (
            <div className="flex h-full items-center justify-center px-6 text-sm text-muted-foreground">
              Loading Fast Charge…
            </div>
          ) : (
            children
          )}
        </main>

        {showChrome ? (
          <nav
            aria-label="Primary navigation"
            className="z-40 shrink-0 border-t border-[var(--brand-hairline,#e3e7f2)] bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 backdrop-blur"
          >
            <ul className="grid grid-cols-4">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href, pathname);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[11px] font-semibold"
                      style={{ color: active ? "var(--brand-primary)" : "#6b7280" }}
                    >
                      <Icon aria-hidden className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        ) : null}
      </div>
    </div>
  );
}
