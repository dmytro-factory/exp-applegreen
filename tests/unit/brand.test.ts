import { describe, expect, it } from "vitest";
import { brand } from "../../lib/brand";

describe("brand tokens", () => {
  it("exports sampled Applegreen hex values", () => {
    expect(brand.colors.primary).toBe("#659A27");
    expect(brand.colors.accent).toBe("#6E9D36");
    expect(brand.colors.dark).toBe("#35570E");
  });

  it("uses Inter or Manrope as configured fonts", () => {
    expect([brand.fonts.base, brand.fonts.heading]).toEqual(
      expect.arrayContaining(["Inter", "Manrope"]),
    );
  });
});
