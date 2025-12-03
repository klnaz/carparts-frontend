"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { addToCart } from "@/redux/slices/cartSlice";

export interface Product {
  BRANDCODE: string;
  name: string;
  STOCK_QUANTITY?: number | string | null;
  price: number;
  image?: string;
  BRAND?: string;
  CAR_BRAND?: string;
  discount?: number;
}

interface ProductCardProps {
  product: Product;
  onImageClick?: (id: string) => void;
}

const ProductCard = ({ product, onImageClick }: ProductCardProps) => {
  const dispatch = useDispatch();

  const [isFavorite, setIsFavorite] = useState(false);
  const [showAdded, setShowAdded] = useState(false);

  // ✅ Görsel kaynağı
  const imageSrc = useMemo(
    () =>
      product.image && product.image.toString().trim() !== ""
        ? product.image
        : "/placeholder.svg",
    [product.image]
  );

  // ✅ İndirimli fiyat hesaplama
  const finalPrice = useMemo(() => {
    if (product.discount && product.discount > 0) {
      return product.price * (1 - product.discount / 100);
    }
    return product.price;
  }, [product.price, product.discount]);

  // ✅ STOK HESAPLAMA (senin istediğin mantık):
  // STOCK_QUANTITY yoksa / null / "" / NaN → 0 kabul et
  const rawStock = product.STOCK_QUANTITY;

  let stockNumber: number = 0;

  if (rawStock !== undefined && rawStock !== null && rawStock !== "") {
    if (typeof rawStock === "number") {
      stockNumber = rawStock;
    } else {
      const parsed = Number(String(rawStock).replace(",", "."));
      stockNumber = Number.isNaN(parsed) ? 0 : parsed;
    }
  } else {
    stockNumber = 0;
  }

  // ✔️ Stokta yok: 0 veya altı
  const isOutOfStock = stockNumber <= 0;

  // 🛒 Sepete ekleme
  const handleAddToCart = useCallback(() => {
    if (isOutOfStock) return; // stok yoksa hiçbir şey yapma

    dispatch(
      addToCart({
        id: product.BRANDCODE,
        name: product.name,
        price: finalPrice,
        image: imageSrc,
        quantity: 1,
      })
    );

    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 1500);
  }, [dispatch, product.BRANDCODE, product.name, finalPrice, imageSrc, isOutOfStock]);

  const handleToggleFavorite = useCallback(() => {
    setIsFavorite((prev) => !prev);
  }, []);

  const handleImageClick = useCallback(() => {
    if (onImageClick) {
      onImageClick(product.BRANDCODE);
    }
  }, [onImageClick, product.BRANDCODE]);

  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col w-44 sm:w-52 md:w-60 relative">
      {/* İndirim etiketi */}
      {product.discount && product.discount > 0 && (
        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          %{product.discount}
        </div>
      )}

      {/* Ürün Görseli */}
      <div
        className="relative w-full h-48 bg-white cursor-pointer"
        onClick={handleImageClick}
      >
        <Image
          src={imageSrc}
          alt={product.name || "Ürün resmi"}
          fill
          style={{ objectFit: "contain" }}
          className="rounded-t-xl"
          sizes="(max-width: 768px) 50vw, 20vw"
        />

        {/* Favori butonu */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // resim tıklamasını tetiklemesin
            handleToggleFavorite();
          }}
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

        {/* Stok Bilgisi (her zaman gösteriyoruz, çünkü yoksa bile 0 muamelesi yapıyoruz) */}
        <p
          className={`text-xs sm:text-sm mt-1 ${
            isOutOfStock ? "text-red-600 font-semibold" : "text-gray-600"
          }`}
        >
          {isOutOfStock ? "Stokta yok" : `Stok: ${stockNumber}`}
        </p>

        {/* Fiyat */}
        <div className="flex items-center gap-2 mt-1">
          {product.discount && product.discount > 0 ? (
            <>
              <p className="text-gray-500 line-through text-sm">
                {product.price.toLocaleString("tr-TR")} ₺
              </p>
              <p className="text-red-600 font-bold text-sm sm:text-lg">
                {finalPrice.toLocaleString("tr-TR")} ₺
              </p>
            </>
          ) : (
            <p className="text-red-600 font-bold text-sm sm:text-lg">
              {product.price.toLocaleString("tr-TR")} ₺
            </p>
          )}
        </div>

        {/* Sepete Ekle Butonu */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`mt-auto flex items-center justify-center gap-2 py-2 rounded-lg text-sm sm:text-base relative transition
            ${
              isOutOfStock
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
        >
          <HiOutlineShoppingBag size={18} />
          {isOutOfStock ? "Stokta Yok" : "Sepete Ekle"}
        </button>
      </div>

      {/* Sepete eklendi bildirimi — KARTIN TAM ORTASINDA */}
      {showAdded && !isOutOfStock && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl rounded-full px-4 py-2 flex items-center gap-2 animate-bounce">
            <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-[10px] text-white">
              ✓
            </span>
            <span className="text-[11px] text-gray-800">
              Sepete eklendi
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
