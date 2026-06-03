export const brand = {
  name: "Applegreen",
  sampledFrom: {
    url: "https://applegreenstores.com/wp-content/themes/applegreen-clickworks/dist/styles/main1.css",
    notes: "Hex values sampled from live CSS via curl on 2026-06-03",
  },
  colors: {
    primary: "#659A27",
    accent: "#6E9D36",
    dark: "#35570E",
    white: "#FFFFFF",
    ink: "#1F2817",
  },
  fonts: {
    base: "Inter",
    heading: "Manrope",
  },
} as const;

export type Brand = typeof brand;
