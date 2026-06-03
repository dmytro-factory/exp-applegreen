import { describe, expect, it } from "vitest";
import {
  heroKpis,
  marketingPageMap,
  marketingShellMetadata,
} from "../../lib/marketing/page-map";

describe("marketing shell page map", () => {
  it("defines all seven required in-page sections", () => {
    expect(marketingPageMap).toHaveLength(7);
    expect(marketingPageMap.map((section) => section.label)).toEqual([
      "Hero",
      "Problem",
      "Vision",
      "Try it now",
      "Live prototype",
      "Mission narrative",
      "Tech stack",
    ]);
  });

  it("defines hero KPI values and labels", () => {
    expect(heroKpis).toEqual([
      { value: 500, label: "stations" },
      { value: 3, label: "countries" },
      { value: 1, label: "wallet" },
    ]);
  });

  it("exports marketing metadata aligned to Applegreen brand", () => {
    expect(marketingShellMetadata.title).toContain("Applegreen");
    expect(marketingShellMetadata.description.toLowerCase()).toContain("loyalty");
  });
});
