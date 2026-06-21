"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { useCharging } from "@/components/charging/context";
import { FilterChips } from "@/components/charging/filter-chips";
import { StationCard } from "@/components/charging/station-card";
import { EMPTY_STATION_FILTERS, stationMatchesFilters, type StationFilters } from "@/lib/charging/model";

const MapView = dynamic(() => import("@/components/charging/map-view").then((m) => m.MapView), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Loading map…</div>
  ),
});

export default function MapPage() {
  const { stations, chargersFor, getStation } = useCharging();
  const [filters, setFilters] = useState<StationFilters>(EMPTY_STATION_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(
    () => stations.filter((station) => stationMatchesFilters(chargersFor(station.id), filters)),
    [stations, chargersFor, filters],
  );

  const selected = selectedId ? getStation(selectedId) : null;

  return (
    <div className="relative h-[calc(100dvh-128px)] w-full">
      <div className="absolute left-0 right-0 top-0 z-[500] px-3 pt-3">
        <div className="rounded-2xl bg-white/95 p-2 shadow-[0_6px_16px_rgba(20,32,60,0.12)] backdrop-blur">
          <FilterChips filters={filters} onChange={setFilters} />
        </div>
      </div>

      <MapView stations={filtered} onSelect={setSelectedId} />

      {selected ? (
        <div className="absolute bottom-3 left-0 right-0 z-[500] px-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              aria-label="Close"
              className="absolute -top-2 right-1 z-10 rounded-full bg-white p-1 shadow"
            >
              <X className="h-4 w-4 text-[#1A1A1A]" />
            </button>
            <StationCard station={selected} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
