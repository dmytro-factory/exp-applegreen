"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  availabilityOf,
  maxKwOf,
  type Charger,
  type ChargingStation,
  type StationAvailability,
} from "@/lib/charging/model";
import {
  FASTCHARGE_UPDATED_EVENT,
  readAccount,
  saveAccount,
  type FastChargeAccount,
} from "@/lib/loyalty/charging";

const FAVOURITES_KEY = "applegreen:fastcharge:favourites";
const RECENTS_KEY = "applegreen:fastcharge:recents";

// Default map anchor near the M25 corridor used when geolocation is unavailable.
const DEFAULT_POSITION = { lat: 52.0871, lng: -0.7289 };

type ChargingContextValue = {
  hydrated: boolean;
  stations: ChargingStation[];
  chargers: Charger[];
  userPosition: { lat: number; lng: number };
  getStation: (id: string) => ChargingStation | undefined;
  getCharger: (id: string) => Charger | undefined;
  chargersFor: (stationId: string) => Charger[];
  availabilityFor: (stationId: string) => StationAvailability;
  maxKwFor: (stationId: string) => number;
  account: FastChargeAccount | null;
  updateAccount: (next: FastChargeAccount) => void;
  favourites: string[];
  isFavourite: (stationId: string) => boolean;
  toggleFavourite: (stationId: string) => void;
  recents: string[];
  pushRecent: (stationId: string) => void;
};

const ChargingContext = createContext<ChargingContextValue | null>(null);

export function useCharging(): ChargingContextValue {
  const context = useContext(ChargingContext);
  if (!context) {
    throw new Error("useCharging must be used within ChargingProvider");
  }
  return context;
}

function readList(key: string): string[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : [];
  } catch {
    return [];
  }
}

function writeList(key: string, value: string[]) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(key, JSON.stringify(value));
}

type ChargingProviderProps = {
  stations: ChargingStation[];
  chargers: Charger[];
  children: React.ReactNode;
};

export function ChargingProvider({ stations, chargers, children }: ChargingProviderProps) {
  const [hydrated, setHydrated] = useState(false);
  const [account, setAccount] = useState<FastChargeAccount | null>(null);
  const [favourites, setFavourites] = useState<string[]>([]);
  const [recents, setRecents] = useState<string[]>([]);
  const [userPosition, setUserPosition] = useState(DEFAULT_POSITION);

  const stationsById = useMemo(() => new Map(stations.map((station) => [station.id, station])), [stations]);
  const chargersById = useMemo(() => new Map(chargers.map((charger) => [charger.id, charger])), [chargers]);
  const chargersByStation = useMemo(() => {
    const map = new Map<string, Charger[]>();
    for (const charger of chargers) {
      const list = map.get(charger.stationId) ?? [];
      list.push(charger);
      map.set(charger.stationId, list);
    }
    return map;
  }, [chargers]);

  useEffect(() => {
    setAccount(readAccount());
    setFavourites(readList(FAVOURITES_KEY));
    setRecents(readList(RECENTS_KEY));
    setHydrated(true);

    const sync = () => setAccount(readAccount());
    window.addEventListener(FASTCHARGE_UPDATED_EVENT, sync);

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => undefined,
        { enableHighAccuracy: false, timeout: 4000 },
      );
    }

    return () => window.removeEventListener(FASTCHARGE_UPDATED_EVENT, sync);
  }, []);

  const updateAccount = useCallback((next: FastChargeAccount) => {
    setAccount(next);
    saveAccount(next);
  }, []);

  const toggleFavourite = useCallback((stationId: string) => {
    setFavourites((current) => {
      const next = current.includes(stationId)
        ? current.filter((id) => id !== stationId)
        : [stationId, ...current];
      writeList(FAVOURITES_KEY, next);
      return next;
    });
  }, []);

  const pushRecent = useCallback((stationId: string) => {
    setRecents((current) => {
      const next = [stationId, ...current.filter((id) => id !== stationId)].slice(0, 8);
      writeList(RECENTS_KEY, next);
      return next;
    });
  }, []);

  const value = useMemo<ChargingContextValue>(
    () => ({
      hydrated,
      stations,
      chargers,
      userPosition,
      getStation: (id) => stationsById.get(id),
      getCharger: (id) => chargersById.get(id),
      chargersFor: (stationId) => chargersByStation.get(stationId) ?? [],
      availabilityFor: (stationId) => availabilityOf(chargersByStation.get(stationId) ?? []),
      maxKwFor: (stationId) => maxKwOf(chargersByStation.get(stationId) ?? []),
      account,
      updateAccount,
      favourites,
      isFavourite: (stationId) => favourites.includes(stationId),
      toggleFavourite,
      recents,
      pushRecent,
    }),
    [
      hydrated,
      stations,
      chargers,
      userPosition,
      stationsById,
      chargersById,
      chargersByStation,
      account,
      updateAccount,
      favourites,
      toggleFavourite,
      recents,
      pushRecent,
    ],
  );

  return <ChargingContext.Provider value={value}>{children}</ChargingContext.Provider>;
}
