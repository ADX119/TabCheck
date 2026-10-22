import { GRAVEYARD_LIMIT } from "@/config";

export interface TabInfo {
  id?: number;
  url?: string;
  title?: string;
  favIconUrl?: string;
  lastAccessed?: number;
  pinned?: boolean;
  audible?: boolean;
  active?: boolean;
}

export interface GraveEntry {
  id: string;
  url: string;
  title: string;
  favIconUrl?: string;
  closedAt: number;
  batchId: number;
}

const GRAVEYARD_KEY = "graveyard";

export const isExtension =
  typeof chrome !== "undefined" && !!chrome.tabs && !!chrome.storage;

// ─── Dev preview fallback (vite dev server, no chrome.* APIs) ────────────────

const mockTabs: TabInfo[] = Array.from(
  { length: Math.floor(Math.random() * 80) + 5 },
  (_, i) => ({
    id: i + 1,
    url: `https://example.com/${i % 7 === 0 ? "dupe" : `page-${i}`}`,
    title: i % 7 === 0 ? "Some article I'll totally read" : `Very important tab #${i + 1}`,
    lastAccessed: Date.now() - i * 60 * 60 * 1000,
    pinned: i === 0,
  })
);
let mockGraveyard: GraveEntry[] = [];

// ─── Tabs ────────────────────────────────────────────────────────────────────

export async function getAllTabs(): Promise<TabInfo[]> {
  if (!isExtension) return [...mockTabs];
  return chrome.tabs.query({});
}

// URLs and titles need the optional "tabs" permission. Asking only when the user
// first cleans up keeps the scary "read your browsing history" warning off the
// install screen. Must be called directly from a click handler.
export async function ensureTabsPermission(): Promise<boolean> {
  if (!isExtension) return true;
  try {
    return await chrome.permissions.request({ permissions: ["tabs"] });
  } catch {
    return false;
  }
}

function isProtected(tab: TabInfo): boolean {
  return !!(tab.pinned || tab.audible || tab.active);
}

function byMostRecent(a: TabInfo, b: TabInfo): number {
  return (b.lastAccessed || 0) - (a.lastAccessed || 0);
}

// Only ordinary web pages go into (and come back out of) the graveyard. This
// keeps tampered storage from reopening javascript:, file: or chrome: URLs.
export function isRestorableUrl(url: string | undefined): url is string {
  if (!url) return false;
  try {
    const { protocol } = new URL(url);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeUrl(url = ""): string {
  return url.split("#")[0].replace(/\/$/, "");
}

// Keep the `keep` most recently used tabs; never close pinned, audible or active tabs.
export function pickExtraTabs(tabs: TabInfo[], keep: number): TabInfo[] {
  return [...tabs].sort(byMostRecent).slice(keep).filter((t) => !isProtected(t));
}

// For each URL, keep the most recently used copy (or a protected one) and close the rest.
export function pickDuplicateTabs(tabs: TabInfo[]): TabInfo[] {
  const groups = new Map<string, TabInfo[]>();
  for (const tab of tabs) {
    if (!tab.url) continue;
    const key = normalizeUrl(tab.url);
    groups.set(key, [...(groups.get(key) || []), tab]);
  }
  const toClose: TabInfo[] = [];
  for (const group of groups.values()) {
    if (group.length < 2) continue;
    const sorted = [...group].sort(
      (a, b) => Number(isProtected(b)) - Number(isProtected(a)) || byMostRecent(a, b)
    );
    toClose.push(...sorted.slice(1).filter((t) => !isProtected(t)));
  }
  return toClose;
}

export function pickIdleTabs(tabs: TabInfo[], hours: number): TabInfo[] {
  const cutoff = Date.now() - hours * 60 * 60 * 1000;
  return tabs.filter((t) => !isProtected(t) && (t.lastAccessed || 0) < cutoff);
}

// Closes tabs and buries them in the graveyard. Returns the graveyard batch id.
export async function closeTabs(tabs: TabInfo[]): Promise<number> {
  const batchId = Date.now();
  const entries: GraveEntry[] = tabs
    .filter((t) => isRestorableUrl(t.url))
    .map((t, i) => ({
      id: `${batchId}-${i}`,
      url: t.url!,
      title: t.title || t.url!,
      favIconUrl: t.favIconUrl,
      closedAt: batchId,
      batchId,
    }));
  await saveGraveyard([...entries, ...(await getGraveyard())].slice(0, GRAVEYARD_LIMIT));

  const ids = tabs.map((t) => t.id).filter((id): id is number => id !== undefined);
  if (!isExtension) {
    for (const id of ids) mockTabs.splice(mockTabs.findIndex((t) => t.id === id), 1);
  } else if (ids.length > 0) {
    await chrome.tabs.remove(ids);
  }
  return batchId;
}

// ─── Graveyard ───────────────────────────────────────────────────────────────

export async function getGraveyard(): Promise<GraveEntry[]> {
  if (!isExtension) return [...mockGraveyard];
  const data = await chrome.storage.local.get(GRAVEYARD_KEY);
  const entries = data[GRAVEYARD_KEY];
  return Array.isArray(entries) ? entries : [];
}

async function saveGraveyard(entries: GraveEntry[]): Promise<void> {
  if (!isExtension) {
    mockGraveyard = entries;
    return;
  }
  await chrome.storage.local.set({ [GRAVEYARD_KEY]: entries });
}

export async function restoreTabs(entries: GraveEntry[]): Promise<void> {
  const ids = new Set(entries.map((e) => e.id));
  for (const entry of entries) {
    if (!isRestorableUrl(entry.url)) continue;
    if (isExtension) {
      await chrome.tabs.create({ url: entry.url, active: false });
    } else {
      mockTabs.push({ id: Date.now() + Math.random(), url: entry.url, title: entry.title, lastAccessed: Date.now() });
    }
  }
  await saveGraveyard((await getGraveyard()).filter((e) => !ids.has(e.id)));
}

export async function clearGraveyard(): Promise<void> {
  await saveGraveyard([]);
}
