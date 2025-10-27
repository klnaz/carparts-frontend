"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import { ShoppingCart, Heart, Star, X, ChevronLeft, ChevronRight } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import bestSellersDataRaw from "../../../data/bestSellers.json";

interface ProductDetail {
  BRANDCODE: string;
  NAME: string;
  STOCK_QUANTITY?: number;
  price: number;
  miktarGiren?: number;
  miktarCikan?: number;
  ozelKodu1?: string;
  aciklama2?: string;
  ozelKodu2?: string;
  ozelKodu3?: string;
  secondaryNAME?: string;
  grubu?: string;
  barkodu?: string;
  CAR_BRAND?: string;
  CAR_SUBBRAND?: string;
  BRAND?: string;
  CATOGERY?: string;
  SUBCATOGERY?: string;
  image?: string;
  images?: string[];
  modeli?: string;
  altGrubu?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const brandCode = decodeURIComponent((params as any)?.brandCode ?? "");

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const bestSellersData: ProductDetail[] = (bestSellersDataRaw as any[]).map(
    (item) => ({
      BRANDCODE: item.BRANDCODE,
      NAME: item.NAME,
      STOCK_QUANTITY: item.STOCK_QUANTITY,
      price: item.price,
      miktarGiren: item.miktarGiren,
      miktarCikan: item.miktarCikan,
      ozelKodu1: item.OEM_CODE || "",
      aciklama2: item.EXTRACODE || "",
      ozelKodu2: item.ozelKodu2 || "",
      ozelKodu3: item.ozelKodu3 || "",
      secondaryNAME: item.secondaryNAME || "",
      grubu: item.grubu || "",
      barkodu: item.barkodu || "",
      CAR_BRAND: item.CAR_BRAND || "",
      CAR_SUBBRAND: item.CAR_SUBBRAND || "",
      BRAND: item.BRAND || "",
      CATOGERY: item.CATOGERY || "",
      SUBCATOGERY: item.SUBCATOGERY || "",
      image: item.image || "",
      images: item.images || [],
      modeli: item.modeli || "",
      altGrubu: item.altGrubu || "",
    })
  );

  useEffect(() => {
    if (!brandCode) return;
    const found = bestSellersData.find((p) => p.BRANDCODE === brandCode);
    if (!found) {
      setError("Ürün bulunamadı");
      setProduct(null);
    } else {
      setProduct(found);
    }
    setLoading(false);
  }, [brandCode]);

  if (loading)
    return <div className="text-center mt-20 text-gray-600">Yükleniyor...</div>;
  if (error)
    return <div className="text-center mt-20 text-red-600">{error}</div>;
  if (!product)
    return <div className="text-center mt-20">Ürün bulunamadı</div>;

  const images = product.images && product.images.length > 0 ? product.images : [product.image || "/placeholder.svg"];

  const handleNext = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const handlePrev = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  const handleAddToCart = () => {
    toast.success(
      <div className="flex flex-col gap-2">
        <strong>{quantity} adet sepete eklendi</strong>
        <span>{product.NAME}</span>
      </div>,
      { autoClose: 3000 }
    );
  };

  const handleFavorite = () => {
    toast.info(`"${product.NAME}" favorilere eklendi`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-8 bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
        {/* Ürün Görseli */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <Image
            src={images[currentImage]}
            alt={product.NAME}
            width={400}
            height={400}
            className="rounded-2xl shadow-md object-contain max-h-[400px] cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          />
          {images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {images.map((img, idx) => (
                <Image
                  key={idx}
                  src={img}
                  alt={`${product.NAME}-${idx}`}
                  width={80}
                  height={80}
                  className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                    currentImage === idx ? "border-orange-500" : "border-transparent"
                  }`}
                  onClick={() => setCurrentImage(idx)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Ürün Bilgileri */}
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-3xl font-bold mb-3">{product.NAME}</h1>
          <p className="text-gray-600 mb-4">{product.aciklama2}</p>
          <p className="text-2xl font-semibold text-black mb-4">{product.price} ₺</p>

          <div className="text-sm text-gray-700 space-y-1">
            <p><b>Marka:</b> {product.BRAND}</p>
            <p><b>Grubu:</b> {product.grubu}</p>
            <p><b>OEM Kodu:</b> {product.ozelKodu1}</p>
            <p><b>Stok:</b> {product.STOCK_QUANTITY}</p>
          </div>

          <div className="flex gap-4 mt-4 flex-wrap">
            <input
              type="number"
              min={1}
              max={product.STOCK_QUANTITY || 1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 border rounded px-2 py-1 text-center"
            />
            <button
              onClick={handleAddToCart}
              disabled={!product.STOCK_QUANTITY || product.STOCK_QUANTITY === 0}
              className="flex-1 flex items-center justify-center gap-2 bg-orange-500 text-white font-medium py-2 rounded hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={20} /> Sepete Ekle
            </button>
            <button
              onClick={handleFavorite}
              className="flex gap-2 items-center border px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              <Heart size={20} /> Favorilere Ekle
            </button>
          </div>

          {/* Müşteri Yorumları */}
          <div className="mt-6">
            <h2 className="font-semibold text-lg mb-2">Müşteri Yorumları</h2>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} />
                ))}
                <span className="ml-2 text-gray-600">5.0 / 5</span>
              </div>
              <p className="text-gray-700">"Ürün çok kaliteli, hızlı kargo ve paketleme mükemmel!"</p>
              <p className="text-gray-700">"Fiyatına göre oldukça iyi. Tavsiye ederim."</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Lightbox */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full">
            <Image
              src={images[currentImage]}
              alt={product.NAME}
              width={800}
              height={800}
              className="rounded-lg object-contain w-full max-h-[80vh]"
            />
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-white bg-gray-800/50 rounded-full p-2 hover:bg-gray-800 transition"
            >
              <X size={24} />
            </button>
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-800/50 p-2 rounded-full text-white hover:bg-gray-800 transition"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800/50 p-2 rounded-full text-white hover:bg-gray-800 transition"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
