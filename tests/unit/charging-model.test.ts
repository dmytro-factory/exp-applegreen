import { describe, expect, it } from "vitest";
import {
  availabilityOf,
  connectorTypesOf,
  distanceKm,
  formatDistance,
  formatKw,
  maxKwOf,
  speedTier,
  stationMatchesFilters,
  type Charger,
} from "../../lib/charging/model";

function charger(overrides: Partial<Charger>): Charger {
  return {
    id: "c",
    stationId: "s",
    name: "c",
    connectorType: "CCS",
    maxKw: 150,
    countAvailable: 2,
    countTotal: 2,
    pricePerKwh: 0.79,
    status: "available",
    ...overrides,
  };
}

describe("charging model", () => {
  it("classifies speed tiers by power", () => {
    expect(speedTier(350)).toBe("ultra");
    expect(speedTier(150)).toBe("ultra");
    expect(speedTier(50)).toBe("rapid");
    expect(speedTier(22)).toBe("fast");
  });

  it("aggregates availability and max power", () => {
    const chargers = [charger({ countAvailable: 1, countTotal: 2, maxKw: 350 }), charger({ countAvailable: 0, countTotal: 2, maxKw: 50 })];
    expect(availabilityOf(chargers)).toEqual({ available: 1, total: 4 });
    expect(maxKwOf(chargers)).toBe(350);
  });

  it("lists unique connector types", () => {
    const chargers = [charger({ connectorType: "CCS" }), charger({ connectorType: "CCS" }), charger({ connectorType: "Type2" })];
    expect(connectorTypesOf(chargers)).toEqual(["CCS", "Type2"]);
  });

  it("matches filters across connector, speed and availability", () => {
    const chargers = [charger({ connectorType: "CCS", maxKw: 350, countAvailable: 0 }), charger({ connectorType: "Type2", maxKw: 22, countAvailable: 1 })];
    expect(stationMatchesFilters(chargers, { connector: "CCS", speed: null, availableOnly: false })).toBe(true);
    expect(stationMatchesFilters(chargers, { connector: "CCS", speed: null, availableOnly: true })).toBe(false);
    expect(stationMatchesFilters(chargers, { connector: null, speed: "fast", availableOnly: true })).toBe(true);
    expect(stationMatchesFilters([], { connector: null, speed: null, availableOnly: false })).toBe(false);
  });

  it("formats power and distance", () => {
    expect(formatKw(350)).toBe("350kW");
    expect(formatDistance(0.4)).toBe("400 m");
    expect(formatDistance(4.25)).toBe("4.3 km");
    expect(formatDistance(42)).toBe("42 km");
  });

  it("computes haversine distance between coordinates", () => {
    const km = distanceKm({ lat: 52.0871, lng: -0.7289 }, { lat: 51.6951, lng: -0.2301 });
    expect(km).toBeGreaterThan(50);
    expect(km).toBeLessThan(70);
  });
});
