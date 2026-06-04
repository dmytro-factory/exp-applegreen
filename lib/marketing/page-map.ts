export type MarketingSection = {
  id: string;
  label: string;
};

export const marketingPageMap: MarketingSection[] = [
  { id: "hero", label: "Home" },
  { id: "problem", label: "Problem" },
  { id: "vision", label: "Vision" },
  { id: "try-it-now", label: "Try it now" },
  { id: "live-prototype", label: "Live prototype" },
];

export const heroKpis = [
  { value: 500, label: "stations" },
  { value: 3, label: "countries" },
  { value: 1, label: "wallet" },
] as const;

export const marketingShellMetadata = {
  title: "Applegreen Rewards 2.0 | Marketing",
  description:
    "Applegreen Rewards 2.0 loyalty demo with a marketing overview, hero metrics, and in-page navigation.",
} as const;
