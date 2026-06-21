"use client";

import { useEffect, useState } from "react";
import { divIcon, type LatLngBoundsExpression } from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { useCharging } from "@/components/charging/context";
import type { ChargingStation } from "@/lib/charging/model";

const IRELAND_UK_BOUNDS: LatLngBoundsExpression = [
  [50.2, -10.9],
  [56.4, 2.1],
];

function pinIcon(hasFree: boolean) {
  const fill = hasFree ? "#006551" : "#9CA3AF";
  return divIcon({
    className: "",
    html: `<div style="transform:translate(-50%,-100%)">
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="42" viewBox="0 0 28 40">
        <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.268 21.732 0 14 0z" fill="${fill}"/>
        <circle cx="14" cy="14" r="6" fill="white"/>
      </svg></div>`,
    iconSize: [30, 42],
    iconAnchor: [0, 0],
  });
}

export function MapView({
  stations,
  onSelect,
}: {
  stations: ChargingStation[];
  onSelect: (stationId: string) => void;
}) {
  const { availabilityFor } = useCharging();
  const [tilesDown, setTilesDown] = useState(false);

  useEffect(() => {
    if (tilesDown) {
      return;
    }
    const interval = window.setInterval(() => {
      const broken = Array.from(document.querySelectorAll<HTMLImageElement>(".leaflet-tile")).some(
        (tile) => tile.complete && tile.naturalWidth === 0,
      );
      if (broken) {
        window.clearInterval(interval);
        setTilesDown(true);
      }
    }, 800);
    return () => window.clearInterval(interval);
  }, [tilesDown]);

  return (
    <div className="relative h-full w-full">
      <MapContainer
        bounds={IRELAND_UK_BOUNDS}
        className="h-full w-full"
        scrollWheelZoom
        aria-label="Applegreen Fast Charge map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          eventHandlers={{ tileerror: () => setTilesDown(true) }}
        />
        {stations.map((station) => (
          <Marker
            key={station.id}
            position={[station.position.lat, station.position.lng]}
            icon={pinIcon(availabilityFor(station.id).available > 0)}
            eventHandlers={{ click: () => onSelect(station.id) }}
          />
        ))}
      </MapContainer>
      {tilesDown ? (
        <p
          className="absolute left-1/2 top-3 z-[500] -translate-x-1/2 rounded-full bg-white px-3 py-1 text-xs font-semibold shadow"
          role="status"
          style={{ color: "var(--brand-dark)" }}
        >
          Map tiles unavailable — use the List tab.
        </p>
      ) : null}
    </div>
  );
}
