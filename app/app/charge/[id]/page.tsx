"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { BatteryCharging, Check, Gift } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCharging } from "@/components/charging/context";
import { SwipeToStart } from "@/components/charging/swipe-to-start";
import { CURRENCY_SYMBOLS, formatConnector, formatKw } from "@/lib/charging/model";
import { pointsForKwh, recordChargeSession } from "@/lib/loyalty/charging";

type Phase = "ready" | "charging" | "complete";

const TARGET_SOC = 80;
const START_SOC = 22;
const TICK_MS = 250;
const SOC_PER_TICK = 1.4;

export default function ChargePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { getCharger, getStation, account, updateAccount } = useCharging();

  const charger = getCharger(params.id);
  const station = charger ? getStation(charger.stationId) : undefined;

  const [phase, setPhase] = useState<Phase>("ready");
  const [soc, setSoc] = useState(START_SOC);
  const recordedRef = useRef(false);

  const batteryKwh = 60;
  const kwhDelivered = ((soc - START_SOC) / 100) * batteryKwh;
  const cost = charger ? kwhDelivered * charger.pricePerKwh : 0;
  const earned = pointsForKwh(kwhDelivered);

  useEffect(() => {
    if (phase !== "charging") {
      return;
    }
    const interval = window.setInterval(() => {
      setSoc((current) => {
        const next = current + SOC_PER_TICK;
        if (next >= TARGET_SOC) {
          window.clearInterval(interval);
          setPhase("complete");
          return TARGET_SOC;
        }
        return next;
      });
    }, TICK_MS);
    return () => window.clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase !== "complete" || recordedRef.current || !charger || !station || !account) {
      return;
    }
    recordedRef.current = true;
    const finalKwh = ((TARGET_SOC - START_SOC) / 100) * batteryKwh;
    const { account: next } = recordChargeSession(account, {
      stationId: station.id,
      stationName: station.name,
      connector: charger.connectorType,
      kwh: Math.round(finalKwh * 10) / 10,
      cost: Math.round(finalKwh * charger.pricePerKwh * 100) / 100,
      currency: station.currency,
    });
    updateAccount(next);
  }, [phase, charger, station, account, updateAccount]);

  if (!charger || !station) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Charger not found. <Link href="/app" className="font-semibold text-[#006551]">Back</Link>
      </div>
    );
  }

  const symbol = CURRENCY_SYMBOLS[station.currency];
  const livePower = phase === "charging" ? Math.min(charger.maxKw, Math.round(charger.maxKw * (1 - soc / 140))) : charger.maxKw;

  return (
    <div className="flex min-h-screen flex-col px-6 pb-10 pt-12 text-white" style={{ background: "linear-gradient(180deg, #006551 0%, #00402F 100%)" }}>
      <header className="text-center">
        <p className="text-sm text-white/70">{station.name}</p>
        <h1 className="font-heading text-lg font-semibold">{formatConnector(charger.connectorType)} · {formatKw(charger.maxKw)}</h1>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center">
        {phase === "complete" ? (
          <span className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-white/15">
            <Check className="h-12 w-12 text-white" />
          </span>
        ) : (
          <div className="relative mb-5 flex h-44 w-44 items-center justify-center rounded-full" style={{ background: `conic-gradient(#62A60E ${soc}%, rgba(255,255,255,0.15) ${soc}% 100%)` }}>
            <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-[#00402F]">
              <BatteryCharging className="mb-1 h-6 w-6 text-[#62A60E]" />
              <span className="font-heading text-4xl font-bold">{Math.round(soc)}%</span>
              <span className="text-xs text-white/70">battery</span>
            </div>
          </div>
        )}

        <div className="grid w-full max-w-[300px] grid-cols-3 gap-2 text-center">
          <Stat label="Power" value={`${livePower}kW`} />
          <Stat label="Delivered" value={`${kwhDelivered.toFixed(1)} kWh`} />
          <Stat label="Cost" value={`${symbol}${cost.toFixed(2)}`} />
        </div>

        {phase === "complete" ? (
          <div className="mt-6 flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
            <Gift className="h-4 w-4 text-[#62A60E]" /> +{earned} points earned
          </div>
        ) : null}
      </div>

      <div className="space-y-3">
        {phase === "ready" ? (
          <SwipeToStart onComplete={() => setPhase("charging")} />
        ) : null}
        {phase === "charging" ? (
          <button
            type="button"
            onClick={() => setPhase("complete")}
            className="w-full rounded-full bg-white/15 py-4 text-sm font-semibold"
          >
            Stop charging
          </button>
        ) : null}
        {phase === "complete" ? (
          <button
            type="button"
            onClick={() => router.push("/app")}
            className="w-full rounded-full bg-white py-4 text-sm font-semibold text-[#006551]"
          >
            Done
          </button>
        ) : null}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 px-2 py-3">
      <p className="font-heading text-base font-bold">{value}</p>
      <p className="text-[11px] text-white/70">{label}</p>
    </div>
  );
}
