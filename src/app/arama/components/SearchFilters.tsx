"use client";

import { useState } from "react";
import type { SearchLogic } from "./useSearchLogic";

interface Props {
  logic: SearchLogic;
}

const SearchFilters = ({ logic }: Props) => {
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

  return (
    <>
      {/* Desktop sidebar: kartın içinde, sağ tarafla hizalı */}
      <aside className="hidden md:block w-64 flex-shrink-0 md:border-r md:pr-4">
        <div className="space-y-4 text-sm">
          <h2 className="font-semibold text-gray-900">Filtreler</h2>

          {/* Marka */}
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Marka</p>
            <select
              className="w-full border rounded-md px-2 py-1 text-xs"
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
              className="w-full border rounded-md px-2 py-1 text-xs"
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
              className="w-full border rounded-md px-2 py-1 text-xs"
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

          {/* Fiyat aralığı */}
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Fiyat aralığı (₺)</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                className="w-1/2 border rounded-md px-2 py-1 text-xs"
                value={minPrice ?? ""}
                onChange={(e) =>
                  setMinPrice(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
              />
              <input
                type="number"
                placeholder="Max"
                className="w-1/2 border rounded-md px-2 py-1 text-xs"
                value={maxPrice ?? ""}
                onChange={(e) =>
                  setMaxPrice(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
              />
            </div>
          </div>

          {/* Stok filtresi */}
          <div className="flex items-center gap-2 text-xs">
            <input
              id="onlyInStock-desktop"
              type="checkbox"
              className="h-4 w-4"
              checked={onlyInStock}
              onChange={(e) => setOnlyInStock(e.target.checked)}
            />
            <label htmlFor="onlyInStock-desktop">Sadece stokta olanlar</label>
          </div>

          {/* Temizle */}
          <button
            type="button"
            onClick={handleClear}
            className="w-full mt-2 border border-gray-300 rounded-md py-1 text-xs text-gray-700 hover:bg-gray-50"
          >
            Filtreleri temizle
          </button>
        </div>
      </aside>

      {/* Mobil filtre açma butonu */}
      <button
        type="button"
        className="md:hidden inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md text-xs text-gray-700 bg-white shadow-sm mb-3"
        onClick={() => setIsMobileFiltersOpen(true)}
      >
        <span className="w-2 h-2 rounded-full bg-red-600" />
        Filtreler
      </button>

      {/* Mobil drawer */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-72 max-w-[80%] bg-white shadow-2xl p-4 flex flex-col space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold">Filtreler</h2>
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(false)}
                className="text-xs text-gray-500"
              >
                Kapat
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Marka */}
              <div className="space-y-1">
                <p className="text-gray-500">Marka</p>
                <select
                  className="w-full border rounded-md px-2 py-1"
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
                <p className="text-gray-500">Araç markası</p>
                <select
                  className="w-full border rounded-md px-2 py-1"
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
                <p className="text-gray-500">Kategori</p>
                <select
                  className="w-full border rounded-md px-2 py-1"
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

              {/* Fiyat aralığı */}
              <div className="space-y-1">
                <p className="text-gray-500">Fiyat aralığı (₺)</p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-1/2 border rounded-md px-2 py-1"
                    value={minPrice ?? ""}
                    onChange={(e) =>
                      setMinPrice(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-1/2 border rounded-md px-2 py-1"
                    value={maxPrice ?? ""}
                    onChange={(e) =>
                      setMaxPrice(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="onlyInStock-mobile"
                  type="checkbox"
                  className="h-4 w-4"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                />
                <label htmlFor="onlyInStock-mobile" className="text-gray-700">
                  Sadece stokta olanlar
                </label>
              </div>
            </div>

            <div className="mt-auto flex gap-2 pt-2">
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
};

export default SearchFilters;
