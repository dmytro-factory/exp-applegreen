import { describe, expect, it } from "vitest";
import {
  STATION_FILTER_CHIPS,
  STATIONS,
  filterStationsByServices,
  getStationServiceLabels,
  type StationServiceKey,
} from "../../lib/stations";

describe("stations locator contracts", () => {
  it("ships a curated ROI + UK station seed of about 30 entries", () => {
    expect(STATIONS.length).toBe(30);
    expect(new Set(STATIONS.map((station) => station.country))).toEqual(new Set(["IE", "UK"]));
  });

  it("exposes required filter chips", () => {
    expect(STATION_FILTER_CHIPS.map((filter) => filter.id)).toEqual([
      "fuel",
      "ev",
      "food",
      "parcel",
      "familyFriendly",
    ]);
  });

  it("applies a single filter chip to narrow stations", () => {
    const expected = STATIONS.filter((station) => station.services.ev).length;
    expect(filterStationsByServices(STATIONS, ["ev"]).length).toBe(expected);
  });

  it("composes multiple filters with AND semantics", () => {
    const filters: StationServiceKey[] = ["ev", "familyFriendly"];
    const expected = STATIONS.filter((station) => filters.every((filter) => station.services[filter])).length;

    expect(filterStationsByServices(STATIONS, filters).length).toBe(expected);
  });

  it("clearing filters restores the full baseline", () => {
    expect(filterStationsByServices(STATIONS, []).length).toBe(STATIONS.length);
  });

  it("exposes detail-card service labels and real-seeming seed text", () => {
    const samples = STATIONS.slice(0, 3);

    for (const station of samples) {
      expect(station.name.toLowerCase()).not.toContain("lorem");
      expect(station.address.toLowerCase()).not.toContain("lorem");
      expect(getStationServiceLabels(station).length).toBeGreaterThan(0);
    }
  });
});
