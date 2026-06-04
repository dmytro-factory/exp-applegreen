import { describe, expect, it } from "vitest";
import { buildWalletPassHref, createWalletMemberId } from "../../lib/wallet/cta";

describe("wallet CTA href builder", () => {
  it("builds a wallet pass href with member id, onboarded name, and points query", () => {
    const href = buildWalletPassHref({
      name: "Dmytro Y.",
      points: 750,
    });

    expect(href.startsWith("/api/wallet/pass?")).toBe(true);

    const url = new URL(href, "http://localhost:3100");
    expect(url.pathname).toBe("/api/wallet/pass");
    expect(url.searchParams.get("member")).toBe("member-dmytro-y");
    expect(url.searchParams.get("name")).toBe("Dmytro Y.");
    expect(url.searchParams.get("points")).toBe("750");
  });

  it("falls back to anonymous identity after sign-out / missing user", () => {
    const href = buildWalletPassHref(null);
    const url = new URL(href, "http://localhost:3100");

    expect(url.searchParams.get("member")).toBe("guest");
    expect(url.searchParams.get("name")).toBe("Guest Member");
    expect(url.searchParams.get("points")).toBe("0");
  });

  it("forces points=0 when name is empty (guest override invariant)", () => {
    const href = buildWalletPassHref({
      name: "   ",
      points: 1500,
    });
    const url = new URL(href, "http://localhost:3100");

    expect(url.searchParams.get("member")).toBe("guest");
    expect(url.searchParams.get("name")).toBe("Guest Member");
    expect(url.searchParams.get("points")).toBe("0");
  });

  it("forces points=0 when name is empty, even if a non-zero balance is passed", () => {
    const href = buildWalletPassHref({
      name: "   ",
      points: 1200,
    });
    const url = new URL(href, "http://localhost:3100");

    expect(url.searchParams.get("member")).toBe("guest");
    expect(url.searchParams.get("name")).toBe("Guest Member");
    expect(url.searchParams.get("points")).toBe("0");
  });

  it("generates different member ids for different onboarded names", () => {
    expect(createWalletMemberId("Ava")).not.toBe(createWalletMemberId("Luca"));
  });
});
