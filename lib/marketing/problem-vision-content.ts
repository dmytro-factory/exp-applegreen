export type ComparisonColumn = {
  key: "applegreen" | "shellGoPlus";
  label: string;
  subtitle: string;
};

export type ComparisonFeature = {
  title: string;
  description: string;
  availability: {
    applegreen: boolean;
    shellGoPlus: boolean;
  };
};

export type VisionMockup = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export const problemComparisonColumns: ComparisonColumn[] = [
  {
    key: "applegreen",
    label: "Applegreen Rewards",
    subtitle: "Current experience",
  },
  {
    key: "shellGoPlus",
    label: "Shell Go+",
    subtitle: "Best-in-class benchmark",
  },
];

export const problemComparisonFeatures: ComparisonFeature[] = [
  {
    title: "Coffee Club",
    description: "Collect punches and unlock free coffees.",
    availability: {
      applegreen: true,
      shellGoPlus: true,
    },
  },
  {
    title: "Fuel discount",
    description: "Convert loyalty points into cents-per-litre savings.",
    availability: {
      applegreen: false,
      shellGoPlus: true,
    },
  },
  {
    title: "Partner offers",
    description: "Redeem rewards beyond the forecourt.",
    availability: {
      applegreen: false,
      shellGoPlus: true,
    },
  },
  {
    title: "Station locator",
    description: "Find nearby stations, services, and route stops.",
    availability: {
      applegreen: false,
      shellGoPlus: true,
    },
  },
];

export const visionBodyCopy =
  "Our vision is a mobile-first loyalty journey built for every road-trip, every family stop, and every Parcelconnect pickup along the way.";

export const visionMockups: VisionMockup[] = [
  {
    src: "/images/vision-roadtrip-mockup.svg",
    alt: "Road-trip planner mobile mockup with route checkpoints",
    width: 1080,
    height: 2160,
  },
  {
    src: "/images/vision-family-mockup.svg",
    alt: "Family and Parcelconnect rewards mobile mockup",
    width: 1080,
    height: 2160,
  },
];

export const livePrototypeConfig = {
  iframeSrc: "/app",
  ctaHref: "/app",
  ctaLabel: "Try the prototype",
} as const;
