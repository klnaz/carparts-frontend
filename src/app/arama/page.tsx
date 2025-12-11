"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import bestSellersDataRaw from "../../data/bestSellers.json";
import ProductCard, { Product as CardProduct } from "../components/ProductCard";

interface BestSellerItem {
  BRANDCODE: string;
  NAME: string;
  STOCK_QUANTITY?: number;
  price: number;
  image?: string;
  BRAND?: string;
  CAR_BRAND?: string;
  CATOGERY?: string;
  miktarCikan?: number;
}

type SortOption = "relevance" | "price_asc" | "price_desc" | "bestseller";

const normalizeProducts = (data: any[]): BestSellerItem[] => {
  return data.map((item) => ({
    BRANDCODE: item.BRANDCODE,
    NAME: item.NAME,
    STOCK_QUANTITY: item.STOCK_QUANTITY,
    price: item.price,
    image: item.image || "",
    BRAND: item.BRAND || "",
    CAR_BRAND: item.CAR_BRAND || "",
    CATOGERY: item.CATOGERY || "",
    miktarCikan: item.miktarCikan ?? 0,
  }));
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const q = (searchParams.get("q") || "").trim();

  const allProducts = useMemo(
    () => normalizeProducts(bestSellersDataRaw as any[]),
    []
  );

  // Filtre state'leri
  const [selectedBrand, setSelectedBrand] = useState<string>("Tümü");
  const [selectedCarBrand, setSelectedCarBrand] = useState<string>("Tümü");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);

  // Sıralama
  const [sortBy, setSortBy] = useState<SortOption>("relevance");

  // Sayfalama
  const [currentPage, setCurrentPage] = useState<number>(1);
  const PAGE_SIZE = 12;

  // Mobil filtre drawer
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] =
    useState<boolean>(false);

  // Filtre seçenekleri
  const brandOptions = useMemo(() => {
    const set = new Set<string>();
    allProducts.forEach((p) => p.BRAND && set.add(p.BRAND));
    return ["Tümü", ...Array.from(set)];
  }, [allProducts]);

  const carBrandOptions = useMemo(() => {
    const set = new Set<string>();
    allProducts.forEach((p) => p.CAR_BRAND && set.add(p.CAR_BRAND));
    return ["Tümü", ...Array.from(set)];
  }, [allProducts]);

  const categoryOptions = useMemo(() => {
    const set = new Set<string>();
    allProducts.forEach((p) => p.CATOGERY && set.add(p.CATOGERY));
    return ["Tümü", ...Array.from(set)];
  }, [allProducts]);

  // Arama + filtre
  const filteredProducts = useMemo(() => {
    const query = q.toLowerCase();

    return allProducts.filter((p) => {
      // Arama
      if (query) {
        const haystack = [
          p.NAME,
          p.BRAND,
          p.CAR_BRAND,
          p.CATOGERY,
          p.BRANDCODE,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(query)) return false;
      }

      // Marka filtresi
      if (selectedBrand !== "Tümü" && p.BRAND !== selectedBrand) {
        return false;
      }

      // Araç marka filtresi
      if (
        selectedCarBrand !== "Tümü" &&
        p.CAR_BRAND !== selectedCarBrand
      ) {
        return false;
      }

      // Kategori filtresi
      if (
        selectedCategory !== "Tümü" &&
        p.CATOGERY !== selectedCategory
      ) {
        return false;
      }

      // Stok filtresi
      if (onlyInStock) {
        const inStock =
          typeof p.STOCK_QUANTITY === "number" &&
          p.STOCK_QUANTITY > 0;
        if (!inStock) return false;
      }

      // Fiyat filtresi
      if (typeof minPrice === "number" && p.price < minPrice) {
        return false;
      }
      if (typeof maxPrice === "number" && p.price > maxPrice) {
        return false;
      }

      return true;
    });
  }, [
    allProducts,
    q,
    selectedBrand,
    selectedCarBrand,
    selectedCategory,
    onlyInStock,
    minPrice,
    maxPrice,
  ]);

  // Sıralama uygulanmış liste
  const sortedProducts = useMemo(() => {
    const arr = [...filteredProducts];

    switch (sortBy) {
      case "price_asc":
        arr.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        arr.sort((a, b) => b.price - a.price);
        break;
      case "bestseller":
        arr.sort(
          (a, b) => (b.miktarCikan ?? 0) - (a.miktarCikan ?? 0)
        );
        break;
      case "relevance":
      default:
        // Şimdilik normalize order (JSON sırası)
        break;
    }

    return arr;
  }, [filteredProducts, sortBy]);

  // Filtre / arama / sıralama değişince sayfayı 1'e çek
  useEffect(() => {
    setCurrentPage(1);
  }, [
    q,
    selectedBrand,
    selectedCarBrand,
    selectedCategory,
    onlyInStock,
    minPrice,
    maxPrice,
    sortBy,
  ]);

  const totalResults = sortedProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE));
  const pageStartIndex = (currentPage - 1) * PAGE_SIZE;
  const pageEndIndex = pageStartIndex + PAGE_SIZE;

  const paginatedProducts = sortedProducts.slice(
    pageStartIndex,
    pageEndIndex
  );

  const mapToCardProduct = (p: BestSellerItem): CardProduct => ({
    BRANDCODE: p.BRANDCODE,
    name: p.NAME,
    STOCK_QUANTITY: p.STOCK_QUANTITY,
    price: p.price,
    image: p.image,
    BRAND: p.BRAND,
    CAR_BRAND: p.CAR_BRAND,
  });

  const handleClearFilters = () => {
    setSelectedBrand("Tümü");
    setSelectedCarBrand("Tümü");
    setSelectedCategory("Tümü");
    setOnlyInStock(false);
    setMinPrice(undefined);
    setMaxPrice(undefined);
  };

  const handleChangePage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    // sayfa değişince kullanıcıyı grid başına kaydırmak için:
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderPageButtons = () => {
    // Basit ve stabil: max 5 sayfa butonu göster
    const buttons: number[] = [];
    const maxButtons = 5;

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let i = start; i <= end; i++) {
      buttons.push(i);
    }

    return (
      <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
        <button
          type="button"
          onClick={() => handleChangePage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2 sm:px-3 py-1 border rounded-md text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Önceki
        </button>

        {buttons.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => handleChangePage(page)}
            className={`px-2 sm:px-3 py-1 border rounded-md ${
              page === currentPage
                ? "bg-red-600 text-white border-red-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          onClick={() => handleChangePage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2 sm:px-3 py-1 border rounded-md text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Sonraki
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 py-6">
      {/* Başlık */}
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Arama sonuçları
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {q
              ? `“${q}” için ${totalResults} ürün bulundu.`
              : `${totalResults} ürün listeleniyor.`}
          </p>
        </div>

        {/* Mobil filtre butonu */}
        <div className="flex items-center gap-2 justify-between sm:justify-end">
          <button
            type="button"
            className="md:hidden inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md text-xs text-gray-700 bg-white shadow-sm"
            onClick={() => setIsMobileFiltersOpen(true)}
          >
            <span className="w-2 h-2 rounded-full bg-red-600" />
            Filtreler
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sol: Filtre paneli (desktop) */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-4 text-sm">
            <div>
              <h2 className="font-semibold text-gray-900">
                Filtreler
              </h2>
            </div>

            {/* Marka */}
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Marka</p>
              <select
                className="w-full border rounded-md px-2 py-1 text-xs"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                {brandOptions.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Araç marka */}
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Araç markası</p>
              <select
                className="w-full border rounded-md px-2 py-1 text-xs"
                value={selectedCarBrand}
                onChange={(e) => setSelectedCarBrand(e.target.value)}
              >
                {carBrandOptions.map((b) => (
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
                {categoryOptions.map((c) => (
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
                      e.target.value
                        ? Number(e.target.value)
                        : undefined
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
                      e.target.value
                        ? Number(e.target.value)
                        : undefined
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
              <label htmlFor="onlyInStock-desktop">
                Sadece stokta olanlar
              </label>
            </div>

            {/* Filtreleri temizle */}
            <button
              type="button"
              onClick={handleClearFilters}
              className="w-full mt-2 border border-gray-300 rounded-md py-1 text-xs text-gray-700 hover:bg-gray-50"
            >
              Filtreleri temizle
            </button>
          </div>
        </aside>

        {/* Sağ: Sonuç listesi */}
        <main className="flex-1">
          <div className="bg-white rounded-2xl border border-gray-200 p-3 sm:p-4 lg:p-5 shadow-sm">
            {/* Üst bilgi satırı: sonuç sayısı + sıralama + sayfa bilgisi */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
              <div className="space-y-1">
                <p className="text-xs text-gray-500">
                  {totalResults} ürün listeleniyor
                </p>
                <p className="text-[11px] text-gray-400">
                  Sayfa {currentPage} / {totalPages}
                </p>
              </div>

              {/* Sıralama dropdown'u */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500 whitespace-nowrap">
                  Sırala:
                </span>
                <select
                  className="border rounded-md px-2 py-1 text-xs"
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as SortOption)
                  }
                >
                  <option value="relevance">Önerilen (varsayılan)</option>
                  <option value="price_asc">Fiyat (artan)</option>
                  <option value="price_desc">Fiyat (azalan)</option>
                  <option value="bestseller">En çok satanlar</option>
                </select>
              </div>
            </div>

            {totalResults === 0 ? (
              <div className="border border-dashed border-gray-200 rounded-xl p-6 text-sm text-gray-600 text-center">
                Aramanıza uygun ürün bulunamadı.
                <div className="mt-2 text-xs text-gray-500 space-y-1">
                  <p>• OEM kodunu eksiksiz yazmayı deneyin</p>
                  <p>• Marka / model adını farklı şekilde yazmayı deneyin</p>
                  <p>• Filtreleri sıfırlayıp tekrar arayın</p>
                </div>
              </div>
            ) : (
              <>
                {/* Ürün grid'i */}
                <div className="grid gap-4 sm:gap-5 lg:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                  {paginatedProducts.map((p) => (
                    <div
                      key={p.BRANDCODE}
                      className="flex justify-center"
                    >
                      <ProductCard
                        product={mapToCardProduct(p)}
                        onImageClick={(id) =>
                          router.push(
                            `/products/${encodeURIComponent(id)}`
                          )
                        }
                      />
                    </div>
                  ))}
                </div>

                {/* Sayfalama barı */}
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <p className="text-[11px] text-gray-500">
                    {pageStartIndex + 1}–
                    {Math.min(pageEndIndex, totalResults)} /{" "}
                    {totalResults} ürün gösteriliyor
                  </p>
                  {renderPageButtons()}
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Mobil filtre drawer */}
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

            {/* Aynı filtreler (mobil) */}
            <div className="space-y-3 text-xs">
              {/* Marka */}
              <div className="space-y-1">
                <p className="text-gray-500">Marka</p>
                <select
                  className="w-full border rounded-md px-2 py-1"
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                >
                  {brandOptions.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Araç marka */}
              <div className="space-y-1">
                <p className="text-gray-500">Araç markası</p>
                <select
                  className="w-full border rounded-md px-2 py-1"
                  value={selectedCarBrand}
                  onChange={(e) => setSelectedCarBrand(e.target.value)}
                >
                  {carBrandOptions.map((b) => (
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
                  {categoryOptions.map((c) => (
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
                        e.target.value
                          ? Number(e.target.value)
                          : undefined
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
                        e.target.value
                          ? Number(e.target.value)
                          : undefined
                      )
                    }
                  />
                </div>
              </div>

              {/* Stok filtresi */}
              <div className="flex items-center gap-2">
                <input
                  id="onlyInStock-mobile"
                  type="checkbox"
                  className="h-4 w-4"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                />
                <label
                  htmlFor="onlyInStock-mobile"
                  className="text-gray-700"
                >
                  Sadece stokta olanlar
                </label>
              </div>
            </div>

            <div className="mt-auto flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleClearFilters}
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
    </div>
  );
}
