"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const carBrandLogos = [
  { code: "volkswagen", name: "Volkswagen", file: "Volkswagen.png" },
  { code: "renault", name: "Renault", file: "Renault.png" },
  { code: "fiat", name: "Fiat", file: "Fiat.png" },
  { code: "toyota", name: "Toyota", file: "toyota.png" },
  { code: "hyundai", name: "Hyundai", file: "hyundai.png" },
  { code: "kia", name: "Kia", file: "kia.png" },
  { code: "opel", name: "Opel", file: "opel.png" },
  { code: "peugeot", name: "Peugeot", file: "Peugeot.png" },
  { code: "citroen", name: "Citroën", file: "citroen.png" },
  { code: "seat", name: "SEAT", file: "seat.png" },
  { code: "skoda", name: "Škoda", file: "skoda.png" },
  { code: "lada", name: "Lada", file: "lada.png" },
  { code: "tofas", name: "Tofaş", file: "tofas.png" },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
} as const;

const CarBrandLogosStrip = () => {
  return (
    <section className="bg-white border-b border-zinc-100">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-5 flex flex-col gap-3">
        {/* Header with left accent border */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1 h-5 rounded-full bg-red-600" />
            <p className="text-[12.5px] font-medium text-zinc-600 tracking-wide">
              Binek araç markalarının geniş yelpazesinde ürün tedariği
              sağlıyoruz.
            </p>
          </div>
          <span className="hidden sm:inline text-[11px] text-zinc-400 italic">
            Logolar temsilidir, ürün stoğu modele göre değişiklik gösterebilir.
          </span>
        </div>

        {/* Scrollable brand strip */}
        <motion.div
          className="flex items-center gap-3 overflow-x-auto pb-1 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {carBrandLogos.map((brand) => (
            <motion.button
              key={brand.code}
              type="button"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="group flex items-center gap-2.5 min-w-[120px] h-[52px] px-3.5 rounded-xl
                         bg-white border border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]
                         hover:border-red-200 hover:shadow-[0_4px_12px_rgba(220,38,38,0.08)]
                         transition-all duration-200 ease-out flex-shrink-0 snap-start cursor-pointer"
            >
              <div className="relative w-9 h-7 flex-shrink-0">
                <Image
                  src={`/car-logos/${brand.file}`}
                  alt={brand.name}
                  fill
                  sizes="36px"
                  className="object-contain drop-shadow-sm"
                />
              </div>
              <span className="text-[11.5px] font-semibold text-zinc-600 group-hover:text-zinc-800 transition-colors duration-200 whitespace-nowrap">
                {brand.name}
              </span>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CarBrandLogosStrip;
