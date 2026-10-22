# Security Policy

## Reporting a vulnerability

Please **don't open a public issue** for security problems.

Report it privately through GitHub: **Security → Report a vulnerability** on this repository (private vulnerability reporting). Include what you found, how to reproduce it, and what an attacker could do with it.

You'll get a reply within 7 days. Once a fix ships you'll be credited, unless you'd rather not be.

## Supported versions

Only the latest version published on the Chrome Web Store gets security fixes.

## How the extension is protected

- **No remote code.** Everything the extension runs is bundled at build time. A strict content security policy only allows the extension's own scripts and only lets it talk to Dodo Payments.
- **Minimal permissions.** Counting tabs needs no permission. Access to tab URLs (`tabs`) is optional and only requested when you first clean up.
- **No secrets in the extension.** Pro uses Dodo's public license endpoints. There is no API key in the code to steal.
- **Local data only.** The tab graveyard and license key stay in your browser's extension storage. Only `http(s)` pages are saved or restored.
- **Checked on every change.** CI runs lint, type checks, unit tests, a dependency audit, CodeQL, and a manifest guard that fails if permissions or the security policy change unexpectedly.

## Known limits

Any browser extension runs on the user's own machine, so someone can modify their local copy to unlock Pro for themselves. That only affects their own browser. It can't touch other users, payments, or the published extension.
