"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { House, MapPin, ReceiptText, Wallet, WalletCards } from "lucide-react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ApplegreenLogo } from "@/components/brand/applegreen-logo";
import { brand } from "@/lib/brand";
import { pwaNavItems, resolveAppAuthRedirect } from "@/lib/loyalty/shell";
import { readLoyaltyUser, resetLoyaltyUser, type LoyaltyUser } from "@/lib/loyalty/storage";

type PwaSessionContextValue = {
  hydrated: boolean;
  user: LoyaltyUser | null;
  setUser: (user: LoyaltyUser | null) => void;
};

const PwaSessionContext = createContext<PwaSessionContextValue | null>(null);

const iconMap = {
  home: House,
  earn: ReceiptText,
  redeem: WalletCards,
  stations: MapPin,
  wallet: Wallet,
} as const;

export function usePwaSession() {
  const context = useContext(PwaSessionContext);

  if (!context) {
    throw new Error("usePwaSession must be used within PwaShell");
  }

  return context;
}

type PwaShellProps = {
  children: React.ReactNode;
};

export function PwaShell({ children }: PwaShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [hydrated, setHydrated] = useState(false);
  const [user, setUser] = useState<LoyaltyUser | null>(null);

  const isOnboardingRoute = pathname === "/app/onboarding";
  const activePath = pathname ?? "/app";

  useEffect(() => {
    setUser(readLoyaltyUser());
    setHydrated(true);
  }, []);

  const redirectPath = hydrated ? resolveAppAuthRedirect(activePath, Boolean(user)) : null;

  useEffect(() => {
    if (!hydrated || !redirectPath || activePath === redirectPath) {
      return;
    }

    router.replace(redirectPath);
  }, [activePath, hydrated, redirectPath, router]);

  const sessionValue = useMemo(
    () => ({
      hydrated,
      user,
      setUser,
    }),
    [hydrated, user],
  );

  const showNav = hydrated && Boolean(user) && !isOnboardingRoute;

  const handleSignOut = () => {
    resetLoyaltyUser();
    setUser(null);
    router.replace("/app/onboarding");
  };

  return (
    <PwaSessionContext.Provider value={sessionValue}>
      <div className="mx-auto min-h-screen w-full max-w-[393px] overflow-x-clip bg-background pb-24 text-foreground">
        <header className="sticky top-0 z-30 border-b bg-white/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/90">
          <div className="flex items-center justify-between gap-2">
            <Link
              href="/app"
              aria-label="Applegreen app home"
              className="inline-flex items-center rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ outlineColor: brand.colors.primary }}
            >
              <ApplegreenLogo />
            </Link>
            {hydrated && user && !isOnboardingRoute ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-full border px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ outlineColor: brand.colors.primary }}
              >
                Sign out
              </button>
            ) : null}
          </div>
        </header>

        <main className="px-4 pb-4 pt-4">
          {!hydrated || (redirectPath && redirectPath !== activePath) ? (
            <p className="rounded-2xl border bg-card p-4 text-sm text-muted-foreground">Loading your rewards app…</p>
          ) : (
            children
          )}
        </main>

        {showNav ? (
          <nav
            aria-label="Primary app navigation"
            className="fixed bottom-0 left-1/2 z-40 w-full max-w-[393px] -translate-x-1/2 border-t bg-white/95 px-2 pb-2 pt-1 backdrop-blur supports-[backdrop-filter]:bg-white/90"
          >
            <ul className="grid grid-cols-5 gap-1">
              {pwaNavItems.map((item) => {
                const Icon = iconMap[item.icon];
                const isActive = item.href === "/app" ? activePath === "/app" : activePath.startsWith(item.href);
                const activeColor = isActive ? brand.colors.primary : "rgb(82 82 91)";

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex min-h-[56px] flex-col items-center justify-center rounded-xl px-1 py-2 text-center text-[11px] font-semibold leading-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                      style={{ color: activeColor, outlineColor: brand.colors.primary }}
                    >
                      <Icon aria-hidden className="mb-1 h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        ) : null}
      </div>
    </PwaSessionContext.Provider>
  );
}
