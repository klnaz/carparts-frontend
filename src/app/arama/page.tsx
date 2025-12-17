"use client";

import { useSearchParams } from "next/navigation";
import bestSellersRaw from "../../data/bestSellers.json";
import { useSearchLogic } from "./components/useSearchLogic";
import SearchFilters from "./components/SearchFilters";
import SearchHeader from "./components/SearchHeader";
import SearchResults from "./components/SearchResults";
import SearchSortBar from "./components/SearchSortBar";

const products = bestSellersRaw.map((p) => ({
  ...p,
  image: p.image || "",
}));

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") || "").trim();

  const logic = useSearchLogic(products as any[], q);

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      <SearchHeader q={q} total={logic.total} />

      <div className="flex gap-6">
        <SearchFilters logic={logic} />
        <div className="flex-1">
          <SearchSortBar logic={logic} />
          <SearchResults logic={logic} />
        </div>
      </div>
    </div>
  );
}
