import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Minimal fake of the chrome.* APIs the license code touches.
function installChromeFake() {
  const store: Record<string, unknown> = {};
  vi.stubGlobal("chrome", {
    tabs: { create: vi.fn() },
    storage: {
      local: {
        get: async (key: string) => (key in store ? { [key]: store[key] } : {}),
        set: async (items: Record<string, unknown>) => Object.assign(store, items),
        remove: async (key: string) => delete store[key],
      },
      onChanged: { addListener: vi.fn(), removeListener: vi.fn() },
    },
  });
  return store;
}

function mockFetch(handler: (path: string, body: Record<string, unknown>) => Response) {
  const fetchMock = vi.fn(async (url: string, init: RequestInit) =>
    handler(new URL(url).pathname, JSON.parse(String(init.body)))
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

let store: Record<string, unknown>;
let pro: typeof import("./pro");

beforeEach(async () => {
  vi.resetModules();
  store = installChromeFake();
  pro = await import("./pro");
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("activateLicense", () => {
  it("stores the license instance for a valid key", async () => {
    mockFetch((path, body) => {
      expect(path).toBe("/licenses/activate");
      expect(body.license_key).toBe("GOOD-KEY");
      return json({ id: "lki_123" });
    });
    expect(await pro.activateLicense("  GOOD-KEY  ")).toBeNull();
    expect(store.proLicense).toMatchObject({ key: "GOOD-KEY", instanceId: "lki_123" });
    expect(await pro.isProUser()).toBe(true);
  });

  it("rejects a key Dodo refuses", async () => {
    mockFetch(() => json({ message: "not found" }, 404));
    expect(await pro.activateLicense("BAD-KEY")).toMatch(/didn't work/);
    expect(store.proLicense).toBeUndefined();
  });

  it("rejects a malformed Dodo response", async () => {
    mockFetch(() => json({ nope: true }));
    expect(await pro.activateLicense("KEY")).toMatch(/didn't work/);
    expect(store.proLicense).toBeUndefined();
  });

  it("asks for a key when the input is empty", async () => {
    const fetchMock = mockFetch(() => json({}));
    expect(await pro.activateLicense("   ")).toMatch(/Paste/);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("isProUser", () => {
  const stale = () => Date.now() - 30 * 24 * 60 * 60 * 1000;

  it("is false with no license", async () => {
    expect(await pro.isProUser()).toBe(false);
  });

  it("does not trust tampered or malformed storage", async () => {
    store.proLicense = { key: "K", instanceId: "lki_1", validatedAt: Date.now() + 1e12 };
    expect(await pro.isProUser()).toBe(false);
    store.proLicense = { key: "K" };
    expect(await pro.isProUser()).toBe(false);
    store.proLicense = "PRO=true";
    expect(await pro.isProUser()).toBe(false);
  });

  it("re-validates stale licenses and drops refunded ones", async () => {
    store.proLicense = { key: "K", instanceId: "lki_1", validatedAt: stale() };
    mockFetch((path) => {
      expect(path).toBe("/licenses/validate");
      return json({ valid: false });
    });
    expect(await pro.isProUser()).toBe(false);
    expect(store.proLicense).toBeUndefined();
  });

  it("only accepts valid === true", async () => {
    store.proLicense = { key: "K", instanceId: "lki_1", validatedAt: stale() };
    mockFetch(() => json({ valid: "yes" }));
    expect(await pro.isProUser()).toBe(false);
  });

  it("keeps Pro for paying users when Dodo is unreachable", async () => {
    store.proLicense = { key: "K", instanceId: "lki_1", validatedAt: stale() };
    vi.stubGlobal("fetch", vi.fn(async () => Promise.reject(new TypeError("offline"))));
    expect(await pro.isProUser()).toBe(true);
  });
});

describe("removeLicense", () => {
  it("deactivates the instance and clears storage", async () => {
    store.proLicense = { key: "K", instanceId: "lki_1", validatedAt: Date.now() };
    const fetchMock = mockFetch(() => new Response(null, { status: 200 }));
    await pro.removeLicense();
    expect(store.proLicense).toBeUndefined();
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/licenses\/deactivate$/),
      expect.anything()
    );
  });
});
