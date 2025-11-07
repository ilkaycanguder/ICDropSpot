const KEY = "icdropspot:waitlist";

type WaitlistMap = Record<string, number[]>; // key=userId string

function readStore(): WaitlistMap {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return parsed as WaitlistMap;
    }
  } catch (err) {
    console.warn("Failed to parse waitlist store", err);
  }
  return {};
}

function writeStore(store: WaitlistMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(store));
}

export function getWaitlistedDrops(userId: number | null): number[] {
  if (userId == null) return [];
  const store = readStore();
  return store[String(userId)] ?? [];
}

export function isWaitlisted(userId: number | null, dropId: number): boolean {
  return getWaitlistedDrops(userId).includes(dropId);
}

export function addToWaitlist(userId: number | null, dropId: number) {
  if (userId == null) return;
  const store = readStore();
  const key = String(userId);
  const current = new Set(store[key] ?? []);
  current.add(dropId);
  store[key] = Array.from(current);
  writeStore(store);
  dispatchChange(userId, store[key]);
}

export function removeFromWaitlist(userId: number | null, dropId: number) {
  if (userId == null) return;
  const store = readStore();
  const key = String(userId);
  const current = new Set(store[key] ?? []);
  current.delete(dropId);
  store[key] = Array.from(current);
  writeStore(store);
  dispatchChange(userId, store[key]);
}

function dispatchChange(userId: number, drops: number[]) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("waitlist-changed", {
      detail: { userId, drops },
    })
  );
}
