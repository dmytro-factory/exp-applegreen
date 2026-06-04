import stationsSeed from "@/data/stations.json";

export const STATION_FILTERS = [
  { id: "fuel", label: "Fuel" },
  { id: "ev", label: "EV" },
  { id: "food", label: "Food" },
  { id: "parcel", label: "Parcel" },
  { id: "familyFriendly", label: "Family-friendly" },
] as const;

export const STATION_FILTER_CHIPS = STATION_FILTERS;

export type StationFilter = (typeof STATION_FILTERS)[number]["id"];
export type StationServiceKey = StationFilter;

type StationServices = Record<StationServiceKey, boolean>;

export type Station = {
  id: string;
  name: string;
  address: string;
  country: "IE" | "UK";
  position: {
    lat: number;
    lng: number;
  };
  services: StationServices;
};

const SERVICE_LABELS: Record<StationFilter, string> = {
  fuel: "Fuel",
  ev: "EV charging",
  food: "Food",
  parcel: "Parcelconnect",
  familyFriendly: "Family-friendly",
};

export const STATIONS = stationsSeed as Station[];

export function filterStations(
  stations: Station[],
  activeFilters: ReadonlyArray<StationServiceKey> | ReadonlySet<StationServiceKey>,
): Station[] {
  const normalizedFilters: StationServiceKey[] = Array.isArray(activeFilters)
    ? [...activeFilters]
    : Array.from(activeFilters);

  if (normalizedFilters.length === 0) {
    return stations;
  }

  return stations.filter((station) => normalizedFilters.every((filter) => station.services[filter]));
}

export function getStationById(id: string): Station | undefined {
  return STATIONS.find((station) => station.id === id);
}

export function getStationServiceLabels(station: Station): string[] {
  return STATION_FILTERS.filter((service) => station.services[service.id]).map((service) => SERVICE_LABELS[service.id]);
}
