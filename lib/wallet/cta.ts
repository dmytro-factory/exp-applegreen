const DEFAULT_MEMBER_ID = "guest";
const DEFAULT_MEMBER_NAME = "Guest Member";

type WalletHrefInput = {
  name: string;
  points: number;
} | null;

function normalizeMemberName(name: string | null | undefined): string {
  if (typeof name !== "string") {
    return "";
  }

  return name.trim();
}

function normalizePoints(points: number | null | undefined): number {
  if (typeof points !== "number" || !Number.isFinite(points)) {
    return 0;
  }

  return Math.max(0, Math.round(points));
}

export function createWalletMemberId(name: string | null | undefined): string {
  const normalizedName = normalizeMemberName(name);

  if (!normalizedName) {
    return DEFAULT_MEMBER_ID;
  }

  const slug = normalizedName
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  if (!slug) {
    return DEFAULT_MEMBER_ID;
  }

  return `member-${slug}`;
}

export function buildWalletPassHref(input: WalletHrefInput): string {
  const name = normalizeMemberName(input?.name);
  const points = normalizePoints(input?.points);

  const params = new URLSearchParams({
    member: createWalletMemberId(name),
    name: name || DEFAULT_MEMBER_NAME,
    points: String(name ? points : 0),
  });

  return `/api/wallet/pass?${params.toString()}`;
}