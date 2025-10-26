"use client";

import Image from "next/image";

export interface Product {
  BRANDCODE: string;
  name: string;
  price: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
  onImageClick?: () => void;
}

const ProductCard = ({ product, onImageClick }: ProductCardProps) => {
  // boş image gelirse placeholder kullan
  const imageSrc = product.image || "/placeholder.png";

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all bg-white">
      <div
        className="cursor-pointer relative group w-full h-48 p-4"
        onClick={onImageClick}
      >
        <Image
          src={imageSrc}
          alt={product.name || "Ürün resmi"}
          fill
          style={{ objectFit: "contain" }}
          className="rounded-md"
          priority={true} // sayfa yüklenirken öncelikli yükle
        />
      </div>

      <div className="px-4 pb-3">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-1">
          {product.name || "Ürün adı yok"}
        </h3>
        <p className="text-gray-600 text-sm mt-1">{product.price} ₺</p>
      </div>
    </div>
  );
};

export default ProductCard;
