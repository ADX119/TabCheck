// Guards the website in site/ before it ships (it's what Dodo Payments reviews).
// Fails on unfilled placeholders, broken internal links, anything loaded from
// another origin, inline code the CSP would block, a sitemap that doesn't match
// the pages, or missing security headers.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const SITE = "site";
const ORIGIN = "https://tab-brainrot.vercel.app";
const LEGAL_PAGES = ["terms", "privacy", "refund", "contact"];
const REQUIRED_HEADERS = [
  "Content-Security-Policy",
  "Strict-Transport-Security",
  "X-Content-Type-Options",
  "X-Frame-Options",
  "Referrer-Policy",
  "Permissions-Policy",
];

const errors = [];
const fail = (msg) => errors.push(msg);

const pages = readdirSync(SITE).filter((f) => f.endsWith(".html"));
const textFiles = [...pages, "robots.txt", "sitemap.xml", ".well-known/security.txt", "site.js", "styles.css"];

for (const file of textFiles) {
  const text = readFileSync(join(SITE, file), "utf8");
  const placeholder = text.match(/\{\{[A-Z_]+\}\}/);
  if (placeholder) fail(`${file} still contains ${placeholder[0]}`);
}

// "/privacy" -> privacy.html (Vercel cleanUrls), "/" -> index.html
function resolves(path) {
  const clean = path.split(/[?#]/)[0];
  if (clean === "/" || clean === "") return true;
  const rel = clean.replace(/^\//, "");
  return existsSync(join(SITE, rel)) || existsSync(join(SITE, `${rel}.html`));
}

const sitemap = readFileSync(join(SITE, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

for (const file of pages) {
  const html = readFileSync(join(SITE, file), "utf8");
  const name = file.replace(/\.html$/, "");
  const indexable = !/<meta name="robots" content="noindex"/.test(html);

  if (!/<html lang="en">/.test(html)) fail(`${file}: missing <html lang>`);
  if (!/<title>[^<]+<\/title>/.test(html)) fail(`${file}: missing <title>`);

  // CSP is script-src 'self'; style-src 'self': no inline code or remote assets.
  for (const m of html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>/g)) {
    if (!/type="application\/ld\+json"/.test(m[1])) fail(`${file}: inline <script> is blocked by the CSP`);
  }
  if (/<style[\s>]/.test(html)) fail(`${file}: inline <style> is blocked by the CSP`);
  if (/\sstyle="/.test(html)) fail(`${file}: style="" attributes are blocked by the CSP`);
  if (/\son[a-z]+="/.test(html)) fail(`${file}: inline event handlers are blocked by the CSP`);
  for (const m of html.matchAll(/<(script|link|img|source|iframe)\b[^>]*\b(src|href)="(https?:)?\/\/(?!tab-brainrot\.vercel\.app\/)/g)) {
    fail(`${file}: loads a <${m[1]}> from another origin`);
  }

  for (const m of html.matchAll(/\shref="(\/[^"]*)"/g)) {
    if (!resolves(m[1])) fail(`${file}: broken link ${m[1]}`);
  }

  if (indexable) {
    const url = name === "index" ? `${ORIGIN}/` : `${ORIGIN}/${name}`;
    if (!html.includes(`<link rel="canonical" href="${url}" />`)) fail(`${file}: canonical should be ${url}`);
    if (!/<meta\s+name="description"/.test(html)) fail(`${file}: missing meta description`);
    if (!sitemapUrls.includes(url)) fail(`sitemap.xml is missing ${url}`);
  }
}

for (const url of sitemapUrls) {
  if (!url.startsWith(`${ORIGIN}/`) || !resolves(url.slice(ORIGIN.length))) fail(`sitemap.xml lists a missing page: ${url}`);
}

// Dodo's verification looks for these on every page, usually in the footer.
for (const file of pages) {
  const html = readFileSync(join(SITE, file), "utf8");
  for (const page of LEGAL_PAGES) {
    if (!html.includes(`href="/${page}"`)) fail(`${file}: footer doesn't link /${page}`);
  }
}

const vercel = JSON.parse(readFileSync(join(SITE, "vercel.json"), "utf8"));
const globalHeaders = vercel.headers?.find((h) => h.source === "/(.*)")?.headers ?? [];
for (const key of REQUIRED_HEADERS) {
  if (!globalHeaders.some((h) => h.key === key)) fail(`vercel.json is missing the ${key} header`);
}
const csp = globalHeaders.find((h) => h.key === "Content-Security-Policy")?.value ?? "";
if (!csp.includes("default-src 'none'") || !csp.includes("frame-ancestors 'none'")) {
  fail("vercel.json CSP must keep default-src 'none' and frame-ancestors 'none'");
}

const robots = readFileSync(join(SITE, "robots.txt"), "utf8");
if (!robots.includes(`Sitemap: ${ORIGIN}/sitemap.xml`)) fail("robots.txt must point at the sitemap");

const securityTxt = readFileSync(join(SITE, ".well-known/security.txt"), "utf8");
const expires = securityTxt.match(/^Expires: (.+)$/m)?.[1];
if (!expires || new Date(expires) <= new Date()) fail("security.txt Expires is missing or in the past");

if (errors.length) {
  console.error("Site check failed:\n - " + errors.join("\n - "));
  process.exit(1);
}
console.log(`Site check passed (${pages.length} pages).`);
