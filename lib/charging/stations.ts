import { readFileSync } from "node:fs";
import { join } from "node:path";

import { parseCsv } from "./csv";
import {
  availabilityOf,
  maxKwOf,
  type Charger,
  type ChargerStatus,
  type ChargingStation,
  type ConnectorType,
  type Country,
  type Currency,
  type StationAvailability,
} from "./model";

export {
  CONNECTOR_LABELS,
  CURRENCY_SYMBOLS,
  formatConnector,
  formatPrice,
} from "./model";
export type {
  Charger,
  ChargerStatus,
  ChargingStation,
  ConnectorType,
  Country,
  Currency,
  StationAvailability,
} from "./model";

const DATA_DIR = join(process.cwd(), "data");

function toBool(value: string): boolean {
  return value.trim().toLowerCase() === "true";
}

function loadStations(): ChargingStation[] {
  const raw = readFileSync(join(DATA_DIR, "stations.csv"), "utf8");
  return parseCsv(raw).map((row) => ({
    id: row.id,
    name: row.name,
    operator: row.operator,
    network: row.network,
    address: row.address,
    country: row.country as Country,
    currency: row.currency as Currency,
    position: { lat: Number(row.lat), lng: Number(row.lng) },
    amenities: {
      coffee: toBool(row.coffee),
      fuel: toBool(row.fuel),
      food: toBool(row.food),
      shop: toBool(row.shop),
    },
  }));
}

function loadChargers(): Charger[] {
  const raw = readFileSync(join(DATA_DIR, "chargers.csv"), "utf8");
  return parseCsv(raw).map((row) => ({
    id: row.id,
    stationId: row.station_id,
    name: row.name,
    connectorType: row.connector_type as ConnectorType,
    maxKw: Number(row.max_kw),
    countAvailable: Number(row.count_available),
    countTotal: Number(row.count_total),
    pricePerKwh: Number(row.price_per_kwh),
    status: row.status as ChargerStatus,
  }));
}

export const CHARGING_STATIONS: ChargingStation[] = loadStations();
export const CHARGERS: Charger[] = loadChargers();

export function getStationById(id: string): ChargingStation | undefined {
  return CHARGING_STATIONS.find((station) => station.id === id);
}

export function getChargersForStation(stationId: string): Charger[] {
  return CHARGERS.filter((charger) => charger.stationId === stationId);
}

export function getStationAvailability(stationId: string): StationAvailability {
  return availabilityOf(getChargersForStation(stationId));
}

export function getMaxKwForStation(stationId: string): number {
  return maxKwOf(getChargersForStation(stationId));
}
