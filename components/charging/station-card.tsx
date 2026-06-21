"use client";

import { useRouter } from "next/navigation";
import { Heart, Navigation, Zap } from "lucide-react";
import { useCharging } from "@/components/charging/context";
import { AvailabilityBadge } from "@/components/charging/availability-badge";
import {
  connectorTypesOf,
  distanceKm,
  formatConnector,
  formatDistance,
  formatKw,
  formatPrice,
  type ChargingStation,
} from "@/lib/charging/model";
import { buildGoogleMapsDirectionsLink } from "@/lib/road-trip";

export function StationCard({ station }: { station: ChargingStation }) {
  const router = useRouter();
  const { chargersFor, availabilityFor, maxKwFor, isFavourite, toggleFavourite, userPosition, pushRecent } =
    useCharging();

  const chargers = chargersFor(station.id);
  const availability = availabilityFor(station.id);
  const maxKw = maxKwFor(station.id);
  const connectors = connectorTypesOf(chargers);
  const fav = isFavourite(station.id);
  const km = distanceKm(userPosition, station.position);
  const cheapest = chargers.reduce(
    (min, charger) => Math.min(min, charger.pricePerKwh),
    Number.POSITIVE_INFINITY,
  );

  const open = () => {
    pushRecent(station.id);
    router.push(`/app/site/${station.id}`);
  };

  return (
    <article className="rounded-2xl bg-white p-4 shadow-[0_6px_16px_rgba(20,32,60,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <button type="button" onClick={open} className="min-w-0 flex-1 text-left">
          <h3 className="truncate font-heading text-base font-semibold text-[#1A1A1A]">{station.name}</h3>
          <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{station.address}</p>
        </button>
        <button
          type="button"
          onClick={() => toggleFavourite(station.id)}
          aria-label={fav ? "Remove from favourites" : "Add to favourites"}
          aria-pressed={fav}
          className="shrink-0 rounded-full p-1.5"
        >
          <Heart
            className="h-5 w-5"
            style={{ color: fav ? "var(--brand-primary)" : "#9CA3AF" }}
            fill={fav ? "var(--brand-primary)" : "none"}
          />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <AvailabilityBadge availability={availability} />
        <span className="inline-flex items-center gap-1 rounded-lg bg-[#F1F5FF] px-2 py-1 text-xs font-semibold text-[#006551]">
          <Zap className="h-3.5 w-3.5" /> Up to {formatKw(maxKw)}
        </span>
        <span className="text-xs font-medium text-muted-foreground">{formatDistance(km)}</span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="truncate text-xs text-muted-foreground">
          {connectors.map(formatConnector).join(" · ")}
          {Number.isFinite(cheapest) ? ` · from ${formatPrice(cheapest, station.currency)}` : ""}
        </p>
        <a
          href={buildGoogleMapsDirectionsLink(station.position.lat, station.position.lng)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-white"
          style={{ backgroundColor: "var(--brand-primary)" }}
        >
          <Navigation className="h-3.5 w-3.5" /> Go
        </a>
      </div>
    </article>
  );
}
