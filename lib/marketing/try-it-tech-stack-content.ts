export const walletPassCta = {
  href: "/api/wallet/pass",
  label: "Add to Apple Wallet",
} as const;

export const tryItInstructions = [
  "Open iOS Simulator and launch Safari.",
  "Scan the QR code (or type the URL) to open this demo on the current origin.",
  "Tap Add to Apple Wallet to download the pass from /api/wallet/pass.",
  "Choose Install / Add in Wallet to finish the Simulator flow.",
] as const;

export const simulatorDisclaimer =
  "This pass is self-signed and Simulator only. It will not install on a real iPhone — real iPhones will reject this pass.";

export const techStackItems = [
  "Next.js 15 + TypeScript for the app and API surface",
  "Tailwind CSS with shared Applegreen brand tokens",
  "Vitest for contract-focused validation",
] as const;

export const phaseTwoCallout = {
  title: "Phase 2 (production wallet rollout)",
  items: [
    "Register an official Apple Pass Type ID and signing certificates.",
    "Enable APNs live updates for pass refreshes and status changes.",
    "Add NFC payload support for forecourt and in-store tap flows.",
    "Ship a Google Wallet pass alongside Apple Wallet for platform parity.",
  ],
} as const;
