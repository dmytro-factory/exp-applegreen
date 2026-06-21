# Applegreen Fast Charge - reverse-engineering analysis

Consolidated from the App Store listing (v9.1.14), the 10 canonical marketing
screenshots in `appstore/`, and live iPhone-Mirroring captures in `FLOW.md`.
This is the narrative + structural source of truth for the faithful clone and the
later explainer site.

## 1. What the app is

Applegreen Fast Charge is the driver-facing companion app for **Applegreen
Electric**, the rapid EV-charging network operated across Applegreen / Welcome
Break motorway service areas in the UK and Ireland. The app helps an EV driver:

- find a nearby charging **site** (motorway services / forecourt),
- see which **chargers** at that site are free, how fast they are, and the price,
- **start and pay** for a charging session (pay-per-use, per kWh), and
- manage their account / plan / billing.

It is a utility app: the entire job-to-be-done is "get me charging, now, with the
least friction". That framing matters for the demo because the real app adds
friction at almost every step.

## 2. Pain points (the demo narrative)

These are the documented, public problems we lean on to justify the rebuild:

- **~1.4-star rating.** The app store rating is poor; reviews repeatedly cite
  reliability and a clunky payment/sign-in journey.
- **No Apple Pay / Google Pay.** Payment is a manual card flow rather than the
  one-tap wallet drivers expect at a charger in the rain.
- **Heavy mandatory signup.** Before charging you are pushed through: select
  country -> select a plan -> a long Account Details form (first/last name,
  business toggle, email, mobile for SMS verification, password + confirm,
  privacy/terms toggle, marketing toggles). "Continue as guest" exists but is
  buried and inconsistent.
- **Verification friction.** SMS verification "for other purposes related to your
  account" is required, adding a step at the worst possible moment.
- **No loyalty / value back.** Applegreen is a forecourt brand (coffee, fuel,
  food, parcels) yet the charging app gives drivers nothing for repeat custom and
  does not connect charging to the wider Applegreen spend. This is the gap our
  loyalty layer fills.

**Our thesis for the clone:** keep the look and the core charging flow faithful,
strip the signup to "guest-first", simulate one-tap start, and add a simple
loyalty layer that ties EV charging to coffee/fuel spend so the brand actually
rewards repeat drivers.

## 3. Information architecture

Two entry states:

- **Onboarding stack (pre-auth):** Splash -> Login (or Continue as guest) ->
  Create account: Select country -> Select a plan -> Account Details.
- **Main app (tabbed):** the real app ships three bottom tabs - **Map**,
  **List**, **Profile (avatar)**. The charging flow is reached by drilling in:

```
List / Map
  -> Site detail (chargers at this site)
       -> Charger detail (Connectors / Details / Map / Peak Time tabs)
            -> Start charge (Connect cable -> Swipe to start -> charging in progress)
                 -> Session complete
```

Profile is a settings surface: personal info, language, marketing toggles, plan,
billing address, country, About (website / feedback / privacy / terms / version).

**Clone IA change:** we add a **Rewards** tab, so the bottom bar becomes
**Map · List · Rewards · Profile**. Charging is still reached via the
site -> charger drill-down (unchanged), so the faithful flow is preserved.

## 4. Per-screen breakdown

Frame numbers match `design/mockups/` and the 13-frame list in the plan.

