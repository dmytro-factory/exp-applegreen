"use client";

import { useEffect, useMemo, useState } from "react";
import { icon, type LatLngBoundsExpression } from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { getBrandPrimaryHexForDataUrl } from "@/lib/brand";
import {
  STATION_FILTER_CHIPS,
  STATIONS,
  filterStations,
  getStationServiceLabels,
  type Station,
  type StationServiceKey,
} from "@/lib/stations";

const IRELAND_UK_BOUNDS: LatLngBoundsExpression = [
  [50.2, -10.9],
  [56.2, 2.1],
];

// Leaflet marker icons are data URL images, so CSS vars (e.g. var(--brand-primary))
// are not resolved inside the SVG document. Keep this tied to the single brand token.
const STATION_MARKER_FILL_HEX = getBrandPrimaryHexForDataUrl();

const stationMarkerIcon = icon({
  iconUrl: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 40">
      <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.268 21.732 0 14 0z" fill="${STATION_MARKER_FILL_HEX}" />
      <circle cx="14" cy="14" r="6" fill="white" />
    </svg>
  `)}`,
  iconSize: [28, 40],
  iconAnchor: [14, 40],
  popupAnchor: [0, -36],
});

export function StationsMap() {
  const [activeFilters, setActiveFilters] = useState<StationServiceKey[]>([]);
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [tilesUnavailable, setTilesUnavailable] = useState(false);

  const filteredStations = useMemo(
    () => filterStations(STATIONS, activeFilters),
    [activeFilters],
  );

  const selectedStation = useMemo(
    () => filteredStations.find((station) => station.id === selectedStationId) ?? null,
    [filteredStations, selectedStationId],
  );

  useEffect(() => {
    if (selectedStationId && !filteredStations.some((station) => station.id === selectedStationId)) {
      setSelectedStationId(null);
    }
  }, [filteredStations, selectedStationId]);

  useEffect(() => {
    if (tilesUnavailable) {
      return;
    }

    const interval = window.setInterval(() => {
      const brokenTile = Array.from(document.querySelectorAll<HTMLImageElement>(".leaflet-tile")).some(
        (tile) => tile.complete && tile.naturalWidth === 0,
      );

      if (brokenTile) {
        window.clearInterval(interval);
        setTilesUnavailable(true);
      }
    }, 800);

    return () => {
      window.clearInterval(interval);
    };
  }, [tilesUnavailable]);

  const toggleFilter = (service: StationServiceKey) => {
    setActiveFilters((current) =>
      current.includes(service) ? current.filter((value) => value !== service) : [...current, service],
    );
  };

  const clearFilters = () => {
    setActiveFilters([]);
  };

  return (
    <section className="space-y-4 pb-8" aria-label="Station locator">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Station locator</p>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Applegreen stations</h1>
        <p className="text-sm text-muted-foreground">Showing {filteredStations.length} of {STATIONS.length} stations across Ireland and the UK.</p>
      </header>

      <div className="flex flex-wrap gap-2">
        {STATION_FILTER_CHIPS.map((filter) => {
          const isActive = activeFilters.includes(filter.id);

          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => toggleFilter(filter.id)}
              aria-pressed={isActive}
              className="rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                borderColor: isActive ? "var(--brand-primary)" : "rgb(212 212 216)",
                backgroundColor: isActive ? "rgb(245 250 238)" : "white",
                color: isActive ? "var(--brand-dark)" : "rgb(63 63 70)",
                outlineColor: "var(--brand-primary)",
              }}
            >
              {filter.label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={clearFilters}
          className="rounded-full border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ outlineColor: "var(--brand-primary)" }}
        >
          Clear
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <MapContainer
          bounds={IRELAND_UK_BOUNDS}
          className="h-[360px] w-full"
          scrollWheelZoom
          aria-label="Applegreen stations map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            eventHandlers={{
              tileerror: () => {
                setTilesUnavailable(true);
              },
            }}
          />

          {filteredStations.map((station) => (
            <Marker
              key={station.id}
              position={[station.position.lat, station.position.lng]}
              icon={stationMarkerIcon}
              eventHandlers={{
                click: () => setSelectedStationId(station.id),
              }}
            />
          ))}
        </MapContainer>
      </div>

      {tilesUnavailable ? (
        <p
          className="rounded-xl border px-3 py-2 text-sm font-medium"
          role="status"
          style={{ borderColor: "var(--brand-primary)", backgroundColor: "rgb(245 250 238)", color: "var(--brand-dark)" }}
        >
          Map tiles unavailable, showing stations as a list.
        </p>
      ) : null}

      {selectedStation ? <StationDetailCard station={selectedStation} onClose={() => setSelectedStationId(null)} /> : null}

      {tilesUnavailable ? (
        <section className="space-y-2" aria-label="Stations list fallback">
          <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">Stations list</h2>
          <ul className="space-y-2">
            {filteredStations.map((station) => (
              <li key={`list-${station.id}`} className="rounded-xl border bg-card p-3">
                <p className="text-sm font-semibold text-foreground">{station.name}</p>
                <p className="text-sm text-muted-foreground">{station.address}</p>
                <p className="mt-1 text-xs font-medium text-muted-foreground">{getStationServiceLabels(station).join(" · ")}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </section>
  );
}

type StationDetailCardProps = {
  station: Station;
  onClose: () => void;
};

function StationDetailCard({ station, onClose }: StationDetailCardProps) {
  return (
    <article className="rounded-2xl border bg-card p-4 shadow-sm" aria-label="Station detail card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">{station.name}</h2>
          <p className="text-sm text-muted-foreground">{station.address}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border px-2 py-1 text-xs font-semibold text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ outlineColor: "var(--brand-primary)" }}
          aria-label="Close station detail card"
        >
          ✕
        </button>
      </div>
      <p className="mt-3 text-sm font-medium text-foreground">Services: {getStationServiceLabels(station).join(", ")}</p>
    </article>
  );
}
