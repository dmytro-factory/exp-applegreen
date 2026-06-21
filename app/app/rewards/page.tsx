"use client";

import Link from "next/link";
import { Award, ChevronRight, Gift, Sparkles } from "lucide-react";
import { useCharging } from "@/components/charging/context";
import { REWARDS, nextTierProgress, redeemReward, tierFromPoints } from "@/lib/loyalty/charging";

export default function RewardsPage() {
  const { account, updateAccount } = useCharging();
  if (!account) {
    return null;
  }

  const tier = tierFromPoints(account.points);
  const progress = nextTierProgress(account.points);

  const onRedeem = (rewardId: string) => {
    const reward = REWARDS.find((item) => item.id === rewardId);
    if (!reward) {
      return;
    }
    const { account: next, ok } = redeemReward(account, reward);
    if (ok) {
      updateAccount(next);
    }
  };

  return (
    <div className="space-y-5 px-4 py-4">
      <div className="rounded-3xl p-5 text-white shadow-lg" style={{ background: "linear-gradient(135deg, #006551 0%, #00402F 100%)" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-[#62A60E]" />
            <span className="text-sm font-semibold">{tier} member</span>
          </div>
          <Sparkles className="h-5 w-5 text-white/70" />
        </div>
        <p className="mt-4 font-heading text-4xl font-bold">{account.points.toLocaleString()}</p>
        <p className="text-sm text-white/75">points balance</p>

        <div className="mt-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
            <div className="h-full rounded-full bg-[#62A60E]" style={{ width: `${Math.round(progress.ratio * 100)}%` }} />
          </div>
          <p className="mt-2 text-xs text-white/75">
            {progress.next ? `${progress.pointsToNext} points to ${progress.next}` : "Top tier reached"}
          </p>
        </div>
      </div>

      <Link
        href="/app/activity"
        className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-[0_6px_16px_rgba(20,32,60,0.08)]"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: "var(--brand-badge-bg)" }}>
          <Gift className="h-5 w-5 text-[#006551]" />
        </span>
        <span className="flex-1">
          <span className="block text-sm font-semibold text-[#1A1A1A]">Charging activity</span>
          <span className="block text-xs text-muted-foreground">{account.activity.length} sessions logged</span>
        </span>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </Link>

      <section>
        <h2 className="px-1 pb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Redeem</h2>
        <div className="space-y-3">
          {REWARDS.map((reward) => {
            const affordable = account.points >= reward.cost;
            return (
              <div key={reward.id} className="rounded-2xl bg-white p-4 shadow-[0_6px_16px_rgba(20,32,60,0.08)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-[#1A1A1A]">{reward.title}</p>
                    <p className="text-xs text-muted-foreground">{reward.description}</p>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-[#006551]">{reward.cost}</span>
                </div>
                <button
                  type="button"
                  disabled={!affordable}
                  onClick={() => onRedeem(reward.id)}
                  className="mt-3 w-full rounded-full py-2.5 text-sm font-semibold text-white disabled:opacity-40"
                  style={{ backgroundColor: "var(--brand-primary)" }}
                >
                  {affordable ? "Redeem" : `Need ${reward.cost - account.points} more`}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
