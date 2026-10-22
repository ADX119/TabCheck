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

Everything you need to fill in is in `src/config.ts`.

1. **Dodo Payments account:** sign up at https://dodopayments.com and finish identity and business verification. Individuals can choose the unregistered business type. Have your PAN, a photo ID, proof of address and your bank details ready.
2. **Pro product:** in the Dodo dashboard, create a one-time product (e.g. $4.99) and turn on **License keys**. An activation limit of 3 lets people use it on a few browsers. Buyers get the key by email after paying.
3. **Checkout link:** copy the product's checkout link into `DODO_CHECKOUT_URL`. Until it's set, the Go Pro button is hidden and Pro buttons say "coming soon".
4. **Test, then go live:** keep `DODO_MODE = "test"` and buy with a Dodo test card to check the whole flow (pay → email with key → "Enter your license key" → Pro unlocked). Then switch to `"live"` and use the live checkout link.
5. **Price label:** update `PRO_PRICE_LABEL` to match your Dodo price.
6. **Donations (optional):** put a tip link (Ko-fi, Buy Me a Coffee, Razorpay payment page, UPI...) in `DONATION_URL`, and your Phantom **public** Solana address in `SOLANA_TIP_ADDRESS`.
7. **Privacy policy:** add your contact email to `PRIVACY.md` and host it somewhere public (GitHub Pages or a gist).

### How Pro unlocking works

The extension calls Dodo's public license endpoints directly (no secret API key in the extension):
`POST /licenses/activate` when a key is entered, `POST /licenses/validate` once every 7 days, and `POST /licenses/deactivate` when the user clicks "Remove key". A refunded or disabled key stops being Pro at the next check. If Dodo can't be reached, paying users keep Pro.

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
| **CI** (`ci.yml`) | Every PR and push to `main` | Clean install, dependency audit, lint, type check, unit tests, build, manifest guard, and a downloadable zip under the run's *Artifacts* |
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
