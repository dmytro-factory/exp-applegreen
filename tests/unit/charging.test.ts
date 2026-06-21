import { describe, expect, it } from "vitest";

import {
  CHARGERS,
  CHARGING_STATIONS,
  formatConnector,
  formatPrice,
  getChargersForStation,
  getStationAvailability,
  getStationById,
} from "../../lib/charging/stations";

describe("charging dataset contracts", () => {
  it("loads stations across UK and Ireland", () => {
    expect(CHARGING_STATIONS.length).toBeGreaterThanOrEqual(20);
    const countries = new Set(CHARGING_STATIONS.map((station) => station.country));
    expect(countries.has("UK")).toBe(true);
    expect(countries.has("IE")).toBe(true);
  });

  it("ships the canonical hero sites referenced in the mockups", () => {
    for (const id of ["np-north", "np-south", "south-mimms", "newark"]) {
      expect(getStationById(id)).toBeDefined();
    }
  });

  it("every charger references an existing station", () => {
    const stationIds = new Set(CHARGING_STATIONS.map((station) => station.id));
    for (const charger of CHARGERS) {
      expect(stationIds.has(charger.stationId)).toBe(true);
    }
  });

  it("every station has at least one charger", () => {
    for (const station of CHARGING_STATIONS) {
      expect(getChargersForStation(station.id).length).toBeGreaterThan(0);
    }
  });

  it("parses numeric charger fields and sane availability", () => {
    for (const charger of CHARGERS) {
      expect(Number.isFinite(charger.maxKw)).toBe(true);
      expect(Number.isFinite(charger.pricePerKwh)).toBe(true);
      expect(charger.countAvailable).toBeGreaterThanOrEqual(0);
      expect(charger.countAvailable).toBeLessThanOrEqual(charger.countTotal);
    }
  });

  it("aggregates station availability from its chargers", () => {
    const npNorth = getStationAvailability("np-north");
    expect(npNorth.total).toBe(16);
    expect(npNorth.available).toBe(16);
  });

  it("keeps addresses with embedded commas intact through CSV parsing", () => {
    const station = getStationById("np-north");
    expect(station?.address).toContain("Newport Pagnell");
    expect(station?.address).toContain("United Kingdom");
  });

  it("formats connector labels and prices for display", () => {
    expect(formatConnector("CCS")).toBe("Combo CCS");
    expect(formatPrice(0.78, "GBP")).toBe("£0.78/kWh");
    expect(formatPrice(0.75, "EUR")).toBe("€0.75/kWh");
  });
});
