import { DODO_CHECKOUT_URL, DODO_MODE, LICENSE_RECHECK_DAYS } from "@/config";
import { toast } from "sonner";
import { isExtension } from "./tabs";

// Pro is unlocked with a Dodo Payments license key. The activate and validate
// endpoints are public (no API key), so the extension calls them directly.
const DODO_API = DODO_MODE === "live" ? "https://live.dodopayments.com" : "https://test.dodopayments.com";
const LICENSE_KEY = "proLicense";

interface StoredLicense {
  key: string;
  instanceId: string;
  validatedAt: number;
}

async function readLicense(): Promise<StoredLicense | undefined> {
  if (!isExtension) return undefined;
  const data = await chrome.storage.local.get(LICENSE_KEY);
  return data[LICENSE_KEY] as StoredLicense | undefined;
}

async function writeLicense(license: StoredLicense | null): Promise<void> {
  if (!isExtension) return;
  if (license) await chrome.storage.local.set({ [LICENSE_KEY]: license });
  else await chrome.storage.local.remove(LICENSE_KEY);
}

async function postDodo<T>(path: string, body: object): Promise<T> {
  const res = await fetch(`${DODO_API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Dodo ${path} failed: ${res.status}`);
  return res.json();
}

// Activates a license key on this browser. Returns an error message, or null on success.
export async function activateLicense(rawKey: string): Promise<string | null> {
  const key = rawKey.trim();
  if (!key) return "Paste your license key first.";
  if (!isExtension) return "License keys only work inside the installed extension.";
  try {
    const instance = await postDodo<{ id: string }>("/licenses/activate", {
      license_key: key,
      name: `Chrome ${new Date().toISOString().slice(0, 10)}`,
    });
    await writeLicense({ key, instanceId: instance.id, validatedAt: Date.now() });
    return null;
  } catch {
    return "That key didn't work. Check it, or it may have hit its activation limit.";
  }
}

export async function isProUser(): Promise<boolean> {
  const license = await readLicense();
  if (!license) return false;

  const recheckAfter = license.validatedAt + LICENSE_RECHECK_DAYS * 24 * 60 * 60 * 1000;
  if (Date.now() < recheckAfter) return true;

  try {
    const { valid } = await postDodo<{ valid: boolean }>("/licenses/validate", {
      license_key: license.key,
      license_key_instance_id: license.instanceId,
    });
    if (!valid) {
      // Refunded, disabled or expired.
      await writeLicense(null);
      return false;
    }
    await writeLicense({ ...license, validatedAt: Date.now() });
    return true;
  } catch {
    // Offline or Dodo unreachable: don't punish paying users.
    return true;
  }
}

export async function removeLicense(): Promise<void> {
  const license = await readLicense();
  if (license) {
    // Frees the activation slot so the key can be used on another browser.
    postDodo("/licenses/deactivate", {
      license_key: license.key,
      license_key_instance_id: license.instanceId,
    }).catch(() => {});
  }
  await writeLicense(null);
}

export const canUpgrade = DODO_CHECKOUT_URL !== "";

export function openUpgradePage(): void {
  if (!canUpgrade) {
    toast("Pro is cooking. Coming soon. 🍳");
    return;
  }
  if (isExtension) chrome.tabs.create({ url: DODO_CHECKOUT_URL });
  else window.open(DODO_CHECKOUT_URL, "_blank");
}

export function onLicenseChanged(callback: () => void): () => void {
  if (!isExtension) return () => {};
  const listener = (changes: Record<string, chrome.storage.StorageChange>, area: string) => {
    if (area === "local" && LICENSE_KEY in changes) callback();
  };
  chrome.storage.onChanged.addListener(listener);
  return () => chrome.storage.onChanged.removeListener(listener);
}
