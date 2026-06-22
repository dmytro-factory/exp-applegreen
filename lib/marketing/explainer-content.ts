export const appStoreInfo = {
  url: "https://apps.apple.com/gb/app/applegreen-fast-charge/id1599542560",
  name: "Applegreen Fast Charge",
  developer: "Applegreen Electric IRL Limited",
  rating: 1.4,
  ratingCount: 102,
} as const;

export const explainerIntro =
  "This isn't a from-scratch concept. We started from Applegreen's live Fast Charge app, rebuilt it faithfully into a design and codebase your team controls, and layered in the loyalty programme it's missing.";

export type DriverQuote = { quote: string; source: string };

export const driverQuotes: DriverQuote[] = [
  {
    quote: "The charging point itself was brilliant, fast and efficient. I just gave up on the app and paid contactless.",
    source: "App Store review",
  },
  {
    quote: "Signing up is the worst, it loses data moving back and forwards, and it doesn't support Apple Pay.",
    source: "App Store review",
  },
  {
    quote: "It didn't have my car listed, so I had to pick the wrong one.",
    source: "App Store review",
  },
];

export type ScreenChallenge = { title: string; description: string };

export const appTodayThemes: ScreenChallenge[] = [
  {
    title: "A sign-up that asks for a lot",
    description: "Name, address and date of birth before a first charge, and the form can drop data when you step back.",
  },
  {
    title: "No Apple Pay or Wallet",
    description: "Card entry only, with authorisation errors that push drivers to pay contactless at a higher rate.",
  },
  {
    title: "An incomplete vehicle list",
    description: "Popular EV models are missing, so drivers end up selecting the wrong car to get going.",
  },
  {
    title: "Nothing that brings drivers back",
    description: "Charge, pay, leave. There is no loyalty layer rewarding repeat visits to the network.",
  },
];

export type RebuildStep = { step: number; title: string; description: string };

export const rebuildSteps: RebuildStep[] = [
  {
    step: 1,
    title: "Start from the live app",
    description: "We took the shipping App Store app and real driver feedback as the brief, not a blank page.",
  },
  {
    step: 2,
    title: "Reverse-engineer every flow",
    description: "Splash, login, map, site detail, charging and account, captured and rebuilt screen by screen.",
  },
  {
    step: 3,
    title: "Bring it into Figma",
    description: "The full screen set now lives as an editable Figma file your design team owns, not a locked black box.",
  },
  {
    step: 4,
    title: "Ship it as a web app",
    description: "Rebuilt in Next.js and deployed on Vercel, running on the same real station and charger data.",
  },
  {
    step: 5,
    title: "Add the loyalty layer",
    description: "Points, tiers, rewards and saved vehicles, layered onto the charging journey that already works.",
  },
];

export const figmaShowcase = {
  src: "/images/explainer/figma-board.png",
  alt: "Applegreen Fast Charge screens reverse-engineered as editable frames in Figma",
  width: 1623,
  height: 309,
  fileLabel: "applegreen-fast-charge · Figma",
} as const;

export type LoyaltyAddition = { title: string; description: string };

export const loyaltyAdditions: LoyaltyAddition[] = [
  {
    title: "Points on every kWh",
    description: "Drivers earn automatically while they charge, with no extra taps.",
  },
  {
    title: "Tiers worth chasing",
    description: "Seedling, Sprout and Orchard status unlock better perks over time.",
  },
  {
    title: "Rewards at the same stops",
    description: "Free coffee, money off charging and meal deals at Welcome Break and Applegreen.",
  },
  {
    title: "Saved vehicles and history",
    description: "A complete car list plus a clear record of every charging session.",
  },
];

export type AppShot = { src: string; alt: string; caption: string };

export const loyaltyShots: AppShot[] = [
  { src: "/images/explainer/m-list.png", alt: "Rebuilt charger list screen", caption: "Find a charger" },
  { src: "/images/explainer/m-charge.png", alt: "Charging complete screen awarding loyalty points", caption: "Earn while you charge" },
  { src: "/images/explainer/m-rewards.png", alt: "Rewards and tier progress screen", caption: "Rewards that return" },
];

export const walletCardCta = {
  href: "/api/wallet/pass",
  label: "Add loyalty card to Apple Wallet",
} as const;

export const livePrototypeConfig = {
  iframeSrc: "/app",
  ctaHref: "/app",
  ctaLabel: "Open the live app",
} as const;
