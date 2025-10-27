"use client";

import { useState } from "react";
import Image from "next/image";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { HiOutlineShoppingBag } from "react-icons/hi";

export interface Product {
  BRANDCODE: string;
  name: string;
  STOCK_QUANTITY?: number;
  price: number;
  image?: string;
  BRAND?: string;
  CAR_BRAND?: string;
}

interface ProductCardProps {
  product: Product;
  onImageClick?: (id: string) => void;
}

const ProductCard = ({ product, onImageClick }: ProductCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAdded, setShowAdded] = useState(false);

  const handleAddToCart = () => {
    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 2000);
  };

  const handleToggleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  const imageSrc =
    product.image && product.image.trim() !== ""
      ? product.image
      : "/placeholder.svg";

  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col w-44 sm:w-52 md:w-60 relative">
      {/* Ürün Görseli */}
      <div
        className="relative w-full h-48 bg-white cursor-pointer"
        onClick={() => onImageClick && onImageClick(product.BRANDCODE)}
      >
        <Image
          src={imageSrc}
          alt={product.name || "Ürün resmi"}
          fill
          style={{ objectFit: "contain" }}
          className="rounded-t-xl"
          sizes="(max-width: 768px) 100vw, 25vw"
          priority
        />
        <button
          onClick={handleToggleFavorite}
          className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-red-100 transition z-10"
        >
          {isFavorite ? (
            <AiFillHeart className="text-red-600" size={20} />
          ) : (
            <AiOutlineHeart className="text-gray-600" size={20} />
          )}
        </button>
      </div>

      {/* Ürün Bilgileri */}
      <div className="p-3 flex flex-col flex-grow bg-white">
        <h3 className="font-medium text-gray-900 line-clamp-2 min-h-[40px] text-sm sm:text-base">
          {product.name || "Ürün adı yok"}
        </h3>

        {(product.BRAND || product.CAR_BRAND) && (
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            {product.BRAND} {product.CAR_BRAND && `• ${product.CAR_BRAND}`}
          </p>
        )}

        {product.STOCK_QUANTITY !== undefined && (
          <p className="text-gray-600 text-xs sm:text-sm mt-1">
            Stok: {product.STOCK_QUANTITY}
          </p>
        )}

        <p className="text-red-600 font-bold mt-1 text-sm sm:text-lg">
          {product.price.toLocaleString("tr-TR")} ₺
        </p>

        <button
          onClick={handleAddToCart}
          className="mt-auto flex items-center justify-center gap-2 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition text-sm sm:text-base relative"
        >
          <HiOutlineShoppingBag size={18} />
          Sepete Ekle
        </button>
      </div>

      {showAdded && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce z-20">
          Sepete Eklendi
        </div>
      )}
    </div>
  );
};

export default ProductCard;
