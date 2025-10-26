"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
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
  modeli?: string;
  altGrubu?: string;
}

export default function ProductDetailPage() {
  const params = useParams(); // ✅ Hook burada çağrılmalı
  const brandCode = decodeURIComponent((params as any)?.brandCode ?? "");

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const imageSrc = product.image || "/placeholder.svg";

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col sm:flex-row gap-8 bg-white border border-black-200 p-6 rounded-xl shadow-sm">
        <div className="relative w-full sm:w-1/2 h-72 sm:h-auto">
          <Image
            src={imageSrc}
            alt={product.NAME}
            fill
            className="rounded-md object-contain"
            priority
          />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-3">{product.NAME}</h1>
          <p className="text-gray-600 mb-4">{product.aciklama2}</p>
          <p className="text-2xl font-semibold text-black mb-4">
            {product.price} ₺
          </p>

          <div className="text-sm text-gray-700 space-y-1">
            <p><b>Marka:</b> {product.BRAND}</p>
            <p><b>Grubu:</b> {product.grubu}</p>
            <p><b>OEM Kodu:</b> {product.ozelKodu1}</p>
            <p><b>Stok:</b> {product.STOCK_QUANTITY}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
