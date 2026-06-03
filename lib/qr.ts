import QRCode from "qrcode";

const DEFAULT_QR_PAYLOAD = "about:blank";

export function normalizeQrPayload(payload: string | null | undefined): string {
  const normalized = payload?.trim();
  return normalized ? normalized : DEFAULT_QR_PAYLOAD;
}

export function ensureQrEncodable(payload: string | null | undefined): string {
  const normalized = normalizeQrPayload(payload);
  QRCode.create(normalized, { errorCorrectionLevel: "M" });
  return normalized;
}

export async function createQrDataUrl(payload: string | null | undefined, width = 192): Promise<string> {
  const normalized = ensureQrEncodable(payload);

  return QRCode.toDataURL(normalized, {
    errorCorrectionLevel: "M",
    margin: 1,
    width,
    color: {
      dark: "#111827",
      light: "#FFFFFF",
    },
  });
}
