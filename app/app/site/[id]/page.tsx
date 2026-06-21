"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronRight,
  Coffee,
  Fuel,
  Heart,
  Navigation,
  ShoppingBag,
  UtensilsCrossed,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { AvailabilityBadge } from "@/components/charging/availability-badge";
import { BackBar } from "@/components/charging/chrome";
import { useCharging } from "@/components/charging/context";
import { PeakChart } from "@/components/charging/peak-chart";
import {
  CHARGER_STATUS_LABELS,
  formatConnector,
  formatKw,
  formatPrice,
  type Charger,
} from "@/lib/charging/model";
import { buildGoogleMapsDirectionsLink, buildWazeDirectionsLink } from "@/lib/road-trip";

const MapView = dynamic(() => import("@/components/charging/map-view").then((m) => m.MapView), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Loading…</div>,
});

const TABS = ["Connectors", "Details", "Map", "Peak"] as const;
type Tab = (typeof TABS)[number];

export default function SiteDetailPage() {
  const params = useParams<{ id: string }>();
  const { getStation, chargersFor, availabilityFor, maxKwFor, isFavourite, toggleFavourite } = useCharging();
  const [tab, setTab] = useState<Tab>("Connectors");

  const station = getStation(params.id);
  if (!station) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Station not found. <Link href="/app" className="font-semibold text-[#006551]">Back to list</Link>
      </div>
    );
  }

  const chargers = chargersFor(station.id);
  const availability = availabilityFor(station.id);
  const maxKw = maxKwFor(station.id);
  const fav = isFavourite(station.id);

  return (
    <div className="pb-6">
      <BackBar
        title={station.name}
        right={
          <button
            type="button"
            onClick={() => toggleFavourite(station.id)}
            aria-label={fav ? "Remove favourite" : "Add favourite"}
            aria-pressed={fav}
            className="rounded-full p-1.5"
          >
            <Heart className="h-5 w-5" style={{ color: fav ? "var(--brand-primary)" : "#9CA3AF" }} fill={fav ? "var(--brand-primary)" : "none"} />
          </button>
        }
      />

      <div className="space-y-3 px-4 pt-3">
        <p className="text-sm text-muted-foreground">{station.address}</p>
        <div className="flex flex-wrap items-center gap-2">
          <AvailabilityBadge availability={availability} />
          <span className="inline-flex items-center gap-1 rounded-lg bg-[#F1F5FF] px-2 py-1 text-xs font-semibold text-[#006551]">
            <Zap className="h-3.5 w-3.5" /> Up to {formatKw(maxKw)}
          </span>
          <span className="rounded-lg bg-[#F1F5FF] px-2 py-1 text-xs font-semibold text-[#006551]">{station.operator}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <a
            href={buildGoogleMapsDirectionsLink(station.position.lat, station.position.lng)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold text-white"
            style={{ backgroundColor: "var(--brand-primary)" }}
          >
            <Navigation className="h-4 w-4" /> Google Maps
          </a>
          <a
            href={buildWazeDirectionsLink(station.position.lat, station.position.lng)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-full border border-[#D8DEEC] bg-white py-2.5 text-sm font-semibold text-[#3D3D3D]"
          >
            <Navigation className="h-4 w-4" /> Waze
          </a>
        </div>
      </div>

      <div className="mt-4 flex gap-1 border-b border-[#e3e7f2] px-4">
        {TABS.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            className="relative px-3 py-2 text-sm font-semibold"
            style={{ color: tab === value ? "var(--brand-primary)" : "#6B7280" }}
          >
            {value}
            {tab === value ? (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full" style={{ backgroundColor: "var(--brand-primary)" }} />
            ) : null}
          </button>
        ))}
      </div>

      <div className="px-4 pt-4">
        {tab === "Connectors" ? (
          <div className="space-y-3">
            {chargers.map((charger) => (
              <ConnectorRow key={charger.id} charger={charger} currency={station.currency} />
            ))}
          </div>
        ) : null}

        {tab === "Details" ? (
          <div className="space-y-4">
            <dl className="rounded-2xl bg-white p-4 text-sm shadow-[0_6px_16px_rgba(20,32,60,0.08)]">
              <Row label="Network" value={station.network} />
              <Row label="Operator" value={station.operator} />
              <Row label="Country" value={station.country === "UK" ? "United Kingdom" : "Ireland"} />
              <Row label="Address" value={station.address} />
            </dl>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Amenities</p>
              <div className="flex flex-wrap gap-2">
                {station.amenities.coffee ? <Amenity icon={<Coffee className="h-4 w-4" />} label="Coffee" /> : null}
                {station.amenities.food ? <Amenity icon={<UtensilsCrossed className="h-4 w-4" />} label="Food" /> : null}
                {station.amenities.shop ? <Amenity icon={<ShoppingBag className="h-4 w-4" />} label="Shop" /> : null}
                {station.amenities.fuel ? <Amenity icon={<Fuel className="h-4 w-4" />} label="Fuel" /> : null}
              </div>
            </div>
          </div>
        ) : null}

        {tab === "Map" ? (
          <div className="h-72 overflow-hidden rounded-2xl border border-[#e3e7f2]">
            <MapView stations={[station]} onSelect={() => undefined} />
          </div>
        ) : null}

        {tab === "Peak" ? (
          <div className="rounded-2xl bg-white p-4 shadow-[0_6px_16px_rgba(20,32,60,0.08)]">
            <p className="mb-3 text-sm text-muted-foreground">Typical busyness through the day. Plan around quieter times.</p>
            <PeakChart stationId={station.id} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ConnectorRow({ charger, currency }: { charger: Charger; currency: "GBP" | "EUR" }) {
  const free = charger.countAvailable > 0 && charger.status !== "offline";
  return (
    <Link
      href={`/app/charger/${charger.id}`}
      className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-[0_6px_16px_rgba(20,32,60,0.08)]"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: "var(--brand-badge-bg)" }}>
        <Zap className="h-5 w-5 text-[#006551]" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-[#1A1A1A]">{formatConnector(charger.connectorType)} · {formatKw(charger.maxKw)}</p>
        <p className="text-xs text-muted-foreground">{formatPrice(charger.pricePerKwh, currency)}</p>
      </div>
      <span
        className="rounded-lg px-2 py-1 text-xs font-semibold"
        style={{
          backgroundColor: free ? "var(--brand-badge-bg)" : "#E5E7EB",
          color: free ? "var(--brand-primary)" : "#6B7280",
        }}
      >
        {charger.status === "offline" ? CHARGER_STATUS_LABELS.offline : `${charger.countAvailable}/${charger.countTotal}`}
      </span>
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </Link>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-[#f0f2f9] py-2 last:border-b-0">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium text-[#1A1A1A]">{value}</dd>
    </div>
  );
}

function Amenity({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#3D3D3D] shadow-sm">
      {icon}
      {label}
    </span>
  );
}
