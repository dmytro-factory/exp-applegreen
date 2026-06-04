"use client";

import { useMemo } from "react";
import { usePwaSession } from "@/components/pwa/pwa-shell";
import { buildWalletPassHref } from "@/lib/wallet/cta";

export default function WalletPage() {
  const { user } = usePwaSession();

  const walletHref = useMemo(() => buildWalletPassHref(user), [user]);

  return (
    <div className="space-y-4 rounded-2xl border bg-card p-4 shadow-sm">
      <div className="space-y-2">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Apple Wallet pass</h1>
        <p className="text-sm text-muted-foreground">
          Add your Applegreen Rewards pass to Wallet for this demo environment.
        </p>
      </div>

      <a
        href={walletHref}
        className="inline-flex w-full items-center justify-center rounded-xl border bg-white px-4 py-3 text-sm font-semibold text-foreground"
      >
        Add to Apple Wallet
      </a>

      <p className="rounded-xl border border-dashed border-border bg-white px-3 py-3 text-sm text-muted-foreground">
        This pass is <strong>self-signed</strong> and <strong>Simulator only</strong>. It won&apos;t install on real
        iPhones.
      </p>
    </div>
  );
}
