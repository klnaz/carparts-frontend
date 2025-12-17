"use client";

import { useMemo, useState, useEffect } from "react";

export interface ProductBase {
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

export type SortOption = "relevance" | "price_asc" | "price_desc" | "bestseller";

const PAGE_SIZE = 12;

export function useSearchLogic(allProducts: ProductBase[], q: string) {
  const [selectedBrand, setSelectedBrand] = useState("Tümü");
  const [selectedCarBrand, setSelectedCarBrand] = useState("Tümü");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [sortBy, setSortBy] = useState<SortOption>("relevance");

  const [currentPage, setCurrentPage] = useState(1);

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

  const filtered = useMemo(() => {
    const query = q.toLowerCase();

    return allProducts.filter((p) => {
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

      if (selectedBrand !== "Tümü" && p.BRAND !== selectedBrand) return false;
      if (selectedCarBrand !== "Tümü" && p.CAR_BRAND !== selectedCarBrand)
        return false;
      if (selectedCategory !== "Tümü" && p.CATOGERY !== selectedCategory)
        return false;

      if (onlyInStock && (!p.STOCK_QUANTITY || p.STOCK_QUANTITY <= 0)) {
        return false;
      }

      if (typeof minPrice === "number" && p.price < minPrice) return false;
      if (typeof maxPrice === "number" && p.price > maxPrice) return false;

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

  const sorted = useMemo(() => {
    const list = [...filtered];

    switch (sortBy) {
      case "price_asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "bestseller":
        list.sort((a, b) => (b.miktarCikan ?? 0) - (a.miktarCikan ?? 0));
        break;
      case "relevance":
      default:
        break;
    }

    return list;
  }, [filtered, sortBy]);

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

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const paginated = sorted.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return {
    paginated,
    total,
    totalPages,
    currentPage,
    setCurrentPage,

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

    sortBy,
    setSortBy,

    brandOptions,
    carBrandOptions,
    categoryOptions,

    PAGE_SIZE,
  };
}

// BURASI ÖNEMLİ: SearchLogic tipi export ediliyor
export type SearchLogic = ReturnType<typeof useSearchLogic>;
