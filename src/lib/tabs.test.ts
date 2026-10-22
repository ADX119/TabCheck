import { describe, expect, it } from "vitest";
import {
  closeTabs,
  getGraveyard,
  isRestorableUrl,
  pickDuplicateTabs,
  pickExtraTabs,
  pickIdleTabs,
  restoreTabs,
  type TabInfo,
} from "./tabs";

const HOUR = 60 * 60 * 1000;
const now = Date.now();
const ids = (tabs: TabInfo[]) => tabs.map((t) => t.id).sort();

const tabs: TabInfo[] = [
  { id: 1, url: "https://a.com/x#top", lastAccessed: now - 5 * HOUR },
  { id: 2, url: "https://a.com/x", lastAccessed: now - 1 * HOUR },
  { id: 3, url: "https://a.com/x/", pinned: true, lastAccessed: now - 50 * HOUR },
  { id: 4, url: "https://b.com", lastAccessed: now - 30 * HOUR },
  { id: 5, url: "https://b.com", audible: true, lastAccessed: now - 40 * HOUR },
  { id: 6, url: "https://c.com", active: true, lastAccessed: now - 99 * HOUR },
];

describe("tab selection", () => {
  it("keeps the pinned or most recent copy of each duplicate", () => {
    expect(ids(pickDuplicateTabs(tabs))).toEqual([1, 2, 4]);
  });

  it("closes only unprotected idle tabs", () => {
    expect(ids(pickIdleTabs(tabs, 24))).toEqual([4]);
  });

  it("never closes pinned, audible or active tabs when trimming", () => {
    expect(ids(pickExtraTabs(tabs, 0))).toEqual([1, 2, 4]);
    expect(ids(pickExtraTabs(tabs, 2))).toEqual([4]);
  });

  it("returns nothing when there are no duplicates", () => {
    expect(pickDuplicateTabs([{ id: 1, url: "https://x.com" }])).toEqual([]);
  });
});

describe("isRestorableUrl", () => {
  it.each(["https://example.com", "http://example.com/path?q=1"])("allows %s", (url) => {
    expect(isRestorableUrl(url)).toBe(true);
  });

  it.each([
    "javascript:alert(1)",
    "file:///etc/passwd",
    "chrome://settings",
    "chrome-extension://abc/index.html",
    "data:text/html,<script>alert(1)</script>",
    "not a url",
    "",
    undefined,
  ])("rejects %s", (url) => {
    expect(isRestorableUrl(url)).toBe(false);
  });
});

describe("graveyard (dev preview storage)", () => {
  it("only buries web pages and can restore them", async () => {
    await closeTabs([
      { id: 101, url: "https://keep.me", title: "Keep" },
      { id: 102, url: "chrome://newtab", title: "New tab" },
      { id: 103, url: "javascript:alert(1)", title: "Evil" },
    ]);
    const graveyard = await getGraveyard();
    expect(graveyard.map((e) => e.url)).toEqual(["https://keep.me"]);

    await restoreTabs(graveyard);
    expect(await getGraveyard()).toEqual([]);
  });
});
