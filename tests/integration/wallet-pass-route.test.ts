import AdmZip from "adm-zip";
import { createHash, randomBytes } from "node:crypto";
import forge from "node-forge";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { GET } from "../../app/api/wallet/pass/route";
import { brand } from "../../lib/brand";

const REQUIRED_CERT_ENV_KEYS = [
  "PASS_CERT_B64",
  "PASS_KEY_B64",
  "WWDR_B64",
  "PASS_KEY_PASSPHRASE",
] as const;

type GeneratedCertificate = {
  certPem: string;
  keyPem: string;
};

type RgbColor = {
  red: number;
  green: number;
  blue: number;
};

const previousEnv = new Map<string, string | undefined>();

function generateSerialNumber(): string {
  return randomBytes(16).toString("hex");
}

function buildSelfSignedCertificate(options: {
  commonName: string;
  organizationName: string;
  organizationalUnitName: string;
  keyPassphrase?: string;
  isCertificateAuthority?: boolean;
}): GeneratedCertificate {
  const {
    commonName,
    organizationName,
    organizationalUnitName,
    keyPassphrase,
    isCertificateAuthority = false,
  } = options;
  const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001 });
  const certificate = forge.pki.createCertificate();

  certificate.publicKey = keyPair.publicKey;
  certificate.serialNumber = generateSerialNumber();
  certificate.validity.notBefore = new Date(Date.now() - 60_000);
  certificate.validity.notAfter = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

  const attrs = [
    { name: "commonName", value: commonName },
    { name: "organizationName", value: organizationName },
    { shortName: "OU", value: organizationalUnitName },
    { name: "countryName", value: "IE" },
  ];

  certificate.setSubject(attrs);
  certificate.setIssuer(attrs);
  certificate.setExtensions([
    { name: "basicConstraints", cA: isCertificateAuthority },
    {
      name: "keyUsage",
      digitalSignature: true,
      keyEncipherment: true,
      keyCertSign: isCertificateAuthority,
      cRLSign: isCertificateAuthority,
    },
    { name: "extKeyUsage", serverAuth: true, clientAuth: true, codeSigning: true },
    { name: "subjectKeyIdentifier" },
  ]);

  certificate.sign(keyPair.privateKey, forge.md.sha256.create());

  const certPem = forge.pki.certificateToPem(certificate);
  const keyPem = keyPassphrase
    ? forge.pki.encryptRsaPrivateKey(keyPair.privateKey, keyPassphrase, { algorithm: "aes256" })
    : forge.pki.privateKeyToPem(keyPair.privateKey);

  return { certPem, keyPem };
}

function generateWalletCertEnv(): Record<(typeof REQUIRED_CERT_ENV_KEYS)[number], string> {
  const passphrase = randomBytes(24).toString("base64url");
  const signer = buildSelfSignedCertificate({
    commonName: "pass.ie.applegreen.demo",
    organizationName: "Applegreen Rewards",
    organizationalUnitName: "Wallet Pass",
    keyPassphrase: passphrase,
  });

  const wwdr = buildSelfSignedCertificate({
    commonName: "Apple WWDR Self Signed",
    organizationName: "Applegreen Rewards",
    organizationalUnitName: "WWDR",
    isCertificateAuthority: true,
  });

  return {
    PASS_CERT_B64: Buffer.from(signer.certPem, "utf8").toString("base64"),
    PASS_KEY_B64: Buffer.from(signer.keyPem, "utf8").toString("base64"),
    WWDR_B64: Buffer.from(wwdr.certPem, "utf8").toString("base64"),
    PASS_KEY_PASSPHRASE: passphrase,
  };
}

function unzipPass(buffer: Buffer): AdmZip {
  return new AdmZip(buffer);
}

function readEntry(zip: AdmZip, entryName: string): Buffer {
  const bytes = zip.readFile(entryName);
  if (!bytes) {
    throw new Error(`Missing ZIP entry: ${entryName}`);
  }
  return bytes;
}

function parseRgb(color: string): RgbColor {
  const match = color.match(/rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/i);
  if (!match) {
    throw new Error(`Invalid rgb color: ${color}`);
  }

  return {
    red: Number(match[1]),
    green: Number(match[2]),
    blue: Number(match[3]),
  };
}

