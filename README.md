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

**Pro** (one-time payment through [ExtensionPay](https://extensionpay.com))
- Kill duplicate tabs
- Close tabs idle for 24h+
- Tab graveyard: restore any of your last 200 closed tabs (free users can restore their latest cleanup)

There's also an optional donate link at the bottom of the popup.

## Setup before publishing

1. **ExtensionPay:** sign up at https://extensionpay.com, register the extension, connect Stripe and create a one-time plan. Put the extension id in `EXTPAY_ID` in `src/config.ts`.
2. **Donations:** put your Ko-fi, Buy Me a Coffee, GoFundMe or PayPal.me link in `DONATION_URL` in `src/config.ts`. Leave it empty to hide the button.
3. **Price label:** update `PRO_PRICE_LABEL` in `src/config.ts` to match your ExtensionPay price.
4. **Privacy policy:** host `PRIVACY.md` somewhere public (a GitHub Pages URL or a gist works) and add your contact email to it.

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
| `storage` | Tab graveyard, notification state, ExtensionPay paid status |
| `tabs` (optional) | Requested the first time you clean up. Needed to read tab URLs and titles for duplicates and the graveyard. |
| Content script on `extensionpay.com` | Lets ExtensionPay unlock Pro the moment payment succeeds |

Counting tabs needs no permission, so installing shows no "read your browsing history" warning.
