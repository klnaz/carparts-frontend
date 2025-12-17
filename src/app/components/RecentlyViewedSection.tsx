"use client";

import Link from "next/link";
import Image from "next/image";

export interface RecentlyViewedItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  BRAND?: string;
  CAR_BRAND?: string;
}

interface RecentlyViewedSectionProps {
  items: RecentlyViewedItem[];
}

const RecentlyViewedSection = ({ items }: RecentlyViewedSectionProps) => {
  if (!items.length) return null;

  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-6 pt-6 md:pt-8">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">
            Son görüntüledikleriniz
          </h2>
          <p className="text-[12px] text-gray-500">
            En son incelediğiniz ürünlere hızlıca geri dönün.
          </p>
        </div>
        <span className="hidden sm:inline text-[11px] text-gray-400">
          Tarayıcınızda saklanır, hesabınıza özel değildir.
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-3">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/products/${encodeURIComponent(item.id)}`}
            className="min-w-[160px] max-w-[180px] bg-white border border-gray-200 rounded-xl p-3 flex-shrink-0 hover:shadow-md hover:-translate-y-0.5 transition"
          >
            <div className="relative w-full aspect-square rounded-lg bg-gray-50 border border-gray-100 mb-2 overflow-hidden">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                fill
                className="object-contain p-2"
              />
            </div>
            <p className="text-[11px] text-gray-500 line-clamp-1">
              {item.BRAND || item.CAR_BRAND || "Marka"}
            </p>
            <p className="text-xs font-medium text-gray-900 line-clamp-2 min-h-[32px]">
              {item.name}
            </p>
            <p className="text-sm font-semibold text-red-600 mt-1">
              {item.price.toLocaleString("tr-TR")} ₺
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewedSection;
