// src/utils/recentlyViewed.ts

export interface RecentlyViewedItem {
  id: string;        // BRANDCODE
  name: string;
  price: number;
  image?: string;
  BRAND?: string;
  CAR_BRAND?: string;
  viewedAt: number;  // sıralama için
}

const STORAGE_KEY = "koparts_recently_viewed";
const MAX_ITEMS = 12;

export const getRecentlyViewed = (): RecentlyViewedItem[] => {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as RecentlyViewedItem[];
    if (!Array.isArray(parsed)) return [];

    // En yeni en başta olacak şekilde sırala
    return parsed.sort((a, b) => b.viewedAt - a.viewedAt);
  } catch (e) {
    console.error("❌ getRecentlyViewed parse error:", e);
    return [];
  }
};

export const addRecentlyViewed = (
  item: Omit<RecentlyViewedItem, "viewedAt">
) => {
  if (typeof window === "undefined") return;

  try {
    const current = getRecentlyViewed();

    // Aynı ürün varsa listeden çıkar
    const filtered = current.filter((p) => p.id !== item.id);

    const updated: RecentlyViewedItem[] = [
      { ...item, viewedAt: Date.now() },
      ...filtered,
    ].slice(0, MAX_ITEMS);

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("❌ addRecentlyViewed error:", e);
  }
};
