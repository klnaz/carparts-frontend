"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiClock } from "react-icons/fi";

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

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 24,
    },
  },
} as const;

const RecentlyViewedSection = ({ items }: RecentlyViewedSectionProps) => {
  if (!items.length) return null;

  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-6 pt-6 md:pt-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 flex items-center justify-center w-9 h-9 rounded-xl bg-red-50 border border-red-100 text-red-500 flex-shrink-0">
            <FiClock className="w-[18px] h-[18px]" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-zinc-900 tracking-tight">
              Son görüntüledikleriniz
            </h2>
            <p className="text-[12px] text-zinc-500 mt-0.5">
              En son incelediğiniz ürünlere hızlıca geri dönün.
            </p>
          </div>
        </div>
        <span className="hidden sm:inline text-[11px] text-zinc-400 bg-zinc-50 border border-zinc-100 rounded-full px-3 py-1">
          Tarayıcınızda saklanır
        </span>
      </div>

      {/* Accent border */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-[3px] rounded-full bg-red-500" />
        <div className="flex-1 h-px bg-zinc-100" />
      </div>

      {/* Horizontally scrollable card list */}
      <motion.div
        className="flex gap-3.5 overflow-x-auto pb-4 scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            variants={cardVariants}
            whileHover={{ y: -4, scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="min-w-[164px] max-w-[184px] flex-shrink-0"
          >
            <Link
              href={`/products/${encodeURIComponent(item.id)}`}
              className="block bg-white border border-zinc-100 rounded-2xl p-3 h-full shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-shadow duration-300"
            >
              {/* Image container */}
              <div className="relative w-full aspect-square rounded-xl bg-gradient-to-br from-zinc-50 to-white border border-zinc-100/80 mb-2.5 overflow-hidden">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-contain p-2.5"
                />
              </div>

              {/* Brand tag */}
              <p className="text-[11px] text-zinc-400 font-medium tracking-wide uppercase line-clamp-1">
                {item.BRAND || item.CAR_BRAND || "Marka"}
              </p>

              {/* Product name */}
              <p className="text-xs font-medium text-zinc-800 line-clamp-2 min-h-[32px] mt-0.5 leading-snug">
                {item.name}
              </p>

              {/* Price */}
              <p className="text-sm font-bold text-red-600 mt-1.5">
                {item.price.toLocaleString("tr-TR")} ₺
              </p>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Hidden scrollbar global style (fallback for WebKit) */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default RecentlyViewedSection;
