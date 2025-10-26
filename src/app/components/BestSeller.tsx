"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductCard, { Product } from "./ProductCard";
import bestSellersDataRaw from "@/data/bestSellers.json";
import { ChevronLeft, ChevronRight } from "lucide-react";

// JSON'daki alanları Product tipine eşleme
const mapBestSellers = (
  data: { BRANDCODE: string; NAME: string; price: number; image: string }[]
): Product[] =>
  data.map((item) => ({
    BRANDCODE: item.BRANDCODE,
    name: item.NAME,
    price: item.price,
    image: item.image,
  }));

const BestSellers = () => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    setProducts(mapBestSellers(bestSellersDataRaw));

    const updateVisibleCount = () => {
      if (window.innerWidth < 640) setVisibleCount(1);
      else if (window.innerWidth < 1024) setVisibleCount(2);
      else setVisibleCount(3);
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const handleImageClick = (brandCode: string) => {
    router.push(`/products/${brandCode}`);
  };

  const handlePrev = () => {
    setScrollIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setScrollIndex((prev) =>
      Math.min(prev + 1, products.length - visibleCount)
    );
  };

  // scrollIndex değiştiğinde kaydırma işlemi
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const child = container.children[scrollIndex] as HTMLElement;
    if (child) {
      container.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
    }
  }, [scrollIndex]);

  // Mouse ile sürükleme desteği
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const mouseDown = (e: MouseEvent) => {
      isDown = true;
      container.classList.add("cursor-grabbing");
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      e.preventDefault();
    };

    const mouseLeave = () => {
      isDown = false;
      container.classList.remove("cursor-grabbing");
    };

    const mouseUp = () => {
      isDown = false;
      container.classList.remove("cursor-grabbing");
    };

    const mouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.2; // kaydırma hassasiyeti
      container.scrollLeft = scrollLeft - walk;
    };

    container.addEventListener("mousedown", mouseDown);
    container.addEventListener("mouseleave", mouseLeave);
    container.addEventListener("mouseup", mouseUp);
    container.addEventListener("mousemove", mouseMove);

    return () => {
      container.removeEventListener("mousedown", mouseDown);
      container.removeEventListener("mouseleave", mouseLeave);
      container.removeEventListener("mouseup", mouseUp);
      container.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  return (
    <div className="relative w-full bg-white py-6 px-2 sm:px-4 md:px-6 select-none">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        En Çok Satanlar
      </h2>

      {/* Kaydırma Butonları */}
      <button
        onClick={handlePrev}
        disabled={scrollIndex === 0}
        className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow hover:bg-gray-100 disabled:opacity-30 z-10"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={handleNext}
        disabled={scrollIndex >= products.length - visibleCount}
        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow hover:bg-gray-100 disabled:opacity-30 z-10"
      >
        <ChevronRight size={24} />
      </button>

      {/* Ürün Standı */}
      <div
        ref={containerRef}
        className="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto scrollbar-hide cursor-grab"
        style={{ scrollBehavior: "smooth" }}
      >
        {products.map((product) => (
          <div
            key={product.BRANDCODE}
            className="flex-shrink-0 w-[200px] sm:w-[220px] md:w-[250px]"
          >
            <ProductCard
              product={product}
              onImageClick={() => handleImageClick(product.BRANDCODE)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSellers;
