const KEY = "guest_favorites";

export function getGuestFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(arr)) return [];
    return arr.filter((x) => typeof x === "string");
  } catch {
    return [];
  }
}

export function hasGuestFavorite(productId: string): boolean {
  return getGuestFavorites().includes(productId);
}

export function addGuestFavorite(productId: string): string[] {
  const current = getGuestFavorites();
  if (current.includes(productId)) return current;
  const next = [productId, ...current];
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(next));
  }
  return next;
}

export function removeGuestFavorite(productId: string): string[] {
  const current = getGuestFavorites();
  const next = current.filter((id) => id !== productId);
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(next));
  }
  return next;
}

export function toggleGuestFavorite(productId: string): {
  isFav: boolean;
  list: string[];
} {
  const current = getGuestFavorites();
  if (current.includes(productId)) {
    const list = removeGuestFavorite(productId);
    return { isFav: false, list };
  }
  const list = addGuestFavorite(productId);
  return { isFav: true, list };
}

export function clearGuestFavorites() {
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
}
