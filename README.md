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
npm run dev     # preview the popup in a normal browser with fake tabs
npm run build   # type-check and build the extension into dist/
npm run zip     # build and create tab-brainrot-meter.zip for the Chrome Web Store
```

Load it locally: open `chrome://extensions`, turn on Developer mode, click **Load unpacked** and pick the `dist/` folder.

## Permissions

| Permission | Why |
|---|---|
| `notifications` | Brainrot level notifications |
| `storage` | Tab graveyard, notification state, saved license key |
| `tabs` (optional) | Requested the first time you clean up. Needed to read tab URLs and titles for duplicates and the graveyard. |
| `live.dodopayments.com`, `test.dodopayments.com` | Activating and checking Pro license keys |

Counting tabs needs no permission, so installing shows no "read your browsing history" warning.
