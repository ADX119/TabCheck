// Guards the built extension before it ships. Run after `vite build`.
// Fails if a permission, host or security policy changes without updating the
// allowlists below on purpose, or if a release tag doesn't match the version.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist";
const ALLOWED_PERMISSIONS = ["notifications", "storage"];
const ALLOWED_OPTIONAL_PERMISSIONS = ["tabs"];
const ALLOWED_HOSTS = ["https://live.dodopayments.com/*", "https://test.dodopayments.com/*"];
const EXPECTED_CSP =
  "default-src 'self'; script-src 'self'; object-src 'none'; style-src 'self' 'unsafe-inline'; " +
  "img-src 'self' data:; font-src 'self'; " +
  "connect-src https://live.dodopayments.com https://test.dodopayments.com; " +
  "base-uri 'none'; form-action 'none'";

const errors = [];
const fail = (msg) => errors.push(msg);
const sameSet = (a = [], b = []) => a.length === b.length && a.every((x) => b.includes(x));

const manifest = JSON.parse(readFileSync(join(DIST, "manifest.json"), "utf8"));
const pkg = JSON.parse(readFileSync("package.json", "utf8"));

if (manifest.manifest_version !== 3) fail("manifest_version must be 3");
if (manifest.version !== pkg.version) {
  fail(`manifest version ${manifest.version} != package.json version ${pkg.version}`);
}

// RELEASE_TAG is set by the release workflow (e.g. "v1.2.0").
const tag = process.env.RELEASE_TAG;
if (tag && tag !== `v${manifest.version}`) {
  fail(`release tag ${tag} doesn't match manifest version v${manifest.version}`);
}

if (!sameSet(manifest.permissions, ALLOWED_PERMISSIONS)) {
  fail(`permissions changed: ${JSON.stringify(manifest.permissions)}`);
}
if (!sameSet(manifest.optional_permissions, ALLOWED_OPTIONAL_PERMISSIONS)) {
  fail(`optional_permissions changed: ${JSON.stringify(manifest.optional_permissions)}`);
}
if (!sameSet(manifest.host_permissions, ALLOWED_HOSTS)) {
  fail(`host_permissions changed: ${JSON.stringify(manifest.host_permissions)}`);
}
if (manifest.content_scripts) fail("content_scripts are not expected");
if (manifest.externally_connectable) fail("externally_connectable is not expected");
if (manifest.web_accessible_resources) fail("web_accessible_resources are not expected");

const csp = manifest.content_security_policy?.extension_pages;
if (csp !== EXPECTED_CSP) fail(`content_security_policy changed: ${csp}`);
if (manifest.content_security_policy?.sandbox) fail("sandbox CSP is not expected");

// Every file the manifest points at must exist in the build.
const referenced = [
  manifest.background?.service_worker,
  manifest.action?.default_popup,
  ...Object.values(manifest.icons ?? {}),
  ...Object.values(manifest.action?.default_icon ?? {}),
];
for (const file of referenced) {
  if (!file || !existsSync(join(DIST, file))) fail(`missing file referenced by manifest: ${file}`);
}

// No remote code: the built HTML may only load bundled scripts and styles.
for (const file of readdirSync(DIST).filter((f) => f.endsWith(".html"))) {
  const html = readFileSync(join(DIST, file), "utf8");
  if (/<(script|link)[^>]+(src|href)=["']https?:/i.test(html)) {
    fail(`${file} loads a remote script or stylesheet`);
  }
}

if (errors.length) {
  console.error("Manifest check failed:\n - " + errors.join("\n - "));
  process.exit(1);
}
console.log(`Manifest check passed (v${manifest.version}).`);
