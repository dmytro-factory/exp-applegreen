import { describe, expect, it } from "vitest";
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
});
