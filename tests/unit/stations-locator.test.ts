import { describe, expect, it } from "vitest";
import {
  STATION_FILTERS,
  STATIONS,
  filterStations,
  getStationById,
  getStationServiceLabels,
  type StationFilter,
} from "../../lib/stations";

describe("stations locator contracts", () => {
  it("ships ~30 curated Applegreen stations across ROI and UK", () => {
    expect(STATIONS).toHaveLength(30);

    const countries = new Set(STATIONS.map((station) => station.country));
    expect(countries.has("IE")).toBe(true);
    expect(countries.has("UK")).toBe(true);
  });

  it("defines the required filter chips", () => {
    expect(STATION_FILTERS.map((filter) => filter.id)).toEqual([
      "fuel",
      "ev",
      "food",
      "parcel",
      "familyFriendly",
    ]);
  });

  it("applies a single filter to narrow marker candidates", () => {
    const evStations = filterStations(STATIONS, new Set<StationFilter>(["ev"]));
    const expected = STATIONS.filter((station) => station.services.ev);

    expect(evStations).toHaveLength(expected.length);
    expect(evStations.length).toBeLessThan(STATIONS.length);
  });

  it("composes multiple filters with AND semantics", () => {
    const composed = filterStations(STATIONS, new Set<StationFilter>(["ev", "familyFriendly"]));
    const expected = STATIONS.filter((station) => station.services.ev && station.services.familyFriendly);

    expect(composed).toHaveLength(expected.length);
    expect(composed.every((station) => station.services.ev && station.services.familyFriendly)).toBe(true);
  });

  it("clearing filters restores the full station set", () => {
    expect(filterStations(STATIONS, new Set())).toHaveLength(STATIONS.length);
  });

  it("keeps detail card content aligned with seed data for sampled stations", () => {
    const sampled = [
      getStationById("ie-birdhill"),
      getStationById("ie-castlebellingham-north"),
      getStationById("uk-south-mimms"),
    ];

    for (const station of sampled) {
      expect(station).toBeDefined();
      expect(station?.name.toLowerCase()).not.toContain("lorem");
      expect(station?.address.toLowerCase()).not.toContain("lorem");
      expect(station?.address.trim().length).toBeGreaterThan(10);
      expect(getStationServiceLabels(station!)).not.toHaveLength(0);
    }
  });
});
