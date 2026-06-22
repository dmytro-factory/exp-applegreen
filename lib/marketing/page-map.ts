export type MarketingSection = {
  id: string;
  label: string;
};

export const marketingPageMap: MarketingSection[] = [
  { id: "hero", label: "Home" },
  { id: "today", label: "The app today" },
  { id: "control", label: "In your control" },
  { id: "loyalty", label: "Loyalty layer" },
  { id: "live-prototype", label: "Live demo" },
];

export const heroKpis = [
  { value: 13, label: "screens rebuilt" },
  { value: 30, label: "charging sites" },
  { value: 3, label: "loyalty tiers" },
] as const;

export const marketingShellMetadata = {
  title: "Applegreen Fast Charge | Reimagined",
  description:
    "We reverse-engineered the live Applegreen Fast Charge app into an editable Figma and web prototype your team controls, then layered in a loyalty programme.",
} as const;
