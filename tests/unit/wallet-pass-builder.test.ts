import { describe, expect, it } from "vitest";
import { PARCELCONNECT_NOTIFICATION_COPY } from "../../lib/loyalty/home";
import { WalletPassConfigurationError } from "../../lib/wallet/certificates";
import { buildWalletPassJson } from "../../lib/wallet/pass";

describe("wallet pass builder", () => {
  it("recomputes tier from points instead of trusting persisted tier input", () => {
    const passJson = buildWalletPassJson({
      memberId: "tier-stale-user",
      points: 200,
      persistedTier: "Gold",
    });

    expect(passJson.storeCard.secondaryFields[0].value).toBe("Bronze");
  });

  it("surfaces the onboarded member name in a visible field", () => {
    const passJson = buildWalletPassJson({
      memberId: "dmytro-y",
      memberName: "Dmytro Y.",
      points: 750,
    });

    expect(passJson.storeCard.auxiliaryFields[0].value).toBe("Dmytro Y.");
  });

  it("reuses the same Parcelconnect copy as PWA Home", () => {
    const passJson = buildWalletPassJson({
      memberId: "parcel-copy-check",
      memberName: "Dmytro Y.",
      points: 750,
    });

    expect(passJson.storeCard.backFields[0].value).toBe(PARCELCONNECT_NOTIFICATION_COPY);
  });

  it("throws when pass type identifier is configured without the pass. prefix", () => {
    expect(() =>
      buildWalletPassJson(
        {
          memberId: "pass-type-prefix-check",
          points: 100,
        },
        {
          passTypeIdentifier: "ie.applegreen.demo",
        },
      ),
    ).toThrow(WalletPassConfigurationError);
  });
});
