import forge from "node-forge";

type CertEnv = NodeJS.ProcessEnv;

export type WalletPassCertificates = {
  wwdr: Buffer;
  signerCert: Buffer;
  signerKey: Buffer;
  signerKeyPassphrase: string;
};

export class WalletPassConfigurationError extends Error {
  constructor(message = "Wallet pass not configured.") {
    super(message);
    this.name = "WalletPassConfigurationError";
  }
}

function requireEnvVar(name: string, env: CertEnv): string {
  const value = env[name]?.trim();
  if (!value) {
    throw new WalletPassConfigurationError("Wallet pass not configured.");
  }

  return value;
}

function decodeBase64ToUtf8(name: string, value: string): string {
  try {
    const decoded = Buffer.from(value, "base64").toString("utf8");
    if (!decoded.trim()) {
      throw new Error(`${name} is empty after decode`);
    }
    return decoded;
  } catch {
    throw new WalletPassConfigurationError("Wallet pass not configured.");
  }
}

function validateCertificates(certPem: string, wwdrPem: string, keyPem: string, passphrase: string) {
  try {
    forge.pki.certificateFromPem(certPem);
    forge.pki.certificateFromPem(wwdrPem);
    const key = forge.pki.decryptRsaPrivateKey(keyPem, passphrase);
    if (!key) {
      throw new Error("Unable to decrypt signer key.");
    }
  } catch {
    throw new WalletPassConfigurationError("Wallet pass not configured.");
  }
}

export function loadWalletPassCertificates(env: CertEnv = process.env): WalletPassCertificates {
  const certB64 = requireEnvVar("PASS_CERT_B64", env);
  const keyB64 = requireEnvVar("PASS_KEY_B64", env);
  const wwdrB64 = requireEnvVar("WWDR_B64", env);
  const passphrase = requireEnvVar("PASS_KEY_PASSPHRASE", env);

  const signerCertPem = decodeBase64ToUtf8("PASS_CERT_B64", certB64);
  const signerKeyPem = decodeBase64ToUtf8("PASS_KEY_B64", keyB64);
  const wwdrPem = decodeBase64ToUtf8("WWDR_B64", wwdrB64);

  validateCertificates(signerCertPem, wwdrPem, signerKeyPem, passphrase);

  return {
    signerCert: Buffer.from(signerCertPem, "utf8"),
    signerKey: Buffer.from(signerKeyPem, "utf8"),
    wwdr: Buffer.from(wwdrPem, "utf8"),
    signerKeyPassphrase: passphrase,
  };
}
