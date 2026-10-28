# Tab Brainrot Meter 🧠🚽

A Chrome extension that counts your open tabs and roasts your brainrot level, then helps you clean up.

| Tabs | Level | |
|---|---|---|
| 0–10 | Sigma Mode | 🗿 |
| 11–25 | Mid Behavior | 😐 |
| 26–50 | Lowkey Cooked | 🍳 |
| 51–100 | Skibidi Brainrot | 🚽 |
| 101+ | Tung Tung Tung Sahur | 🪵 |

Every tab costs you 100 aura. You get notifications as you cross 10, 15, 20, 25, 35, 50, 67, 75 and 100 tabs.

## Features

**Free**
- Live tab count, brainrot meter, roasts and "diagnostics"
- Brainrot notifications
- "Touch grass": close everything except your 10 most recently used tabs, with a confirmation and Undo
- Pinned tabs, tabs playing audio and the current tab are never closed

**Pro** (one-time payment through [Dodo Payments](https://dodopayments.com), unlocked with a license key)
- Kill duplicate tabs
- Close tabs idle for 24h+
- Tab graveyard: restore any of your last 200 closed tabs (free users can restore their latest cleanup)

The popup footer also has an optional donate link and a "Tip in SOL" button that copies your Phantom (Solana) address.

## Setup before publishing

Extension settings are in `src/config.ts`. The website is in `site/`.

1. **Website:** the site at https://tab-brainrot.vercel.app (pricing, Terms, Privacy, Refund and Contact pages) is what Dodo reviews and what the Chrome Web Store links to for the privacy policy. It deploys from `site/` on every push to `main`. See [Website](#website).
2. **Dodo Payments account:** sign up at https://dodopayments.com. You can build and test everything in **test mode** straight away.
3. **Pro product:** in the Dodo dashboard, create a License Key entitlement under **Entitlements** (activations limit **3**, no expiration, automatic fulfillment), then create a one-time $4.99 product and attach the entitlement to it. Buyers get the key by email after paying.
4. **Checkout link:** copy the product's checkout link into `DODO_CHECKOUT_URL`. Until it's set, the Go Pro button is hidden and Pro buttons say "coming soon". Swap the "Checkout opens at launch" placeholder in `site/index.html` for the same link.
5. **Test the whole flow:** keep `DODO_MODE = "test"`, load the extension unpacked, and buy with a Dodo test card: pay → email with key → "Enter your license key" → Pro unlocked → refund it in the dashboard → Pro is removed at the next check.
6. **Verification:** fill in Product Information (use the website URL and the same description and price shown on it), then identity (Persona: photo ID and selfie) and bank details. The bank account name must match your ID. Dodo checks the form against the live site, so publish it first.
7. **Go live:** after approval, switch to `DODO_MODE = "live"`, use the live checkout link, and bump the version.
8. **Price label:** keep `PRO_PRICE_LABEL`, the site's pricing section and Dodo's price in sync.
9. **Donations (optional):** put a tip link (Ko-fi, Buy Me a Coffee, Razorpay payment page, UPI...) in `DONATION_URL`, and your Phantom **public** Solana address in `SOLANA_TIP_ADDRESS`.

### How Pro unlocking works

The extension calls Dodo's public license endpoints directly (no secret API key in the extension):
`POST /licenses/activate` when a key is entered, `POST /licenses/validate` once every 7 days, and `POST /licenses/deactivate` when the user clicks "Remove key". A refunded or disabled key stops being Pro at the next check. If Dodo can't be reached, paying users keep Pro.

## Website

A static site in `site/` with no build step and no dependencies, deployed to Vercel (project root directory `site`). It has the homepage with pricing, the legal pages, `robots.txt`, `sitemap.xml`, `/.well-known/security.txt` and a 404 page.

- **No cookies or third-party requests**, so no cookie banner is needed. Fonts and icons are served from the site itself. Keep it that way, or the Privacy Policy has to change.
- **Visitor stats:** Vercel Web Analytics (cookie-free) via `/_vercel/insights/script.js` on every page. Turn it on in the Vercel project under **Analytics → Enable**; the script returns 404 until then. Its data points are listed in the Privacy Policy's "Visitor statistics" section. Update that section if you add Speed Insights or custom events.
- **Security headers** live in `site/vercel.json`: a strict CSP (`default-src 'none'`, scripts and styles only from the site), HSTS, no framing, `nosniff` and a locked-down Permissions-Policy. Because of the CSP, pages can't use inline `<script>`, `<style>`, `style=""` or `onclick=""`.
- **Site guard:** `npm run check:site` (also run in CI) fails on unfilled `{{PLACEHOLDERS}}`, broken internal links, assets from other domains, inline code the CSP blocks, a sitemap or canonical URL that doesn't match the pages, legal pages missing from a footer, missing security headers, or an expired `security.txt`.
- **Keep the facts in sync:** price, features, refund window and activation limit appear in the extension, the site and Dodo. Change all three together. When a policy changes, update its "Effective" date and the `lastmod` in `sitemap.xml`. Renew the `Expires` date in `security.txt` every year; the guard fails once it passes.

Preview locally: `npx serve site` (or any static server pointed at `site/`).

## Development

```sh
npm install
npm run dev        # preview the popup in a normal browser with fake tabs
npm test           # unit tests
npm run lint
npm run build      # type-check and build the extension into dist/
npm run zip        # build, check the manifest, create tab-brainrot-meter.zip
```

Load it locally: open `chrome://extensions`, turn on Developer mode, click **Load unpacked** and pick the `dist/` folder.

## CI/CD

| Workflow | When | What it does |
|---|---|---|
| **CI** (`ci.yml`) | Every PR and push to `main` | Clean install, dependency audit, lint, type check, unit tests, build, manifest guard, site guard, and a downloadable zip under the run's *Artifacts* |
| **CodeQL** (`codeql.yml`) | Every PR, push to `main`, and weekly | GitHub's security scanner for the code and the workflows. Findings show under *Security → Code scanning*. |
| **Release** (`release.yml`) | Pushing a tag like `v1.0.1` | Runs every check, confirms the tag matches the manifest version, creates a GitHub Release with the zip, and uploads a draft to the Chrome Web Store (once secrets are set) |
| **Dependabot** (`dependabot.yml`) | Weekly | Opens PRs for npm and GitHub Actions updates, and right away for security fixes |

The manifest guard (`scripts/check-manifest.mjs`) fails the build if permissions, host access or the content security policy change. If you add a permission on purpose, update the allowlist in that script in the same PR.

### Releasing a new version

1. Bump `version` in both `package.json` and `public/manifest.json` (e.g. `1.0.1`) and merge it into `main`.
2. Tag the merged commit and push the tag:
   ```sh
   git checkout main && git pull
   git tag v1.0.1 && git push origin v1.0.1
   ```
3. The Release workflow builds and checks everything, then creates the GitHub Release.
4. If Chrome Web Store secrets are set, it uploads the new version as a draft. Open the [developer dashboard](https://chrome.google.com/webstore/devconsole) and click **Submit for review**.

### Chrome Web Store auto-upload (optional)

Follow the [chrome-webstore-upload-keys guide](https://github.com/fregante/chrome-webstore-upload-keys) to get the OAuth credentials. Then in GitHub: **Settings → Environments → New environment** named `chrome-web-store`. Add yourself under *Required reviewers*, and add these environment secrets:

`CWS_EXTENSION_ID`, `CWS_PUBLISHER_ID`, `CWS_CLIENT_ID`, `CWS_CLIENT_SECRET`, `CWS_REFRESH_TOKEN`

Without them the upload step is skipped and you upload the zip from the GitHub Release by hand.

## Security

See [`SECURITY.md`](SECURITY.md) for how to report a vulnerability and how the extension is protected.

**Owner checklist.** These settings can't be set from code and matter most:

- [ ] **Two-factor authentication** on GitHub, the Google account that owns the Chrome Web Store listing, and Dodo Payments. A stolen store account could push a malicious update to every user.
- [ ] **Branch protection on `main`** (Settings → Rules → Rulesets): require a pull request, require the *Lint, test, build* and *Analyze code* checks to pass, block force pushes and deletions.
- [ ] **Private vulnerability reporting** (Settings → Code security → enable it), plus **Dependabot alerts** and **secret scanning with push protection**.
- [ ] **Actions:** Settings → Actions → General → *Workflow permissions: Read repository contents*.
- [ ] Never commit API keys or OAuth tokens. Store secrets only in the `chrome-web-store` environment.

## Permissions

| Permission | Why |
|---|---|
| `notifications` | Brainrot level notifications |
| `storage` | Tab graveyard, notification state, saved license key |
| `tabs` (optional) | Requested the first time you clean up. Needed to read tab URLs and titles for duplicates and the graveyard. |
| `live.dodopayments.com`, `test.dodopayments.com` | Activating and checking Pro license keys |

Counting tabs needs no permission, so installing shows no "read your browsing history" warning.
