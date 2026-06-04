import { createHash } from "node:crypto";
import { PARCELCONNECT_NOTIFICATION_COPY } from "@/lib/loyalty/home";
import { tierFromPoints } from "@/lib/loyalty/storage";
import { ensureQrEncodable } from "@/lib/qr";
import { WalletPassConfigurationError } from "@/lib/wallet/certificates";
import { brand } from "@/lib/brand";

const DEFAULT_MEMBER_ID = "demo";
const DEFAULT_MEMBER_NAME = "Guest Member";
const DEFAULT_POINTS = 0;
const DEFAULT_PASS_TYPE_IDENTIFIER = "pass.ie.applegreen.demo";
const DEFAULT_TEAM_IDENTIFIER = "APPLEGREENDEMO";

export type WalletPassInput = {
  memberId?: string | null;
  memberName?: string | null;
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

function normalizeNameForPass(memberName?: string | null): string {
  const stripped = memberName?.trim() ?? "";
  if (!stripped) {
    return DEFAULT_MEMBER_NAME;
  }

  return stripped.slice(0, 80);
}

function normalizePassTypeIdentifier(passTypeIdentifier?: string | null): string {
  const value = passTypeIdentifier?.trim();
  if (!value) {
    return DEFAULT_PASS_TYPE_IDENTIFIER;
  }

  if (!value.startsWith("pass.")) {
    throw new WalletPassConfigurationError("Wallet pass not configured.");
  }

  return value;
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
  const memberName = normalizeNameForPass(input.memberName);
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
    foregroundColor: toRgbString(brand.colors.white),
    backgroundColor: toRgbString(brand.colors.primary),
    labelColor: toRgbString(brand.colors.white),
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
      auxiliaryFields: [{ key: "memberName", label: "MEMBER", value: memberName }],
      backFields: [
        { key: "parcel", label: "Parcelconnect", value: PARCELCONNECT_NOTIFICATION_COPY },
      ],
    },
  };
}