function hexToRgb(hexColor: string): RgbColor {
  const normalized = hexColor.replace("#", "");
  return {
    red: Number.parseInt(normalized.slice(0, 2), 16),
    green: Number.parseInt(normalized.slice(2, 4), 16),
    blue: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

function readPngDimensions(bytes: Buffer) {
  const pngMagic = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  expect(bytes.subarray(0, 8).equals(pngMagic)).toBe(true);
  expect(bytes.subarray(12, 16).toString("ascii")).toBe("IHDR");

  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
  };
}

async function requestPass(pathname: string) {
  const response = await GET(new Request(`http://localhost:3100${pathname}`));
  const bytes = Buffer.from(await response.arrayBuffer());
  return { response, bytes };
}

function readPointsValue(passJson: any): number {
  return Number(passJson.storeCard?.primaryFields?.[0]?.value ?? NaN);
}

beforeAll(() => {
  for (const key of REQUIRED_CERT_ENV_KEYS) {
    previousEnv.set(key, process.env[key]);
  }

  const env = generateWalletCertEnv();
  for (const [key, value] of Object.entries(env)) {
    process.env[key] = value;
  }
});

afterAll(() => {
  for (const key of REQUIRED_CERT_ENV_KEYS) {
    const previous = previousEnv.get(key);
    if (typeof previous === "string") {
      process.env[key] = previous;
      continue;
    }
    delete process.env[key];
  }
});

describe("wallet pass route integration", () => {
  it("returns a signed pkpass bundle that satisfies the wallet contract fields", async () => {
    const { response, bytes } = await requestPass("/api/wallet/pass?member=demo&name=Dmytro%20Y.&points=750");

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/vnd.apple.pkpass");
    expect(bytes.byteLength).toBeGreaterThan(1024);

    const zip = unzipPass(bytes);
    const entryNames = zip.getEntries().map((entry) => entry.entryName);
    const requiredEntries = [
      "pass.json",
      "manifest.json",
      "signature",
      "icon.png",
      "icon@2x.png",
      "logo.png",
      "strip.png",
    ];

    for (const entryName of requiredEntries) {
      expect(entryNames).toContain(entryName);
    }

    const passJson = JSON.parse(readEntry(zip, "pass.json").toString("utf8"));
    expect(passJson.formatVersion).toBe(1);
    expect(passJson.passTypeIdentifier).toMatch(/^pass\./);
    expect(passJson.teamIdentifier).toBeTruthy();
    expect(passJson.serialNumber).toBeTruthy();
    expect(passJson.organizationName).toBe("Applegreen");
    expect(String(passJson.description)).toMatch(/loyalty|rewards/i);

    const actualBackground = parseRgb(passJson.backgroundColor);
    const expectedBackground = hexToRgb(brand.colors.primary);
    expect(Math.abs(actualBackground.red - expectedBackground.red)).toBeLessThanOrEqual(5);
    expect(Math.abs(actualBackground.green - expectedBackground.green)).toBeLessThanOrEqual(5);
    expect(Math.abs(actualBackground.blue - expectedBackground.blue)).toBeLessThanOrEqual(5);

    expect(readPointsValue(passJson)).toBe(750);
    expect(passJson.storeCard.secondaryFields[0].value).toBe("Silver");
    expect(passJson.storeCard.auxiliaryFields[0].value).toBe("Dmytro Y.");
    expect(passJson.storeCard.backFields.some((field: { value?: string }) => /parcel/i.test(String(field.value)))).toBe(true);

    expect(passJson.barcodes[0]).toMatchObject({
      format: "PKBarcodeFormatQR",
      messageEncoding: "iso-8859-1",
    });
    expect(String(passJson.barcodes[0].message)).toContain("demo");

    const manifest = JSON.parse(readEntry(zip, "manifest.json").toString("utf8")) as Record<string, string>;
    const hashedEntryNames = entryNames.filter(
      (entryName) => entryName !== "manifest.json" && entryName !== "signature",
    );

    for (const entryName of hashedEntryNames) {
      const digest = createHash("sha1").update(readEntry(zip, entryName)).digest("hex");
      expect(manifest[entryName]).toBe(digest);
    }
    expect(Object.keys(manifest).sort()).toEqual(hashedEntryNames.sort());

    expect(readEntry(zip, "signature").byteLength).toBeGreaterThan(0);

    const icon = readPngDimensions(readEntry(zip, "icon.png"));
    const icon2x = readPngDimensions(readEntry(zip, "icon@2x.png"));
    const logo = readPngDimensions(readEntry(zip, "logo.png"));
    const strip = readPngDimensions(readEntry(zip, "strip.png"));

    expect(icon.width).toBeGreaterThanOrEqual(29);
    expect(icon.height).toBeGreaterThanOrEqual(29);
    expect(icon2x.width).toBeGreaterThanOrEqual(58);
    expect(icon2x.height).toBeGreaterThanOrEqual(58);
    expect(logo.width).toBeGreaterThan(0);
    expect(logo.height).toBeGreaterThan(0);
    expect(strip.width).toBeGreaterThan(0);
    expect(strip.height).toBeGreaterThan(0);
  });

  it("uses a stable serial number for the same member and different serials for different members", async () => {
    const first = await requestPass("/api/wallet/pass?member=member-alpha&points=200");
    const second = await requestPass("/api/wallet/pass?member=member-alpha&points=1200");
    const third = await requestPass("/api/wallet/pass?member=member-beta&points=1200");

    const firstPassJson = JSON.parse(unzipPass(first.bytes).readAsText("pass.json"));
    const secondPassJson = JSON.parse(unzipPass(second.bytes).readAsText("pass.json"));
    const thirdPassJson = JSON.parse(unzipPass(third.bytes).readAsText("pass.json"));

    expect(firstPassJson.serialNumber).toBe(secondPassJson.serialNumber);
    expect(firstPassJson.serialNumber).not.toBe(thirdPassJson.serialNumber);
  });

  it("falls back to defaults for missing and non-numeric points query parameters", async () => {
    const missing = await requestPass("/api/wallet/pass");
    const nonNumeric = await requestPass("/api/wallet/pass?member=demo&points=not-a-number");

    expect(missing.response.status).toBe(200);
    expect(nonNumeric.response.status).toBe(200);

    const missingPass = JSON.parse(unzipPass(missing.bytes).readAsText("pass.json"));
    const nonNumericPass = JSON.parse(unzipPass(nonNumeric.bytes).readAsText("pass.json"));

    const defaultPoints = readPointsValue(missingPass);
    expect(Number.isFinite(defaultPoints)).toBe(true);
    expect(defaultPoints).toBeGreaterThanOrEqual(0);
    expect(readPointsValue(nonNumericPass)).toBe(defaultPoints);
  });

  it("uses the requested member name instead of a hard-coded placeholder", async () => {
    const { response, bytes } = await requestPass("/api/wallet/pass?member=member-alpha&name=Ava%20Kelly&points=320");

    expect(response.status).toBe(200);

    const passJson = JSON.parse(unzipPass(bytes).readAsText("pass.json"));
    const auxiliaryValues = (passJson.storeCard?.auxiliaryFields ?? []).map((field: { value?: string }) =>
      String(field.value ?? ""),
    );

    expect(auxiliaryValues).toContain("Ava Kelly");
    expect(auxiliaryValues).not.toContain("Demo User");
  });

  it("returns a graceful 5xx error when wallet cert env vars are missing", async () => {
    const originalCert = process.env.PASS_CERT_B64;
    delete process.env.PASS_CERT_B64;

    try {
      const response = await GET(new Request("http://localhost:3100/api/wallet/pass"));
      const bodyText = await response.text();

      expect([500, 503]).toContain(response.status);
      expect(bodyText.toLowerCase()).toMatch(/wallet pass not configured|wallet.*configured/);
      expect(bodyText).not.toMatch(/BEGIN CERTIFICATE|BEGIN PRIVATE KEY|\/Users\//);
    } finally {
      if (typeof originalCert === "string") {
        process.env.PASS_CERT_B64 = originalCert;
      }
    }
  });
});
