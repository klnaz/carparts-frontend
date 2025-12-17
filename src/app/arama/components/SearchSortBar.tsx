import { SortOption } from "./useSearchLogic";

export default function SearchSortBar({ logic }: any) {
  return (
    <div className="flex justify-end mb-4 text-xs">
      <select
        className="border rounded px-2 py-1"
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
