"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import dealsData from "@/data/dealsCategory.json";

const Deals = () => {
  const router = useRouter();

  const handleBannerClick = (link: string) => {
    router.push(link);
  };

  return (
    <div className="w-full bg-white py-6 px-2 sm:px-4 md:px-6 select-none">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Fırsatlar Reyonu
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dealsData.map((deal) => (
          <div
            key={deal.name}
            className="relative rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => handleBannerClick(deal.link)}
          >
            <Image
              src={deal.image}
              alt={deal.name}
              width={400}
              height={200}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <h3 className="text-white text-2xl font-bold">{deal.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Deals;
