export type User = { id: number; email: string; full_name?: string | null; roles?: string[] };

export function isAdmin(user: User | null): boolean {
  return user?.roles?.includes("admin") ?? false;
}

const KEY = "icdropspot:user";

export function saveUser(u: User) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(u));
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as User; } catch { return null; }
}

export function clearUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}


