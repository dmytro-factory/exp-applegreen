export const brand = {
  name: "Applegreen Fast Charge",
  sampledFrom: {
    url: "App Store screenshots v9.1.14 and live iPhone Mirroring captures (recon/)",
    notes: "Teal charging palette sampled from the Fast Charge app on 2026-06-21",
  },
  colors: {
    primary: "#006551",
    primaryHover: "#00543F",
    accent: "#62A60E",
    dark: "#00402F",
    badgeBg: "#BBDECB",
    appBg: "#EEF2FE",
    white: "#FFFFFF",
    ink: "#1A1A1A",
  },
  fonts: {
    base: "Inter",
    heading: "Manrope",
  },
} as const;

/**
 * SVG data URLs are rendered as external image sources and cannot consume CSS variables like
 * `var(--brand-primary)`. Keep these carve-outs anchored to the single brand token source.
 */
export function getBrandPrimaryHexForDataUrl(): string {
  return brand.colors.primary;
}

export type Brand = typeof brand;
