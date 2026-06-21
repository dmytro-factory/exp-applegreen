"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useCharging } from "@/components/charging/context";
import { FilterChips } from "@/components/charging/filter-chips";
import { SectionTitle } from "@/components/charging/chrome";
import { StationCard } from "@/components/charging/station-card";
import {
  EMPTY_STATION_FILTERS,
  distanceKm,
  stationMatchesFilters,
  type StationFilters,
} from "@/lib/charging/model";

export default function ListPage() {
  const { stations, chargersFor, userPosition, favourites, recents, account } = useCharging();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<StationFilters>(EMPTY_STATION_FILTERS);

  const sorted = useMemo(() => {
    const term = query.trim().toLowerCase();
    return stations
      .filter((station) => stationMatchesFilters(chargersFor(station.id), filters))
      .filter(
        (station) =>
          !term ||
          station.name.toLowerCase().includes(term) ||
          station.address.toLowerCase().includes(term),
      )
      .map((station) => ({ station, km: distanceKm(userPosition, station.position) }))
      .sort((a, b) => a.km - b.km)
      .map((entry) => entry.station);
  }, [stations, chargersFor, filters, query, userPosition]);

  const favouriteStations = stations.filter((station) => favourites.includes(station.id));
  const recentStations = recents
    .map((id) => stations.find((station) => station.id === id))
    .filter((station): station is NonNullable<typeof station> => Boolean(station));

  return (
    <div className="space-y-4 px-4 py-4">
      <div>
        <p className="text-sm text-muted-foreground">
          Hi {account?.name ?? "there"} 👋
        </p>
        <h1 className="font-heading text-2xl font-bold text-[#1A1A1A]">Find a charger</h1>
      </div>

      <label className="flex items-center gap-2 rounded-full bg-white px-4 py-3 shadow-[0_6px_16px_rgba(20,32,60,0.08)]">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name or motorway"
          className="w-full bg-transparent text-sm outline-none"
        />
      </label>

      <FilterChips filters={filters} onChange={setFilters} />

      {favouriteStations.length > 0 ? (
        <section>
          <SectionTitle>Favourites</SectionTitle>
          <div className="space-y-3">
            {favouriteStations.map((station) => (
              <StationCard key={station.id} station={station} />
            ))}
          </div>
        </section>
      ) : null}

      {recentStations.length > 0 ? (
        <section>
          <SectionTitle>Recent</SectionTitle>
          <div className="space-y-3">
            {recentStations.slice(0, 3).map((station) => (
              <StationCard key={station.id} station={station} />
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <SectionTitle>Nearby ({sorted.length})</SectionTitle>
        <div className="space-y-3">
          {sorted.map((station) => (
            <StationCard key={station.id} station={station} />
          ))}
          {sorted.length === 0 ? (
            <p className="rounded-2xl bg-white p-4 text-sm text-muted-foreground">
              No stations match these filters.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
