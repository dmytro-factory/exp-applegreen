import { createHash } from "node:crypto";
import { brand } from "../brand";
import { ensureQrEncodable } from "../qr";
import { tierFromPoints } from "../loyalty/storage";

const DEFAULT_MEMBER_ID = "demo";
const DEFAULT_POINTS = 0;
const DEFAULT_PASS_TYPE_IDENTIFIER = "pass.ie.applegreen.demo";
const DEFAULT_TEAM_IDENTIFIER = "APPLEGREENDEMO";
const PARCEL_BACKFIELD_COPY = "Parcel ready at Applegreen Naas Road";

export type WalletPassInput = {
  memberId?: string | null;
  points?: number;
  persistedTier?: string | null;
};

export type WalletPassOptions = {
  passTypeIdentifier?: string | null;
  teamIdentifier?: string | null;
};

function normalizeMemberId(memberId?: string | null): string {
  const stripped = memberId?.trim() ?? "";
  if (!stripped) {
    return DEFAULT_MEMBER_ID;
  }

  const ascii = stripped
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return ascii.length > 0 ? ascii.slice(0, 96) : DEFAULT_MEMBER_ID;
}

function normalizePoints(points?: number): number {
  if (typeof points !== "number" || !Number.isFinite(points)) {
    return DEFAULT_POINTS;
  }

  return Math.max(0, Math.round(points));
}

function normalizePassTypeIdentifier(passTypeIdentifier?: string | null): string {
  const value = passTypeIdentifier?.trim();
  if (value && value.startsWith("pass.")) {
    return value;
  }

  return DEFAULT_PASS_TYPE_IDENTIFIER;
}

function normalizeTeamIdentifier(teamIdentifier?: string | null): string {
  const value = teamIdentifier?.trim();
  return value ? value : DEFAULT_TEAM_IDENTIFIER;
}

function toRgbString(hexColor: string): string {
  const hex = hexColor.replace("#", "");
  if (hex.length !== 6) {
    return "rgb(101, 154, 39)";
  }

  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);
  return `rgb(${red}, ${green}, ${blue})`;
}

export function createWalletSerialNumber(memberId: string): string {
  const digest = createHash("sha1").update(`applegreen:${memberId}`).digest("hex");
  return `applegreen-${digest.slice(0, 24)}`;
}

export function createWalletBarcodeMessage(memberId: string): string {
  const message = `member:${memberId}`;
  return ensureQrEncodable(message);
}

export function buildWalletPassJson(input: WalletPassInput, options: WalletPassOptions = {}) {
  const memberId = normalizeMemberId(input.memberId);
  const points = normalizePoints(input.points);
  const tier = tierFromPoints(points);
  const barcodeMessage = createWalletBarcodeMessage(memberId);

  return {
    formatVersion: 1,
    passTypeIdentifier: normalizePassTypeIdentifier(options.passTypeIdentifier),
    teamIdentifier: normalizeTeamIdentifier(options.teamIdentifier),
    serialNumber: createWalletSerialNumber(memberId),
    organizationName: "Applegreen",
    description: "Applegreen loyalty rewards pass",
    logoText: "Applegreen Rewards",
    foregroundColor: "rgb(255, 255, 255)",
    backgroundColor: toRgbString(brand.colors.primary),
    labelColor: "rgb(255, 255, 255)",
    barcodes: [
      {
        format: "PKBarcodeFormatQR",
        message: barcodeMessage,
        messageEncoding: "iso-8859-1",
      },
    ],
    storeCard: {
      primaryFields: [{ key: "points", label: "POINTS", value: points }],
      secondaryFields: [{ key: "tier", label: "TIER", value: tier }],
      backFields: [
        { key: "parcel", label: "Parcelconnect", value: PARCEL_BACKFIELD_COPY },
      ],
    },
  };
}
