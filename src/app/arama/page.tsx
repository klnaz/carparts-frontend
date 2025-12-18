"use client";

import { useSearchParams } from "next/navigation";
import bestSellersRaw from "../../data/bestSellers.json";

import { useSearchLogic } from "./components/useSearchLogic";
import SearchFilters from "./components/SearchFilters";
import SearchHeader from "./components/SearchHeader";
import SearchResults from "./components/SearchResults";
import SearchSortBar from "./components/SearchSortBar";

const products = (bestSellersRaw as any[]).map((p) => ({
  ...p,
  image: p.image || "",
}));

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") || "").trim();

  const logic = useSearchLogic(products as any[], q);

  return (
    <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 py-6">
      <SearchHeader q={q} total={logic.total} />

      {/* Tek ana kart */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3 sm:p-4 lg:p-5">
        <div className="flex flex-col md:flex-row gap-5 lg:gap-6">
          {/* Sol: filtre */}
          <SearchFilters logic={logic} />

          {/* Sağ: sıralama + sonuç */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="hidden sm:block text-[11px] text-gray-500">
                Sayfa {logic.currentPage} / {logic.totalPages}
              </div>
              <div className="ml-auto">
                <SearchSortBar logic={logic} />
              </div>
            </div>

            <SearchResults logic={logic} />
          </div>
        </div>
      </div>
    </div>
  );
}
