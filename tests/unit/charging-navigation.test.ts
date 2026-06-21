import { describe, expect, it } from "vitest";
import { buildGoogleMapsDirectionsLink, buildWazeDirectionsLink } from "../../lib/road-trip";

describe("station navigation deep links", () => {
  it("builds a Google Maps directions link to coordinates", () => {
    const url = new URL(buildGoogleMapsDirectionsLink(52.0871, -0.7289));
    expect(url.hostname).toBe("www.google.com");
    expect(url.searchParams.get("api")).toBe("1");
    expect(url.searchParams.get("destination")).toBe("52.0871,-0.7289");
  });

  it("builds a Waze directions link to coordinates", () => {
    const url = new URL(buildWazeDirectionsLink(53.0901, -0.8442));
    expect(url.hostname).toBe("www.waze.com");
    expect(url.searchParams.get("ll")).toBe("53.0901,-0.8442");
    expect(url.searchParams.get("navigate")).toBe("yes");
  });
});
