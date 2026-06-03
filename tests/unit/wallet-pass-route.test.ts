import { describe, expect, it } from "vitest";
import { GET } from "../../app/api/wallet/pass/route";

describe("wallet pass route (marketing CTA contract)", () => {
  it("returns a pkpass payload with the required response shape", async () => {
    const response = await GET(new Request("http://localhost:3100/api/wallet/pass"));
    const bodyBytes = new Uint8Array(await response.arrayBuffer());

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/vnd.apple.pkpass");
    expect(bodyBytes.byteLength).toBeGreaterThan(1024);
  });
});
