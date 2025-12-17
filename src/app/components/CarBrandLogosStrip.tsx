"use client";

import Image from "next/image";

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

const CarBrandLogosStrip = () => {
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-[12px] text-gray-500">
            Binek araç markalarının geniş yelpazesinde ürün tedariği sağlıyoruz.
          </p>
          <span className="hidden sm:inline text-[11px] text-gray-400">
            Logolar temsilidir, ürün stoğu modele göre değişiklik gösterebilir.
          </span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {carBrandLogos.map((brand) => (
            <button
              key={brand.code}
              type="button"
              className="flex items-center gap-2 min-w-[110px] h-12 px-3 rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition flex-shrink-0"
              // Marka filtresi istersen:
              // onClick={() => router.push(`/search?brand=${brand.code}`)}
            >
              <div className="relative w-10 h-6">
                <Image
                  src={`/car-logos/${brand.file}`}
                  alt={brand.name}
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </div>
              <span className="text-[11px] font-medium text-gray-700">
                {brand.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CarBrandLogosStrip;
