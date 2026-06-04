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
      "Problem",
      "Vision",
      "Try it now",
      "Live prototype",
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
