# applegreen fast charge - Reverse-engineering flow map

Sources:
- `appstore/` - 10 official marketing screenshots from the App Store (1290x2796, version 9.1.14). Canonical reference for what the app is meant to look like.
- `screens/` - live captures from iPhone Mirroring (driven via `.factory/skills/use-iphone-mirroring/scripts/capture.sh`).

Method: iPhone Mirroring + ctrl-macos (vision/coordinate driven; no a11y tree).
Click mapping (Retina 2x): `screen_x = win_x + crop_px/2`, `screen_y = win_y + crop_px/2`.

## App Store screenshot catalog (canonical screens)

| File | Screen | Notes |
|---|---|---|
| `appstore/01.png` | Splash / branding | Bridge backdrop, "applegreen fast charge" logotype |
| `appstore/02.png` | List view (home) | Nearest / Favourites / Recent station cards, bottom tabs (Map, List, Profile FL) |
| `appstore/03.png` | Map view | Apple Maps base, filter chips (Connector type, Charger speed, Available), station pin + bottom card |
| `appstore/04.png` | Site detail / chargers list | Per-charger rows: connector type, max kW, availability, price |
| `appstore/05.png` | Charger detail / connectors | "CCS A" / "CCS B" cards, bottom tabs: Connectors / Details / Map / Peak Time |
| `appstore/06.png` | Start charge | Connect cable + Swipe to charge (large green primary), "Call customer service" link |
| `appstore/07.png` | Peak charging times | Histogram by hour of day |
| `appstore/08.png` | Profile (post-login) | First/Last name, Email, Mobile Phone, Language, marketing toggles, terms toggle, Billing Address, Country |
| `appstore/09.png` | Add plan | "Applegreen Electric Irish Pay-Per-Use" card, paginated dots |
| `appstore/10.png` | About | Visit Website / Send Feedback / Privacy / Terms, version footer |

## Screens

### 01 - Login (entry)
File: `screens/01_login.png`
Elements:
- App logo: "applegreen fast charge"
- Heading: "Log in"
- Link (top-right): "Create account"
- Field: Email (envelope icon)
- Field: Password (lock icon, eye toggle)
- Link: "Forgot password?"
- Button (primary green): "Log in"
- Link (bottom): "Continue as guest"
Transitions:
- Create account -> 02 Select your country
- Continue as guest -> (TBD)
- Log in -> (needs credentials)

### 02 - Select your country (create-account step 1)
File: `screens/02_create_account.png`
Elements:
- Nav: "Back" (left), title "Select your country", "Next" (right, disabled until selection)
- Radio: "United Kingdom (£)"
- Radio: "Ireland (€)"
Transitions:
- Back -> 01 Login
- Select UK (£) -> radio fills, "Next" enables (screens/03_country_selected.png)
- Next -> 04 Select a plan -> 07 Account Details

Tap fractions (this device, win 883,180 418x920):
- UK radio: 0.08, 0.21
- Ireland radio: 0.08, 0.265
- Next (top-right): ~0.9, 0.13
- Back (top-left): ~0.1, 0.13

### 03 - Select a plan (create-account step 2)
File: `screens/06_signup_form.png`
Elements:
- Nav: "Back", "Select a plan", "Next"
- Applegreen Electric UK - Pay-Per-Use (default selected)
- Radio: Applegreen Electric Ireland - Pay-Per-Use (disabled/unselected)
Transitions:
- Next -> 04 Account Details

### 04 - Account Details (create-account step 3)
File: `screens/07_after_plan.png` (empty form), `screens/15_after_submit.png` (validation error)
Elements:
- Nav: "Back", "Account Details", "Next"
- Field: First Name*
- Field: Last Name*
- Toggle: "I am a business customer"
- Field: Email*
- Field: Mobile Phone*
- Hint: "We'll contact you via text for verification and other purposes related to your account."
- Section: Security
- Field: Password* (with complexity hint)
- Field: Confirm Password*
- Toggle: "I agree to the Privacy Policy and Terms and Conditions*"
- Toggle: "I would like to receive marketing updates."
  - Sub-toggle: SMS "Receive offers and updates via SMS."
Important: text entry via `mctrl keyboard type` does NOT route to the iPhone through iPhone Mirroring. Requires physical Mac keyboard or on-screen keyboard taps.
Transitions:
- Back -> 03 Select a plan
- Next (needs all required fields + terms) -> (TBD, blocked by text entry limitation)
