"use client";

import { useState } from "react";
import type { SearchLogic } from "./useSearchLogic";

interface Props {
  logic: SearchLogic;
}

export default function SearchFilters({ logic }: Props) {
  const {
    selectedBrand,
    setSelectedBrand,
    selectedCarBrand,
    setSelectedCarBrand,
    selectedCategory,
    setSelectedCategory,
    onlyInStock,
    setOnlyInStock,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    brandOptions,
    carBrandOptions,
    categoryOptions,
  } = logic;

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const handleClear = () => {
    setSelectedBrand("Tümü");
    setSelectedCarBrand("Tümü");
    setSelectedCategory("Tümü");
    setOnlyInStock(false);
    setMinPrice(undefined);
    setMaxPrice(undefined);
  };

  const FilterContent = (
    <div className="space-y-4 text-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">Filtreler</h2>
        <button
          type="button"
          onClick={handleClear}
          className="text-[11px] text-gray-500 hover:text-gray-900"
        >
          Temizle
        </button>
      </div>

      {/* Marka */}
      <div className="space-y-1">
        <p className="text-xs text-gray-500">Marka</p>
        <select
          className="w-full border rounded-md px-2 py-1 text-xs bg-white"
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
        >
          {brandOptions.map((b: string) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* Araç markası */}
      <div className="space-y-1">
        <p className="text-xs text-gray-500">Araç markası</p>
        <select
          className="w-full border rounded-md px-2 py-1 text-xs bg-white"
          value={selectedCarBrand}
          onChange={(e) => setSelectedCarBrand(e.target.value)}
        >
          {carBrandOptions.map((b: string) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* Kategori */}
      <div className="space-y-1">
        <p className="text-xs text-gray-500">Kategori</p>
        <select
          className="w-full border rounded-md px-2 py-1 text-xs bg-white"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categoryOptions.map((c: string) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Fiyat */}
      <div className="space-y-1">
        <p className="text-xs text-gray-500">Fiyat aralığı (₺)</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder="Min"
            className="w-1/2 border rounded-md px-2 py-1 text-xs"
            value={minPrice ?? ""}
            onChange={(e) =>
              setMinPrice(e.target.value ? Number(e.target.value) : undefined)
            }
          />
          <input
            type="number"
            inputMode="numeric"
            placeholder="Max"
            className="w-1/2 border rounded-md px-2 py-1 text-xs"
            value={maxPrice ?? ""}
            onChange={(e) =>
              setMaxPrice(e.target.value ? Number(e.target.value) : undefined)
            }
          />
        </div>
      </div>

      {/* Stok */}
      <div className="flex items-center gap-2 text-xs">
        <input
          id="onlyInStock"
          type="checkbox"
          className="h-4 w-4"
          checked={onlyInStock}
          onChange={(e) => setOnlyInStock(e.target.checked)}
        />
        <label htmlFor="onlyInStock">Sadece stokta olanlar</label>
      </div>

      {/* Mobilde ayrıca buton görünür */}
      <button
        type="button"
        onClick={handleClear}
        className="md:hidden w-full border border-gray-300 rounded-md py-2 text-xs text-gray-700 hover:bg-gray-50"
      >
        Filtreleri temizle
      </button>
    </div>
  );

  return (
    <>
      {/* Mobil filtre butonu */}
      <button
        type="button"
        className="md:hidden inline-flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-xs text-gray-700 bg-white shadow-sm w-full"
        onClick={() => setIsMobileFiltersOpen(true)}
      >
        <span className="w-2 h-2 rounded-full bg-red-600" />
        Filtreler
      </button>

      {/* Desktop panel */}
      <aside className="hidden md:block w-72 lg:w-80 flex-shrink-0">
        <div className="sticky top-4 rounded-xl border border-gray-200 p-4 bg-white">
          {FilterContent}
        </div>
      </aside>

      {/* Mobil drawer */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[320px] max-w-[88%] bg-white shadow-2xl p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold">Filtreler</h2>
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(false)}
                className="text-xs text-gray-500"
              >
                Kapat
              </button>
            </div>

            <div className="overflow-y-auto pr-1">{FilterContent}</div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={handleClear}
                className="flex-1 border border-gray-300 rounded-md py-2 text-xs text-gray-700"
              >
                Temizle
              </button>
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(false)}
                className="flex-1 bg-red-600 text-white rounded-md py-2 text-xs"
              >
                Uygula
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
