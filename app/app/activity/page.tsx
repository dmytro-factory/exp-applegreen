"use client";

import { Gift, Zap } from "lucide-react";
import { BackBar } from "@/components/charging/chrome";
import { useCharging } from "@/components/charging/context";
import { CURRENCY_SYMBOLS, formatConnector } from "@/lib/charging/model";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function ActivityPage() {
  const { account } = useCharging();
  if (!account) {
    return null;
  }

  const empty = account.activity.length === 0 && account.redemptions.length === 0;

  return (
    <div className="pb-6">
      <BackBar title="Activity" />
      <div className="space-y-3 px-4 pt-4">
        {empty ? (
          <p className="rounded-2xl bg-white p-4 text-sm text-muted-foreground">
            No activity yet. Start a charge to earn your first points.
          </p>
        ) : null}

        {account.activity.map((item) => (
          <div key={item.id} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-[0_6px_16px_rgba(20,32,60,0.08)]">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: "var(--brand-badge-bg)" }}>
              <Zap className="h-5 w-5 text-[#006551]" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-[#1A1A1A]">{item.stationName}</p>
              <p className="text-xs text-muted-foreground">
                {formatConnector(item.connector)} · {item.kwh} kWh · {formatDate(item.dateIso)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-[#1A1A1A]">{CURRENCY_SYMBOLS[item.currency]}{item.cost.toFixed(2)}</p>
              <p className="text-xs font-semibold text-[#006551]">+{item.pointsEarned} pts</p>
            </div>
          </div>
        ))}

        {account.redemptions.map((item) => (
          <div key={item.id} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-[0_6px_16px_rgba(20,32,60,0.08)]">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDEBD0]">
              <Gift className="h-5 w-5 text-[#B8860B]" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-[#1A1A1A]">{item.title}</p>
              <p className="text-xs text-muted-foreground">Redeemed · {formatDate(item.dateIso)}</p>
            </div>
            <p className="text-sm font-semibold text-[#B8860B]">-{item.pointsSpent} pts</p>
          </div>
        ))}
      </div>
    </div>
  );
}
