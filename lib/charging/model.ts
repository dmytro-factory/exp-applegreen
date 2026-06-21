export type Country = "UK" | "IE";
export type Currency = "GBP" | "EUR";
export type ConnectorType = "CCS" | "CHAdeMO" | "Type2";
export type ChargerStatus = "available" | "in_use" | "offline";

export type ChargingStation = {
  id: string;
  name: string;
  operator: string;
  network: string;
  address: string;
  country: Country;
  currency: Currency;
  position: { lat: number; lng: number };
  amenities: {
    coffee: boolean;
    fuel: boolean;
    food: boolean;
    shop: boolean;
  };
};

export type Charger = {
  id: string;
  stationId: string;
  name: string;
  connectorType: ConnectorType;
  maxKw: number;
  countAvailable: number;
  countTotal: number;
  pricePerKwh: number;
  status: ChargerStatus;
};

export type StationAvailability = {
  available: number;
  total: number;
};

export const CONNECTOR_LABELS: Record<ConnectorType, string> = {
  CCS: "Combo CCS",
  CHAdeMO: "CHAdeMO",
  Type2: "Type 2",
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  GBP: "£",
  EUR: "€",
};

export const CHARGER_STATUS_LABELS: Record<ChargerStatus, string> = {
  available: "Available",
  in_use: "In use",
  offline: "Offline",
};

export type SpeedTier = "ultra" | "rapid" | "fast";

export function speedTier(maxKw: number): SpeedTier {
  if (maxKw >= 150) {
    return "ultra";
  }

  if (maxKw >= 50) {
    return "rapid";
  }

  return "fast";
}

export const SPEED_TIER_LABELS: Record<SpeedTier, string> = {
  ultra: "Ultra-rapid",
  rapid: "Rapid",
  fast: "Fast",
};

export function availabilityOf(chargers: Charger[]): StationAvailability {
  return chargers.reduce<StationAvailability>(
    (acc, charger) => ({
      available: acc.available + charger.countAvailable,
      total: acc.total + charger.countTotal,
    }),
    { available: 0, total: 0 },
  );
}

export function maxKwOf(chargers: Charger[]): number {
  return chargers.reduce((max, charger) => Math.max(max, charger.maxKw), 0);
}

export function connectorTypesOf(chargers: Charger[]): ConnectorType[] {
  const seen = new Set<ConnectorType>();
  for (const charger of chargers) {
    seen.add(charger.connectorType);
  }
  return Array.from(seen);
}

export function formatPrice(pricePerKwh: number, currency: Currency): string {
  return `${CURRENCY_SYMBOLS[currency]}${pricePerKwh.toFixed(2)}/kWh`;
}

export function formatConnector(connectorType: ConnectorType): string {
  return CONNECTOR_LABELS[connectorType];
}

export function formatKw(maxKw: number): string {
  return `${maxKw}kW`;
}

export type StationFilters = {
  connector: ConnectorType | null;
  speed: SpeedTier | null;
  availableOnly: boolean;
};

export const EMPTY_STATION_FILTERS: StationFilters = {
  connector: null,
  speed: null,
  availableOnly: false,
};

export function stationMatchesFilters(chargers: Charger[], filters: StationFilters): boolean {
  if (chargers.length === 0) {
    return false;
  }

  return chargers.some((charger) => {
    if (filters.connector && charger.connectorType !== filters.connector) {
      return false;
    }

    if (filters.speed && speedTier(charger.maxKw) !== filters.speed) {
      return false;
    }

    if (filters.availableOnly && charger.countAvailable <= 0) {
      return false;
    }

    return true;
  });
}

const EARTH_RADIUS_KM = 6371;

export function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return EARTH_RADIUS_KM * 2 * Math.asin(Math.sqrt(h));
}

export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }

  return `${km.toFixed(km < 10 ? 1 : 0)} km`;
}
