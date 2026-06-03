import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import forge from "node-forge";

type CertificateMaterial = {
  certPem: string;
  keyPem: string;
};

const DEFAULT_PASS_TYPE_IDENTIFIER = "pass.ie.applegreen.demo";
const ENV_PATH = resolve(process.cwd(), ".env.local");

function generateSerialNumber(): string {
  return randomBytes(16).toString("hex");
}

function buildSelfSignedCertificate(options: {
  commonName: string;
  organizationName: string;
  organizationalUnitName: string;
  isCertificateAuthority?: boolean;
  keyPassphrase?: string;
}): CertificateMaterial {
  const { commonName, organizationName, organizationalUnitName, isCertificateAuthority = false, keyPassphrase } = options;
  const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001 });
  const certificate = forge.pki.createCertificate();

  certificate.publicKey = keyPair.publicKey;
  certificate.serialNumber = generateSerialNumber();
  certificate.validity.notBefore = new Date(Date.now() - 60_000);
  certificate.validity.notAfter = new Date(Date.now() + 3650 * 24 * 60 * 60 * 1000);

  const subject = [
    { name: "commonName", value: commonName },
    { name: "organizationName", value: organizationName },
    { shortName: "OU", value: organizationalUnitName },
    { name: "countryName", value: "IE" },
  ];

  certificate.setSubject(subject);
  certificate.setIssuer(subject);
  certificate.setExtensions([
    {
      name: "basicConstraints",
      cA: isCertificateAuthority,
    },
    {
      name: "keyUsage",
      digitalSignature: true,
      keyEncipherment: true,
      keyCertSign: isCertificateAuthority,
      cRLSign: isCertificateAuthority,
    },
    {
      name: "extKeyUsage",
      serverAuth: true,
      clientAuth: true,
      codeSigning: true,
    },
    {
      name: "subjectKeyIdentifier",
    },
  ]);

  certificate.sign(keyPair.privateKey, forge.md.sha256.create());

  const certPem = forge.pki.certificateToPem(certificate);
  const keyPem = keyPassphrase
    ? forge.pki.encryptRsaPrivateKey(keyPair.privateKey, keyPassphrase, { algorithm: "aes256" })
    : forge.pki.privateKeyToPem(keyPair.privateKey);

  return { certPem, keyPem };
}

function toBase64(pem: string): string {
  return Buffer.from(pem, "utf8").toString("base64");
}

function upsertEnvVars(filePath: string, values: Record<string, string>): void {
  const orderedEntries = Object.entries(values);
  let content = existsSync(filePath) ? readFileSync(filePath, "utf8") : "";

  for (const [key, value] of orderedEntries) {
    const line = `${key}=${value}`;
    const keyRegex = new RegExp(`^${key}=.*$`, "m");

    if (keyRegex.test(content)) {
      content = content.replace(keyRegex, line);
      continue;
    }

    if (content.length > 0 && !content.endsWith("\n")) {
      content += "\n";
    }

    content += `${line}\n`;
  }

  if (content.length > 0 && !content.endsWith("\n")) {
    content += "\n";
  }

  writeFileSync(filePath, content, "utf8");
}

function main(): void {
  const passTypeIdentifier = process.env.PASS_TYPE_IDENTIFIER ?? DEFAULT_PASS_TYPE_IDENTIFIER;

  if (!passTypeIdentifier.startsWith("pass.")) {
    throw new Error(`PASS_TYPE_IDENTIFIER must start with "pass." (received "${passTypeIdentifier}")`);
  }

  const passphrase = randomBytes(24).toString("base64url");
  const passCertificate = buildSelfSignedCertificate({
    commonName: passTypeIdentifier,
    organizationName: "Applegreen Rewards",
    organizationalUnitName: "Wallet Pass",
    keyPassphrase: passphrase,
  });

  const wwdrCertificate = buildSelfSignedCertificate({
    commonName: "Apple Worldwide Developer Relations Certification Authority (Self-Signed)",
    organizationName: "Applegreen Rewards",
    organizationalUnitName: "WWDR Mock",
    isCertificateAuthority: true,
  });

  const envValues = {
    PASS_CERT_B64: toBase64(passCertificate.certPem),
    PASS_KEY_B64: toBase64(passCertificate.keyPem),
    WWDR_B64: toBase64(wwdrCertificate.certPem),
    PASS_KEY_PASSPHRASE: passphrase,
  };

  upsertEnvVars(ENV_PATH, envValues);

  console.log(`Generated wallet certificate material for ${passTypeIdentifier}`);
  console.log(`PASS_CERT_B64=${envValues.PASS_CERT_B64}`);
  console.log(`PASS_KEY_B64=${envValues.PASS_KEY_B64}`);
  console.log(`WWDR_B64=${envValues.WWDR_B64}`);
  console.log(`PASS_KEY_PASSPHRASE=${envValues.PASS_KEY_PASSPHRASE}`);
  console.log(`Updated ${ENV_PATH}`);
}

main();