| # | Screen | Key elements | Source |
|---|--------|--------------|--------|
| 1 | Splash / branding | Bridge/forecourt backdrop, centred "applegreen fast charge" wordmark + leaf logo | `appstore/01.png` |
| 2 | Login | Wordmark, "Log in", email (envelope) + password (lock, eye toggle), "Forgot password?", green "Log in", "Create account" (top-right), "Continue as guest" (bottom) | `01_login.png` |
| 3 | Create account - Account Details | Back / title / Next nav; First name*, Last name*, business-customer toggle, Email*, Mobile phone* + SMS hint, Security (password* + confirm*), privacy/terms toggle, marketing toggle (+ SMS sub-toggle). Country + plan steps precede it | `06_signup_form.png`, FLOW.md |
| 4 | List / home | Teal header with wordmark + search; sections **Nearest / Favourites / Recent**, each a horizontal row of white station cards: distance (superscript unit), site name + building icon, address, charger count `16/16` (green plug icon), Navigate + Favourite pill buttons; "View all" links; bottom tabs | `appstore/02.png` |
| 5 | Map | Teal header; filter chips row (**Connector type**, **Charger speed**, **Available** w/ green dot) + filter icon; map base with site pin; floating list + locate FABs (teal); bottom station card mirroring the list card | `appstore/03.png`, `map_filters.png` |
| 6 | Site detail | Teal header: Back, site name, heart + navigate icons; address + distance; vertical list of charger cards: charger name, Combo CCS, ⚡ Up to 360kW, N Available, £/kWh | `appstore/04.png` |
| 7 | Charger detail - Connectors | Cards per connector: "Available" badge (light-green), plug icon + "CCS A/B", ⚡ Up to 360kW, £/kWh; bottom tabs **Connectors / Details / Map / Peak Time** | `appstore/05.png` |
| 8 | Start charge + charging in progress | Connector summary card (Available badge, Site/Charger lines, kW, price); steps "1. CONNECT CABLE / 2. SWIPE TO CHARGE"; large teal pill "Connect & Swipe To Start" (circular arrow); "Call customer service" link. Progress state: ring %, kWh delivered, time, cost, Stop | `appstore/06.png` |
| 9 | Peak times | "Peak Charging Times" title; hour-of-day histogram, lime bars, current hour bar teal; x-axis 06/10/14/18/22/02; bottom tabs (Peak Time active) | `appstore/07.png` |
| 10 | Profile | Teal header Back/Profile/Save; Personal Information fields; Language row; marketing master toggle + SMS/Email/Push sub-toggles card; privacy/terms toggle; Billing Address; Country | `appstore/08.png` |
| 11 | Rewards home (NEW) | Points balance, tier (e.g. Sprout -> Orchard), progress to next tier, earn categories (charge / coffee / fuel / food), quick redeem entry | clone addition |
| 12 | Activity history (NEW) | Timeline of line items: EV charge sessions, coffee, fuel/petrol - each with points earned and spend | clone addition |
| 13 | My Vehicles (NEW) | List of saved vehicles: EV (connector type, default for charging) + ICE/petrol car (for the multi-car / fuel story); add vehicle | clone addition |

Reference-only screens from the real app, folded into Profile rather than given a
dedicated frame: **Add plan** (`appstore/09.png`, pay-per-use plan card) and
**About** (`appstore/10.png`).

## 5. Data model

The clone is backed by static CSV (no real integrations). Two core entities plus
loyalty state in localStorage.

**Station (site)** - one row per service area:

- `id`, `name`, `address`, `country` (UK/IE), `lat`, `lng`
- `operator` (e.g. Welcome Break), `network` ("Applegreen Electric")
- derived: distance (computed from user/mock location), `chargers_available` /
  `chargers_total` (aggregated from chargers)
- amenities for the loyalty story: `coffee`, `fuel`, `food`, `shop`

**Charger** - one row per charging unit, FK to station:

- `id`, `station_id`, `name` (e.g. "Newport Pagnell North 1")
- `connector_type` (Combo CCS / CCS / CHAdeMO / Type 2)
- `max_kw` (e.g. 360, 175, 75, 50)
- `count_available`, `count_total` (per unit, usually small)
- `price_per_kwh` (£, varies by site)
- `status` (Available / In use / Offline)
- optional second connector (CCS A / CCS B) modelled as separate rows or a
  connector sub-list

**Loyalty (localStorage)**

- `points_balance`, `tier` (id + label + threshold), lifetime points
- `activity[]`: `{ id, type: charge|coffee|fuel|food, title, timestamp, spend,
  kwh?, points_earned }`
- `vehicles[]`: `{ id, kind: ev|ice, make, model, reg, connector?, default }`
- `redemptions[]`: `{ id, reward, cost_points, timestamp }`

## 6. Visual system

See `design-tokens.json` for the canonical values. Summary:

- **Header / primary:** teal-green `#006551` (header bar, primary buttons,
  toggles-on, selected chips, active tab, wordmark, links).
- **Accent:** lime `#62A60E` (peak-chart bars, leaf in logo, plug/charger glyph).
- **Availability badge:** `#BBDECB` background with `#006551` text.
- **App background:** `#EEF2FE` (cool lavender); **cards** white.
- **Radii:** ~16px cards, pill buttons/chips, 8px badges.
- **Type:** Apple system font stack; bold ~22px titles, 16px body, superscript
  units on distances (`272Ft`, `35.46mi`).
- **Icons:** `lucide-react` (mapping in `design-tokens.json`).

## 7. Sources

- `appstore/01.png`-`10.png` - canonical App Store marketing screenshots (1290x2796).
- `appstore/01_login.png`, `02_create_account.png`, `06_signup_form.png`,
  `map_filters.png`, `navigate_to_stations.png`, `report_a_problem_with_station.png`
  - live iPhone-Mirroring captures.
- `FLOW.md` - the click-through flow map and onboarding transitions.
