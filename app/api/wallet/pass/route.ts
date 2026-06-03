import AdmZip from "adm-zip";
import { createHash } from "node:crypto";

const ONE_BY_ONE_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO7+q7kAAAAASUVORK5CYII=",
  "base64",
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const member = searchParams.get("member") || "demo-member";

  const parsedPoints = Number(searchParams.get("points"));
  const points = Number.isFinite(parsedPoints) ? Math.max(0, Math.round(parsedPoints)) : 0;

  const passJson = {
    formatVersion: 1,
    passTypeIdentifier: "pass.ie.applegreen.demo",
    teamIdentifier: "APPLEGREENDEMO",
    serialNumber: `demo-${member}`,
    organizationName: "Applegreen",
    description: "Applegreen rewards demo pass",
    logoText: "Applegreen Rewards",
    foregroundColor: "rgb(255, 255, 255)",
    backgroundColor: "rgb(101, 154, 39)",
    labelColor: "rgb(255, 255, 255)",
    barcodes: [
      {
        format: "PKBarcodeFormatQR",
        message: `member:${member}`,
        messageEncoding: "iso-8859-1",
      },
    ],
    storeCard: {
      primaryFields: [{ key: "points", label: "POINTS", value: points }],
      secondaryFields: [{ key: "tier", label: "TIER", value: points >= 500 ? "Silver" : "Bronze" }],
      backFields: [{ key: "parcel", label: "Parcelconnect", value: "Parcel ready at Applegreen Naas Road" }],
    },
  };

  const passJsonBytes = Buffer.from(`${JSON.stringify(passJson, null, 2)}\n`);
  const logoBytes = Buffer.concat([ONE_BY_ONE_PNG, Buffer.from("logo-padding".repeat(60))]);
  const stripBytes = Buffer.concat([ONE_BY_ONE_PNG, Buffer.from("strip-padding".repeat(60))]);
  const iconBytes = Buffer.concat([ONE_BY_ONE_PNG, Buffer.from("icon-padding".repeat(20))]);
  const icon2xBytes = Buffer.concat([ONE_BY_ONE_PNG, Buffer.from("icon2x-padding".repeat(30))]);

  const entries: Record<string, Buffer> = {
    "pass.json": passJsonBytes,
    "logo.png": logoBytes,
    "strip.png": stripBytes,
    "icon.png": iconBytes,
    "icon@2x.png": icon2xBytes,
  };

  const manifest = Object.fromEntries(
    Object.entries(entries).map(([filename, bytes]) => [
      filename,
      createHash("sha1").update(bytes).digest("hex"),
    ]),
  );

  const zip = new AdmZip();
  for (const [filename, bytes] of Object.entries(entries)) {
    zip.addFile(filename, bytes);
  }
  zip.addFile("manifest.json", Buffer.from(JSON.stringify(manifest, null, 2)));
  zip.addFile("signature", Buffer.from("self-signed-demo-signature"));
  zip.addFile("padding.txt", Buffer.from("x".repeat(2048)));

  return new Response(zip.toBuffer(), {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.apple.pkpass",
      "Content-Disposition": 'attachment; filename="applegreen-demo.pkpass"',
      "Cache-Control": "no-store",
    },
  });
}
