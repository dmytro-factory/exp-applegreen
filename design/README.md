# Applegreen Fast Charge - design source (Figma via html.to.design)

Pixel-faithful HTML/CSS mockups of the 13 core frames. These are the **design
source of truth**: we import them into Figma with the **html.to.design** plugin,
review/approve there, then regenerate the app from Figma on each iteration.

- Device size: **393 x 852** (iPhone 15 / 14 Pro).
- Tokens: `mockups/tokens.css` (mirrors `recon/design-tokens.json`).
- Icons: [lucide](https://lucide.dev) loaded from CDN, so frames must be rendered
  with JavaScript enabled (the import-by-URL method below handles this).

## Frames

| # | File | Screen |
|---|------|--------|
| 1 | `mockups/01-splash.html` | Splash / branding |
| 2 | `mockups/02-login.html` | Login (+ guest) |
| 3 | `mockups/03-create-account.html` | Create account - Account Details |
| 4 | `mockups/04-list-home.html` | List / home (Nearest / Favourites / Recent) |
| 5 | `mockups/05-map.html` | Map (filter chips + station card) |
| 6 | `mockups/06-site-detail.html` | Site detail (chargers list) |
| 7 | `mockups/07-charger-detail.html` | Charger detail (Connectors tab) |
| 8 | `mockups/08-start-charge.html` | Start charge + charging in progress (2 states) |
| 9 | `mockups/09-peak-times.html` | Peak charging times chart |
| 10 | `mockups/10-profile.html` | Profile |
| 11 | `mockups/11-rewards.html` | Rewards home (NEW) |
| 12 | `mockups/12-activity.html` | Activity history (NEW) |
| 13 | `mockups/13-vehicles.html` | My Vehicles - EV + ICE (NEW) |

`mockups/index.html` renders every frame in a gallery for a quick local review.

## 1. Preview locally

From the repo root, serve the folder so lucide icons and `tokens.css` resolve:

```bash
npx serve design/mockups
# or
python3 -m http.server 8080 --directory design/mockups
```

Open the printed URL (e.g. `http://localhost:3000` or `http://localhost:8080`)
and check `index.html` for the full gallery, or a single frame such as
`/04-list-home.html`.

## 2. Install html.to.design in Figma

1. In Figma: **Menu -> Plugins -> Manage plugins** (or the Community tab).
2. Search **"html.to.design"** and install it.
3. Open a new Figma file -> **Plugins -> html.to.design**.

## 3. Import each frame (import by URL - recommended)

The URL importer renders the page in a real browser, so the lucide icons and all
CSS are captured.

1. Keep the local server from step 1 running.
2. If Figma cannot reach `localhost`, expose it first:
   ```bash
   npx localtunnel --port 8080
   # or: ngrok http 8080
   ```
3. In html.to.design choose **Import web page / URL**.
4. Paste a frame URL (e.g. `http://localhost:8080/04-list-home.html` or the
   tunnel URL `https://<sub>.loca.lt/04-list-home.html`).
5. Set viewport width to **393** and import. Repeat for all 13 frames.
6. Frame 8 contains two phone states side by side; import it once and detach the
   two phones into separate Figma frames if you want them split.

**Alternative - paste code:** html.to.design also has an **Import HTML code**
mode. Because the frames rely on CDN icons + external `tokens.css`, prefer the
URL method. If you must paste code, inline `tokens.css` into the file's `<style>`
and replace the lucide `<i data-lucide>` tags with their SVGs first.

## 4. Review & approve (Phase 1 gate)

- Confirm colours match the tokens: teal `#006551`, lime `#62A60E`, availability
  badge `#BBDECB`, app bg `#EEF2FE`, white cards, ~16px radii.
- Confirm the 13 frames read correctly at 393px.
- Approve in Figma. **This is the Phase 1 approval gate** - the app build
  (Phase 2) starts only after sign-off.

## 5. Enable the Figma -> code round-trip (after approval)

Authenticate the Figma MCP server so future look/feel edits flow Figma -> code:

```bash
droid mcp add figma https://mcp.figma.com/mcp --type http
```

Then `/mcp` to complete auth. After that, design tweaks made in Figma can be
pulled back into the Next.js app.
