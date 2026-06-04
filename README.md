# Applegreen Rewards 2.0 Demo

## Setup

### Prerequisites

- Node.js 26+
- `pnpm` 10+
- Xcode + iOS Simulator (for Wallet install demo steps)

### Environment variables

Copy `.env.example` to `.env.local` and keep those variable names in sync:

```bash
cp .env.example .env.local
```

The cert generator fills `.env.local` values for:
`PASS_CERT_B64`, `PASS_KEY_B64`, `WWDR_B64`, and `PASS_KEY_PASSPHRASE`.

> `scripts/generate-cert.ts` resolves `.env.local` from `process.cwd()`, so run cert commands from the repository root.

### Install / run / test / build

```bash
pnpm install
pnpm dev
pnpm test
pnpm build
```

### Cert generator

Use either command below (from repo root):

```bash
pnpm generate:cert
pnpm exec tsx scripts/generate-cert.ts
```

## Demo Runbook

1. Open iOS Simulator and launch Safari.
2. Scan the QR code (or type the URL) to open this demo on the current origin.
3. Tap Add to Apple Wallet to download the pass from `/api/wallet/pass`.
4. Choose Install / Add in Wallet to finish the Simulator flow.

```bash
xcrun simctl pkpass add <pkpass-path-or-booted>
```

5. Walk the PWA flow:
   - Earn points in `/app/earn`
   - Redeem in `/app/redeem`
   - Open `/app/wallet` and download the pass again
6. Confirm Wallet updates:
   - points and tier shown in the pass reflect your latest in-app balance
   - the pass remains Simulator-only (self-signed; real iPhones reject it)

## Phase-2 callout (production wallet rollout)

- Register an official Apple Pass Type ID and signing certificates.
- Enable APNs live updates for pass refreshes and status changes.
- Add NFC payload support for forecourt and in-store tap flows.
- Ship a Google Wallet pass alongside Apple Wallet for platform parity.
