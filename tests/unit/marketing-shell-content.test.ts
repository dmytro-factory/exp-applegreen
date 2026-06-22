import { describe, expect, it } from "vitest";
import {
  heroKpis,
  marketingPageMap,
  marketingShellMetadata,
} from "../../lib/marketing/page-map";

describe("marketing shell page map", () => {
  it("defines all five required in-page sections", () => {
    expect(marketingPageMap).toHaveLength(5);
    expect(marketingPageMap.map((section) => section.label)).toEqual([
      "Home",
      "The app today",
      "In your control",
      "Loyalty layer",
      "Live demo",
    ]);
  });

  it("defines hero KPI values and labels", () => {
    expect(heroKpis).toEqual([
      { value: 13, label: "screens rebuilt" },
      { value: 30, label: "charging sites" },
      { value: 3, label: "loyalty tiers" },
    ]);
  });

  it("exports marketing metadata aligned to Applegreen brand", () => {
    expect(marketingShellMetadata.title).toContain("Applegreen");
    expect(marketingShellMetadata.description.toLowerCase()).toContain("loyalty");
  });
});
