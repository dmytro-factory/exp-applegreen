import { describe, expect, it } from "vitest";
import {
  ROAD_TRIP_FAMILY_FILTERS,
  buildGoogleMapsDeepLink,
  filterRoadTripStopsByBadges,
  planRoadTrip,
} from "../../lib/road-trip";

describe("road-trip planner contracts", () => {
  it("matches Dublin to Galway against curated M4/M6 stops in order", () => {
    const plan = planRoadTrip("  Dublin city ", "GALWAY");

    expect(plan.corridorId).toBe("m4-m6-dublin-galway");
    expect(plan.stops.length).toBeGreaterThanOrEqual(2);
    expect(plan.stops.map((stop) => stop.name)).toEqual([
      "Applegreen Enfield Eastbound",
      "Applegreen Kinnegad Plaza",
      "Applegreen Athlone",
      "Applegreen Ballinasloe",
    ]);
  });

  it("returns no curated stops for unknown corridors", () => {
    const plan = planRoadTrip("Dublin", "Cork");

    expect(plan.corridorId).toBeNull();
    expect(plan.stops).toHaveLength(0);
  });

  it("composes family filters with AND semantics and restores when cleared", () => {
    const plan = planRoadTrip("Dublin", "Galway");
    const baseline = plan.stops;

    const filtered = filterRoadTripStopsByBadges(baseline, ["dog", "ev"]);
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((stop) => stop.badges.includes("dog") && stop.badges.includes("ev"))).toBe(true);

    expect(filterRoadTripStopsByBadges(baseline, []).length).toBe(baseline.length);
    expect(ROAD_TRIP_FAMILY_FILTERS.map((filter) => filter.id)).toEqual(["kids", "baby-change", "dog", "ev"]);
  });

  it("builds a well-formed Google Maps deep link with encoded waypoints", () => {
    const url = buildGoogleMapsDeepLink("Dublin", "Galway", [
      "Applegreen Enfield Eastbound, Co. Meath",
      "Applegreen Kinnegad Plaza, Co. Westmeath",
    ]);

    expect(url.startsWith("https://www.google.com/maps/dir/?api=1")).toBe(true);

    const parsed = new URL(url);
    expect(parsed.searchParams.get("api")).toBe("1");
    expect(parsed.searchParams.get("origin")).toBe("Dublin");
    expect(parsed.searchParams.get("destination")).toBe("Galway");

    const waypoints = parsed.searchParams.get("waypoints");
    expect(waypoints).toContain("|");
    expect(waypoints?.split("|")).toEqual([
      "Applegreen Enfield Eastbound, Co. Meath",
      "Applegreen Kinnegad Plaza, Co. Westmeath",
    ]);
  });
});
