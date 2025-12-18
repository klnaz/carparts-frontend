"use client";

import type { SearchLogic, SortOption } from "./useSearchLogic";

export default function SearchSortBar({ logic }: { logic: SearchLogic }) {
  return (
    <div className="flex items-center justify-end text-xs">
      <select
        className="border rounded-md px-2 py-1 bg-white"
        value={logic.sortBy}
        onChange={(e) => logic.setSortBy(e.target.value as SortOption)}
      >
        <option value="relevance">Önerilen</option>
        <option value="price_asc">Fiyat (artan)</option>
        <option value="price_desc">Fiyat (azalan)</option>
        <option value="bestseller">En çok satanlar</option>
      </select>
    </div>
  );
}
