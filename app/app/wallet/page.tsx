"use client";

import { useMemo } from "react";
import { usePwaSession } from "@/components/pwa/pwa-shell";
import { PlaceholderScreen } from "@/components/pwa/placeholder-screen";

export default function WalletPage() {
  const { user } = usePwaSession();

  const walletHref = useMemo(() => {
    const member = user?.name ? encodeURIComponent(user.name) : "guest";
    const points = user?.points ?? 0;
    return `/api/wallet/pass?member=${member}&points=${points}`;
  }, [user]);

  return (
    <div className="space-y-4">
      <PlaceholderScreen
        title="Wallet"
        description="Wallet pass details and Simulator-only disclaimers are completed in the wallet milestone."
      />

      <a
        href={walletHref}
        className="inline-flex w-full items-center justify-center rounded-xl border bg-white px-4 py-3 text-sm font-semibold text-foreground"
      >
        Add to Apple Wallet
      </a>
    </div>
  );
}
