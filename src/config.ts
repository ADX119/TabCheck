// ─────────────────────────────────────────────────────────────
// Things YOU need to fill in before publishing.
// ─────────────────────────────────────────────────────────────

// Dodo Payments: "test" while trying it out with test cards, "live" for real money.
export const DODO_MODE: "test" | "live" = "test";

// Checkout link for the Pro product. In the Dodo dashboard: create a one-time
// product with "License keys" turned on, then copy its payment / checkout link.
// Leave it empty to hide the Go Pro button.
export const DODO_CHECKOUT_URL = "";

// Shown on the upgrade button. Keep it in sync with the price set in Dodo.
export const PRO_PRICE_LABEL = "$4.99 once";

// The website in site/, deployed on Vercel. Buyers agree to its terms and
// refund policy, linked under the Go Pro button.
export const WEBSITE_URL = "https://tab-brainrot.vercel.app";

// Where the "Donate" link sends people (Ko-fi, Buy Me a Coffee, Razorpay
// payment page, UPI link...). Leave it empty to hide the link.
export const DONATION_URL = "";

// Your Phantom (Solana) wallet address for crypto tips. Public address only,
// never the secret phrase. Leave it empty to hide the button.
export const SOLANA_TIP_ADDRESS = "";

// ─────────────────────────────────────────────────────────────
// Tunables
// ─────────────────────────────────────────────────────────────

// "Close extra tabs" keeps this many of your most recently used tabs.
export const KEEP_RECENT_TABS = 10;

// Pro "close idle tabs" closes tabs nobody has looked at for this long.
export const IDLE_TAB_HOURS = 24;

// How many closed tabs the graveyard remembers.
export const GRAVEYARD_LIMIT = 200;

// How often a saved license key is re-checked with Dodo.
export const LICENSE_RECHECK_DAYS = 7;
