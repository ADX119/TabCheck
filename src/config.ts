// ─────────────────────────────────────────────────────────────
// Things YOU need to fill in before publishing.
// ─────────────────────────────────────────────────────────────

// Your extension id from https://extensionpay.com (register the extension there,
// connect Stripe, and create the Pro plan). Must match exactly.
export const EXTPAY_ID = "tab-brainrot-meter";

// Where the "Donate" button sends people (Ko-fi, Buy Me a Coffee, GoFundMe,
// GitHub Sponsors, PayPal.me...). Leave it empty to hide the button.
export const DONATION_URL = "";

// Shown on the upgrade button. Keep it in sync with the price set on ExtensionPay.
export const PRO_PRICE_LABEL = "$4.99 once";

// ─────────────────────────────────────────────────────────────
// Tunables
// ─────────────────────────────────────────────────────────────

// "Close extra tabs" keeps this many of your most recently used tabs.
export const KEEP_RECENT_TABS = 10;

// Pro "close idle tabs" closes tabs nobody has looked at for this long.
export const IDLE_TAB_HOURS = 24;

// How many closed tabs the graveyard remembers.
export const GRAVEYARD_LIMIT = 200;
