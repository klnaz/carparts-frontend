"use client";

import Image from "next/image";

interface ProductDetailProps {
  name: string;
  image: string;
  description?: string;
  price: number;
}

const ProductDetailCard = ({
  name,
  image,
  description,
  price,
}: ProductDetailProps) => {
  // boş image gelirse placeholder kullan
  const imageSrc = image || "/placeholder.png";

  return (
    <div className="flex flex-col sm:flex-row gap-6 bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
      <div className="relative w-full sm:w-1/2 h-64 sm:h-auto">
        <Image
          src={imageSrc}
          alt={name || "Ürün resmi"}
          fill
          style={{ objectFit: "contain" }}
          className="rounded-md"
          priority={true} // sayfa yüklenirken öncelikli yükle
        />
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-2">{name || "Ürün adı yok"}</h2>
        <p className="text-gray-600 mb-4">{description || "Ürün açıklaması yok."}</p>
        <p className="text-xl font-bold text-black">{price} ₺</p>
      </div>
    </div>
  );
};

export default ProductDetailCard;
