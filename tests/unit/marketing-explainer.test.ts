import { describe, expect, it } from "vitest";
import {
  appStoreInfo,
  appTodayThemes,
  driverQuotes,
  figmaShowcase,
  livePrototypeConfig,
  loyaltyAdditions,
  loyaltyShots,
  rebuildSteps,
  walletCardCta,
} from "../../lib/marketing/explainer-content";

describe("marketing explainer content", () => {
  it("anchors the app-today section on the real App Store rating", () => {
    expect(appStoreInfo.name).toBe("Applegreen Fast Charge");
    expect(appStoreInfo.rating).toBeLessThan(2);
    expect(appStoreInfo.ratingCount).toBeGreaterThan(0);
    expect(appTodayThemes.length).toBeGreaterThanOrEqual(3);
    expect(driverQuotes.length).toBeGreaterThanOrEqual(3);
  });

  it("tells the rebuild story from live app through Figma to loyalty", () => {
    expect(rebuildSteps.map((step) => step.step)).toEqual([1, 2, 3, 4, 5]);
    const joined = rebuildSteps.map((step) => `${step.title} ${step.description}`).join(" ").toLowerCase();
    expect(joined).toContain("figma");
    expect(joined).toContain("loyalty");
  });

  it("points the Figma showcase at the captured board image", () => {
    expect(figmaShowcase.src).toBe("/images/explainer/figma-board.png");
    expect(figmaShowcase.width).toBeGreaterThan(figmaShowcase.height);
  });

  it("describes the loyalty additions and app screenshots", () => {
    expect(loyaltyAdditions.length).toBeGreaterThanOrEqual(4);
    expect(loyaltyShots.length).toBe(3);
    for (const shot of loyaltyShots) {
      expect(shot.src.startsWith("/images/explainer/")).toBe(true);
    }
  });

  it("keeps the wallet and live demo CTAs wired to real routes", () => {
    expect(walletCardCta.href).toBe("/api/wallet/pass");
    expect(livePrototypeConfig.iframeSrc).toBe("/app");
    expect(livePrototypeConfig.ctaHref).toBe("/app");
  });
});
