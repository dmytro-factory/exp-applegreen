export type PwaNavItem = {
  label: "Home" | "Earn" | "Redeem" | "Stations" | "Wallet";
  href: "/app" | "/app/earn" | "/app/redeem" | "/app/stations" | "/app/wallet";
  icon: "home" | "earn" | "redeem" | "stations" | "wallet";
};

export const pwaNavItems: PwaNavItem[] = [
  { label: "Home", href: "/app", icon: "home" },
  { label: "Earn", href: "/app/earn", icon: "earn" },
  { label: "Redeem", href: "/app/redeem", icon: "redeem" },
  { label: "Stations", href: "/app/stations", icon: "stations" },
  { label: "Wallet", href: "/app/wallet", icon: "wallet" },
];

const onboardingPath = "/app/onboarding";
const homePath = "/app";

function normalizePathname(pathname: string): string {
  if (!pathname || pathname === "/") {
    return pathname;
  }

  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

export function resolveAppAuthRedirect(pathname: string, hasUser: boolean): string | null {
  const normalizedPathname = normalizePathname(pathname);

  if (!hasUser && normalizedPathname !== onboardingPath) {
    return onboardingPath;
  }

  if (hasUser && normalizedPathname === onboardingPath) {
    return homePath;
  }

  return null;
}
