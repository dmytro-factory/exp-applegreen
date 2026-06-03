import { describe, expect, it } from "vitest";
import {
  phaseTwoCallout,
  simulatorDisclaimer,
  tryItInstructions,
  walletPassCta,
} from "../../lib/marketing/try-it-tech-stack-content";

describe("marketing f05 content", () => {
  it("keeps try-it instructions anchored on Simulator, Safari, and install flow", () => {
    const normalized = tryItInstructions.join(" ").toLowerCase();
    expect(normalized).toContain("simulator");
    expect(normalized).toContain("safari");
    expect(normalized).toMatch(/install|add/);
  });

  it("wires add-to-wallet CTA to the pass API route", () => {
    expect(walletPassCta.href).toBe("/api/wallet/pass");
  });

  it("includes self-signed and real-iPhone rejection disclaimer copy", () => {
    const normalized = simulatorDisclaimer.toLowerCase();
    expect(normalized).toContain("self-signed");
    expect(normalized).toContain("simulator only");
    expect(normalized).toContain("will not install on a real iphone");
  });

  it("includes all Phase-2 callout keywords", () => {
    const normalized = phaseTwoCallout.items.join(" ").toLowerCase();
    expect(normalized).toContain("pass type id");
    expect(normalized).toContain("apns");
    expect(normalized).toContain("nfc");
    expect(normalized).toContain("google wallet");
  });
});
