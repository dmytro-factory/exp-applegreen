"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { MapPin, PlugZap, Zap } from "lucide-react";
import { AvailabilityBadge } from "@/components/charging/availability-badge";
import { BackBar } from "@/components/charging/chrome";
import { useCharging } from "@/components/charging/context";
import {
  CHARGER_STATUS_LABELS,
  SPEED_TIER_LABELS,
  formatConnector,
  formatKw,
  formatPrice,
  speedTier,
} from "@/lib/charging/model";

export default function ChargerDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { getCharger, getStation } = useCharging();

  const charger = getCharger(params.id);
  const station = charger ? getStation(charger.stationId) : undefined;

  if (!charger || !station) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Charger not found. <Link href="/app" className="font-semibold text-[#006551]">Back to list</Link>
      </div>
    );
  }

  const available = charger.countAvailable > 0 && charger.status !== "offline";

  return (
    <div className="pb-6">
      <BackBar title={formatConnector(charger.connectorType)} />

      <div className="space-y-4 px-4 pt-4">
        <div className="rounded-3xl bg-white p-5 text-center shadow-[0_6px_16px_rgba(20,32,60,0.08)]">
          <span className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ backgroundColor: "var(--brand-badge-bg)" }}>
            <PlugZap className="h-8 w-8 text-[#006551]" />
          </span>
          <p className="font-heading text-2xl font-bold text-[#1A1A1A]">{formatKw(charger.maxKw)}</p>
          <p className="text-sm text-muted-foreground">{SPEED_TIER_LABELS[speedTier(charger.maxKw)]} · {formatConnector(charger.connectorType)}</p>
          <div className="mt-3 flex items-center justify-center">
            <AvailabilityBadge availability={{ available: charger.countAvailable, total: charger.countTotal }} />
          </div>
        </div>

        <Link
          href={`/app/site/${station.id}`}
          className="flex items-center gap-2 rounded-2xl bg-white p-4 text-sm shadow-[0_6px_16px_rgba(20,32,60,0.08)]"
        >
          <MapPin className="h-4 w-4 text-[#006551]" />
          <span className="min-w-0 flex-1">
            <span className="block font-semibold text-[#1A1A1A]">{station.name}</span>
            <span className="block truncate text-muted-foreground">{station.address}</span>
          </span>
        </Link>

        <dl className="rounded-2xl bg-white p-4 text-sm shadow-[0_6px_16px_rgba(20,32,60,0.08)]">
          <Row label="Price" value={formatPrice(charger.pricePerKwh, station.currency)} />
          <Row label="Max power" value={formatKw(charger.maxKw)} />
          <Row label="Connector" value={formatConnector(charger.connectorType)} />
          <Row label="Status" value={CHARGER_STATUS_LABELS[charger.status]} />
        </dl>

        <button
          type="button"
          disabled={!available}
          onClick={() => router.push(`/app/charge/${charger.id}`)}
          className="flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold text-white disabled:opacity-50"
          style={{ backgroundColor: "var(--brand-primary)" }}
        >
          <Zap className="h-4 w-4" />
          {available ? "Start a charge" : "Currently unavailable"}
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-[#f0f2f9] py-2 last:border-b-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-[#1A1A1A]">{value}</dd>
    </div>
  );
}
