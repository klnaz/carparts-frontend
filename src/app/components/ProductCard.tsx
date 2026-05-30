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
    <div className="group bg-white border border-zinc-200 rounded-2xl shadow-sm hover:shadow-md hover:border-red-500/40 transition-all duration-300 overflow-hidden flex flex-col w-full relative">
      {/* İndirim etiketi */}
      {product.discount && product.discount > 0 && (
        <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md z-10 uppercase tracking-wider shadow-md">
          %{product.discount} İndirim
        </div>
      )}

      {/* Ürün Görseli */}
      <div
        className="relative w-full h-44 sm:h-48 bg-zinc-50/50 cursor-pointer overflow-hidden flex items-center justify-center border-b border-zinc-100"
        onClick={handleImageClick}
      >
        <Image
          src={imageSrc}
          alt={product.name || "Ürün resmi"}
          fill
          style={{ objectFit: "contain" }}
          className="p-4 transition-transform duration-500 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 20vw"
        />

        {/* Favori butonu */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // resim tıklamasını tetiklemesin
            handleToggleFavorite();
          }}
          className="absolute top-3 right-3 p-2 rounded-lg bg-white/90 border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 transition z-10 cursor-pointer shadow-sm"
        >
          {isFavorite ? (
            <AiFillHeart className="text-red-500" size={17} />
          ) : (
            <AiOutlineHeart className="text-zinc-400 hover:text-red-500 transition-colors" size={17} />
          )}
        </button>
      </div>

      {/* Ürün Bilgileri */}
      <div className="p-4 flex flex-col flex-grow bg-white text-left">
        {/* Brand tag */}
        {(product.BRAND || product.CAR_BRAND) && (
          <p className="text-zinc-400 text-[10px] font-bold tracking-wider uppercase mb-1 line-clamp-1">
            {product.BRAND} {product.CAR_BRAND && `• ${product.CAR_BRAND}`}
          </p>
        )}

        <h3 className="font-semibold text-zinc-800 line-clamp-2 min-h-[36px] text-xs sm:text-sm group-hover:text-red-600 transition-colors duration-250 leading-snug">
          {product.name || "Ürün adı yok"}
        </h3>

        {/* Stok Bilgisi */}
        <p
          className={`text-[11px] mt-2 font-medium ${
            isOutOfStock ? "text-red-500/90 font-semibold" : "text-zinc-500"
          }`}
        >
          {isOutOfStock ? "Stokta yok" : `Stok: ${stockNumber} Adet`}
        </p>

        {/* Fiyat ve Sepete Ekle Butonu */}
        <div className="mt-3.5 space-y-3">
          <div className="flex items-baseline gap-2">
            {product.discount && product.discount > 0 ? (
              <>
                <span className="text-zinc-400 line-through text-[11px]">
                  {product.price.toLocaleString("tr-TR")} ₺
                </span>
                <span className="text-red-600 font-extrabold text-sm sm:text-base tracking-tight">
                  {finalPrice.toLocaleString("tr-TR")} ₺
                </span>
              </>
            ) : (
              <span className="text-red-600 font-extrabold text-sm sm:text-base tracking-tight">
                {product.price.toLocaleString("tr-TR")} ₺
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300
              ${
                isOutOfStock
                  ? "bg-zinc-100 border border-zinc-200 text-zinc-400 cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:shadow-red-200/40 hover:-translate-y-0.5 cursor-pointer shadow-sm"
              }`}
          >
            <HiOutlineShoppingBag size={15} />
            {isOutOfStock ? "Stokta Yok" : "Sepete Ekle"}
          </button>
        </div>
      </div>

      {/* Sepete eklendi bildirimi — KARTIN TAM ORTASINDA */}
      {showAdded && !isOutOfStock && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="bg-white border border-zinc-200 shadow-2xl rounded-2xl px-4 py-3 flex items-center gap-2 animate-bounce">
            <span className="w-4 h-4 rounded-full bg-green-600 flex items-center justify-center text-[10px] text-white">
              ✓
            </span>
            <span className="text-xs font-semibold text-zinc-800">
              Sepete Eklendi
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
