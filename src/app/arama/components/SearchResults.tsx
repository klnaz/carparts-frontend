"use client";

import { useRouter } from "next/navigation";
import ProductCard, {
  Product as CardProduct,
} from "../../components/ProductCard";
import type { ProductBase } from "./useSearchLogic";

interface SearchLogicLike {
  paginated: ProductBase[];
  total: number;
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

interface SearchResultsProps {
  logic: SearchLogicLike;
}

const PAGE_SIZE = 12; // useSearchLogic ile aynı olmalı

const mapToCardProduct = (p: ProductBase): CardProduct => ({
  BRANDCODE: p.BRANDCODE,
  name: p.NAME,
  STOCK_QUANTITY: p.STOCK_QUANTITY,
  price: p.price,
  image: p.image,
  BRAND: p.BRAND,
  CAR_BRAND: p.CAR_BRAND,
});

const SearchResults = ({ logic }: SearchResultsProps) => {
  const router = useRouter();
  const { paginated, total, totalPages, currentPage, setCurrentPage } = logic;

  const handleChangePage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderPageButtons = () => {
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

  const startIndex =
    total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endIndex =
    total === 0 ? 0 : Math.min(currentPage * PAGE_SIZE, total);

  if (total === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 text-sm text-gray-600 text-center">
        Aramanıza uygun ürün bulunamadı.
        <div className="mt-2 text-xs text-gray-500 space-y-1">
          <p>• OEM kodunu eksiksiz yazmayı deneyin</p>
          <p>• Marka / model adını farklı şekilde yazmayı deneyin</p>
          <p>• Filtreleri sıfırlayıp tekrar arayın</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-3 sm:p-4 lg:p-5 shadow-sm">
      {/* Üst bilgi satırı */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div className="space-y-1">
          <p className="text-xs text-gray-500">
            {total} ürün listeleniyor
          </p>
          <p className="text-[11px] text-gray-400">
            Sayfa {currentPage} / {totalPages}
          </p>
        </div>

        <p className="text-[11px] text-gray-500">
          {startIndex}–{endIndex} / {total} ürün gösteriliyor
        </p>
      </div>

      {/* Ürün grid'i */}
      <div className="grid gap-4 sm:gap-5 lg:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {paginated.map((p) => (
          <div key={p.BRANDCODE} className="flex justify-center">
            <ProductCard
              product={mapToCardProduct(p)}
              onImageClick={(id) =>
                router.push(`/products/${encodeURIComponent(id)}`)
              }
            />
          </div>
        ))}
      </div>

      {/* Sayfalama barı */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-[11px] text-gray-500">
          {startIndex}–{endIndex} / {total} ürün gösteriliyor
        </p>
        {renderPageButtons()}
      </div>
    </div>
  );
};

export default SearchResults;
