import { describe, expect, it } from "vitest";
import { brand } from "../../lib/brand";

describe("brand tokens", () => {
  it("exports sampled Applegreen Fast Charge hex values", () => {
    expect(brand.colors.primary).toBe("#006551");
    expect(brand.colors.accent).toBe("#62A60E");
    expect(brand.colors.dark).toBe("#00402F");
  });

  it("uses Inter or Manrope as configured fonts", () => {
    expect([brand.fonts.base, brand.fonts.heading]).toEqual(
      expect.arrayContaining(["Inter", "Manrope"]),
    );
  });
});
