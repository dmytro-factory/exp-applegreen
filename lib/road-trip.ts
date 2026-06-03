import corridorSeed from "../data/road-trip-corridors.json";

export const ROAD_TRIP_FAMILY_FILTERS = [
  { id: "kids", label: "Kids", ariaLabel: "Kids play area available" },
  { id: "baby-change", label: "Baby change", ariaLabel: "Baby changing facilities available" },
  { id: "dog", label: "Dog friendly", ariaLabel: "Dog friendly stop available" },
  { id: "ev", label: "EV", ariaLabel: "EV charging available" },
] as const;

export type RoadTripFamilyBadge = (typeof ROAD_TRIP_FAMILY_FILTERS)[number]["id"];

export type RoadTripStop = {
  id: string;
  name: string;
  waypoint: string;
  distanceKm: number;
  badges: RoadTripFamilyBadge[];
};

export type RoadTripPlan = {
  corridorId: string | null;
  corridorName: string | null;
  origin: string;
  destination: string;
  stops: RoadTripStop[];
};

type RoadTripCorridor = {
  id: string;
  name: string;
  aliases: {
    origin: string[];
    destination: string[];
  };
  stops: RoadTripStop[];
};

const ROAD_TRIP_CORRIDORS = corridorSeed as RoadTripCorridor[];

function normalizeTerm(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ");
}

function matchesAlias(input: string, aliases: string[]): boolean {
  const normalizedInput = normalizeTerm(input);

  if (!normalizedInput) {
    return false;
  }

  return aliases.some((alias) => {
    const normalizedAlias = normalizeTerm(alias);
    return (
      normalizedInput === normalizedAlias ||
      normalizedInput.includes(normalizedAlias) ||
      normalizedAlias.includes(normalizedInput)
    );
  });
}

function reverseStopsWithDistances(stops: RoadTripStop[]): RoadTripStop[] {
  if (stops.length === 0) {
    return [];
  }

  const totalDistance = Math.max(...stops.map((stop) => stop.distanceKm));
  return [...stops]
    .reverse()
    .map((stop) => ({ ...stop, distanceKm: Math.max(0, Math.round(totalDistance - stop.distanceKm)) }));
}

export function planRoadTrip(from: string, to: string): RoadTripPlan {
  const origin = from.trim();
  const destination = to.trim();

  for (const corridor of ROAD_TRIP_CORRIDORS) {
    const isForwardMatch = matchesAlias(origin, corridor.aliases.origin) && matchesAlias(destination, corridor.aliases.destination);
    if (isForwardMatch) {
      return {
        corridorId: corridor.id,
        corridorName: corridor.name,
        origin,
        destination,
        stops: corridor.stops.map((stop) => ({ ...stop })),
      };
    }

    const isReverseMatch = matchesAlias(origin, corridor.aliases.destination) && matchesAlias(destination, corridor.aliases.origin);
    if (isReverseMatch) {
      return {
        corridorId: corridor.id,
        corridorName: corridor.name,
        origin,
        destination,
        stops: reverseStopsWithDistances(corridor.stops),
      };
    }
  }

  return {
    corridorId: null,
    corridorName: null,
    origin,
    destination,
    stops: [],
  };
}

export function filterRoadTripStopsByBadges(stops: RoadTripStop[], activeBadges: RoadTripFamilyBadge[]): RoadTripStop[] {
  if (activeBadges.length === 0) {
    return stops;
  }

  return stops.filter((stop) => activeBadges.every((badge) => stop.badges.includes(badge)));
}

export function buildGoogleMapsDeepLink(origin: string, destination: string, waypoints: string[]): string {
  const mapsUrl = new URL("https://www.google.com/maps/dir/");

  mapsUrl.searchParams.set("api", "1");
  mapsUrl.searchParams.set("origin", origin.trim());
  mapsUrl.searchParams.set("destination", destination.trim());
  mapsUrl.searchParams.set(
    "waypoints",
    waypoints
      .map((waypoint) => waypoint.trim())
      .filter((waypoint) => waypoint.length > 0)
      .join("|"),
  );

  return mapsUrl.toString();
}
