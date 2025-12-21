// C:\Users\erhan\OneDrive\Masaüstü\carparts\frontend\src\app\products\[brandCode]\page.tsx
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  ShoppingCart,
  Heart,
  Star,
  X,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Info,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

import bestSellersDataRaw from "../../../data/bestSellers.json";

import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";
import type { RootState } from "@/redux/store";
import { addRecentlyViewed } from "@/utils/recentlyViewed";

/**
 * ✅ ÇÖZÜM A: Favoriye eklerken DB UUID göndereceğiz
 * - bestSellers.json içindeki her ürünün id alanı (UUID) olmalı
 * - product.BRANDCODE değil -> product.id kullanacağız
 *
 * ✅ Misafir favoriler:
 * - cookie'de guest_favorites (JSON array of UUIDs) tutuyoruz
 * - kullanıcı login olunca cookie'deki UUID'leri API'ye basıp cookie'yi temizliyoruz
 */

interface ProductDetail {
  id: string; // ✅ DB UUID (favorites için gerekli)
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

interface QAItem {
  question: string;
  answer: string;
}

const qas: QAItem[] = [
  {
    question: "Bu ürün benim aracımla uyumlu mu?",
    answer:
      "OEM kodunu ve araç marka/model bilgilerinizi ürün açıklamasındaki bilgilerle karşılaştırarak uyumluluğu kontrol edebilirsiniz. Emin değilseniz ustanızla da paylaşabilirsiniz.",
  },
  {
    question: "Ürün orijinal mi?",
    answer:
      "Tüm ürünlerimiz tedarikçi faturaları ile alınmış, faturalı ve garantili ürünlerdir.",
  },
  {
    question: "İade / değişim mümkün mü?",
    answer:
      "Montajı yapılmamış, ambalajı bozulmamış ürünler için 14 gün içerisinde iade ve değişim hakkınız bulunmaktadır.",
  },
];

// -------------------- Cookie helpers (guest favorites) --------------------
const GUEST_FAV_COOKIE = "guest_favorites";
const COOKIE_DAYS = 30;

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  if (!match) return null;
  return decodeURIComponent(match.split("=").slice(1).join("="));
}

function setCookie(name: string, value: string, days = COOKIE_DAYS) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

function readGuestFavorites(): string[] {
  try {
    const raw = getCookie(GUEST_FAV_COOKIE);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x) => typeof x === "string");
  } catch {
    return [];
  }
}

function writeGuestFavorites(ids: string[]) {
  setCookie(GUEST_FAV_COOKIE, JSON.stringify(ids));
}

// -------------------- API helpers (auth favorites) --------------------
type FavoriteApiItem = {
  id: string; // favorite row id (UUID)
  userId: string;
  productId: string;
  Product?: {
    id: string;
    stockName1?: string;
    salesPrice1?: number;
    brand?: string;
    model?: string;
  };
};

async function apiGetFavorites(token: string): Promise<FavoriteApiItem[]> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${base}/favorites`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(t || "Favoriler alınamadı.");
  }

  const json = await res.json();
  return (json?.data ?? []) as FavoriteApiItem[];
}

async function apiAddFavorite(token: string, productId: string): Promise<void> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${base}/favorites`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId }),
  });

  if (!res.ok) {
    const json = await res.json().catch(() => null);
    const msg = json?.message || "Favoriye eklenemedi.";
    throw new Error(msg);
  }
}

async function apiRemoveFavorite(token: string, productId: string): Promise<void> {
  const base = process.env.NEXT_PUBLIC_API_URL;

  // ⚠️ Backend route: DELETE /favorites/:id
  // Controller "id" paramını service'e productId olarak geçiriyor.
  // Bu yüzden burada :id = productId göndermek doğru.
  const res = await fetch(`${base}/favorites/${productId}`, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const json = await res.json().catch(() => null);
    const msg = json?.message || "Favoriden çıkarılamadı.";
    throw new Error(msg);
  }
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const brandCode = decodeURIComponent((params as any)?.brandCode ?? "");

  const dispatch = useDispatch();

  const token = useSelector((state: RootState) => state.auth.token);
  const isLoggedIn = Boolean(token);

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openQuestionIndex, setOpenQuestionIndex] = useState<number | null>(null);

  // Favori state
  const [isFavorited, setIsFavorited] = useState(false);
  const [favBusy, setFavBusy] = useState(false);
  const [heartBump, setHeartBump] = useState(false);
  const bumpTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cartCount = useSelector(
    (state: RootState) => state.cart?.items?.length ?? 0
  );

  const bestSellersData: ProductDetail[] = useMemo(() => {
    return (bestSellersDataRaw as any[]).map((item) => ({
      // ✅ DB UUID: JSON'da id olmalı
      id: item.id || "",
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
    }));
  }, []);

  useEffect(() => {
    if (!brandCode) return;

    const found = bestSellersData.find((p) => p.BRANDCODE === brandCode);

    if (!found) {
      setError("Ürün bulunamadı.");
      setProduct(null);
      setLoading(false);
      return;
    }

    setProduct(found);
    setLoading(false);

    addRecentlyViewed({
      id: found.BRANDCODE,
      name: found.NAME,
      price: found.price,
      image: found.image,
      BRAND: found.BRAND,
      CAR_BRAND: found.CAR_BRAND,
    });
  }, [brandCode, bestSellersData]);

  // ✅ İlk favori durumunu belirle (guest veya auth)
  useEffect(() => {
    if (!product) return;

    // product.id yoksa favori sistemi çalışamaz (Çözüm A)
    if (!product.id) {
      setIsFavorited(false);
      return;
    }

    if (!isLoggedIn) {
      const guestIds = readGuestFavorites();
      setIsFavorited(guestIds.includes(product.id));
      return;
    }

    // logged in -> API'den favori listesi çek, productId içinde var mı bak
    let cancelled = false;
    (async () => {
      try {
        const favs = await apiGetFavorites(token as string);
        if (cancelled) return;
        const exists = favs.some((f) => f.productId === product.id);
        setIsFavorited(exists);
      } catch {
        // sessiz geç; UI kırılmasın
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [product, isLoggedIn, token]);

  // ✅ Login olunca cookie favorileri DB'ye taşı (sync)
  useEffect(() => {
    if (!token) return;

    const guestIds = readGuestFavorites();
    if (!guestIds.length) return;

    let cancelled = false;
    (async () => {
      try {
        // önce mevcut favorileri çek (duplicate önlemek için)
        const existing = await apiGetFavorites(token);
        const existingIds = new Set(existing.map((x) => x.productId));

        for (const pid of guestIds) {
          if (existingIds.has(pid)) continue;
          try {
            await apiAddFavorite(token, pid);
          } catch {
            // tek bir ürün fail olsa bile devam
          }
        }

        if (!cancelled) {
          deleteCookie(GUEST_FAV_COOKIE);
        }
      } catch {
        // sync fail -> cookie kalsın
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    return () => {
      if (bumpTimerRef.current) clearTimeout(bumpTimerRef.current);
    };
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-6">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm min-h-[200px] flex items-center justify-center">
          <p className="text-gray-600 text-sm">Ürün yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-6">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm min-h-[200px] flex items-center justify-center">
          <p className="text-red-600 text-sm">{error ?? "Ürün bulunamadı."}</p>
        </div>
      </div>
    );
  }

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.image || "/placeholder.svg"];

  const inStock =
    typeof product.STOCK_QUANTITY === "number" && product.STOCK_QUANTITY > 0;

  const formatOem = (oem?: string) => {
    if (!oem) return "";
    if (isLoggedIn) return oem;
    if (oem.length <= 3) return `${oem}******`;
    return `${oem.slice(0, 3)}******`;
  };

  const displayOem = formatOem(product.ozelKodu1);
  const showOemHint = !!product.ozelKodu1 && !isLoggedIn;
  const oemHintText = showOemHint ? "Tüm OEM kodunu görmek için giriş yapın." : "";

  const handleNext = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const handlePrev = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  const handleAddToCart = () => {
    if (!inStock) return;

    dispatch(
      addToCart({
        id: product.BRANDCODE,
        name: product.NAME,
        price: product.price,
        image: images[0],
        quantity: quantity,
      })
    );

    toast.success(
      <div className="flex flex-col gap-1">
        <strong>{quantity} adet sepete eklendi</strong>
        <span className="text-xs text-gray-100">{product.NAME}</span>
      </div>,
      {
        autoClose: 2500,
        className: "!bg-gray-900 !text-white",
      }
    );
  };

  const handleQuantityChange = (value: string) => {
    const num = parseInt(value || "1", 10);
    if (Number.isNaN(num)) {
      setQuantity(1);
      return;
    }
    const max = product.STOCK_QUANTITY || 1;
    setQuantity(Math.max(1, Math.min(num, max)));
  };

  const similarProducts = bestSellersData
    .filter((p) => p.BRANDCODE !== product.BRANDCODE)
    .filter(
      (p) =>
        p.BRAND === product.BRAND ||
        p.CATOGERY === product.CATOGERY ||
        p.CAR_BRAND === product.CAR_BRAND
    )
    .slice(0, 6);

  const toggleQuestion = (index: number) => {
    setOpenQuestionIndex((prev) => (prev === index ? null : index));
  };

  // ✅ Favori toggle (tasarım aynı, sadece logic + küçük animasyon)
  const handleFavorite = async () => {
    if (!product.id) {
      toast.error("Ürün id (UUID) bulunamadı. Favori işlemi yapılamadı.");
      return;
    }
    if (favBusy) return;

    setFavBusy(true);

    // küçük animasyon
    setHeartBump(true);
    if (bumpTimerRef.current) clearTimeout(bumpTimerRef.current);
    bumpTimerRef.current = setTimeout(() => setHeartBump(false), 220);

    try {
      if (!isLoggedIn) {
        const guestIds = readGuestFavorites();
        const exists = guestIds.includes(product.id);
        const next = exists
          ? guestIds.filter((x) => x !== product.id)
          : [product.id, ...guestIds];

        writeGuestFavorites(next);
        setIsFavorited(!exists);

        toast[exists ? "info" : "success"](
          exists ? "Favorilerden çıkarıldı" : "Favorilere eklendi",
          { autoClose: 1600 }
        );
        return;
      }

      // logged in -> API
      if (!isFavorited) {
        await apiAddFavorite(token as string, product.id); // ✅ UUID
        setIsFavorited(true);
        toast.success("Favorilere eklendi", { autoClose: 1600 });
      } else {
        await apiRemoveFavorite(token as string, product.id); // ✅ UUID
        setIsFavorited(false);
        toast.info("Favorilerden çıkarıldı", { autoClose: 1600 });
      }
    } catch (e: any) {
      const msg = typeof e?.message === "string" ? e.message : "Favori işlemi başarısız.";
      toast.error(msg, { autoClose: 2200 });
    } finally {
      setFavBusy(false);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-6 space-y-10">
      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 flex items-center gap-1 mb-2">
        <button
          onClick={() => router.back()}
          className="mr-2 text-gray-400 hover:text-gray-600"
        >
          &larr; Geri
        </button>
        <span>
          <Link href="/" className="hover:underline">
            Anasayfa
          </Link>{" "}
          /{" "}
          {product.CATOGERY && (
            <>
              <span className="capitalize text-red-600">{product.CATOGERY.toLowerCase()}</span>{" "}
              /{" "}
            </>
          )}
          <span className="font-medium text-gray-700 line-clamp-1">{product.NAME}</span>
        </span>
      </div>

      {/* Üst ana kart */}
      <div className="flex flex-col md:flex-row gap-8 bg-white border border-gray-200 p-4 md:p-6 rounded-2xl shadow-sm">
        {/* Ürün Görseli */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <div className="relative w-full max-w-md aspect-square bg-white rounded-2xl border border-gray-100 flex items-center justify-center cursor-pointer">
            <Image
              src={images[currentImage]}
              alt={product.NAME}
              fill
              className="object-contain p-4 rounded-2xl"
              onClick={() => setIsModalOpen(true)}
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-gray-900/70 hover:bg-black text-white p-2 rounded-full transition"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-900/70 hover:bg-black text-white p-2 rounded-full transition"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto w-full justify-center">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`relative w-16 h-16 rounded-lg border ${
                    currentImage === idx ? "border-red-500" : "border-gray-200"
                  } overflow-hidden flex-shrink-0`}
                >
                  <Image src={img} alt={`${product.NAME}-${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Ürün Bilgileri */}
        <div className="flex-1 flex flex-col gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">
              {product.CAR_BRAND || product.BRAND || "Oto Yedek Parça"}
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold mt-1 mb-2">{product.NAME}</h1>
            {product.secondaryNAME && <p className="text-sm text-gray-500">{product.secondaryNAME}</p>}
          </div>

          {/* Rating + Stok */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="#fbbf24" stroke="none" />
              ))}
              <span className="ml-1 text-xs text-gray-600">4.9 / 5</span>
              <span className="text-[11px] text-gray-400">(38 değerlendirme)</span>
            </div>
            <div className="h-4 w-[1px] bg-gray-200" />
            <div className="text-xs">
              {inStock ? (
                <span className="text-emerald-600 font-medium">
                  Stokta var{" "}
                  {typeof product.STOCK_QUANTITY === "number" && `(${product.STOCK_QUANTITY} adet)`}
                </span>
              ) : (
                <span className="text-red-600 font-medium">Stokta yok</span>
              )}
            </div>
          </div>

          {/* Fiyat */}
          <div className="flex items-end gap-2">
            <p className="text-2xl md:text-3xl font-semibold text-black">
              {product.price.toLocaleString("tr-TR")} ₺
            </p>
            <p className="text-xs text-gray-500">KDV dahil • Güvenli ödeme</p>
          </div>

          {/* Kısa teknik bilgi bloğu */}
          <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-700 space-y-1 border-l-4 border-red-600">
            {product.ozelKodu1 && (
              <p>
                <span className="font-medium">OEM Kodu: </span>
                <span className="font-mono">{displayOem}</span>
                {showOemHint && (
                  <span className="ml-2 text-[11px] text-gray-500">(Tümünü görmek için giriş yapın)</span>
                )}
              </p>
            )}
            {product.grubu && (
              <p>
                <span className="font-medium">Grup: </span>
                {product.grubu}
              </p>
            )}
            {product.CAR_BRAND && (
              <p>
                <span className="font-medium">Araç Markası: </span>
                {product.CAR_BRAND}
                {product.CAR_SUBBRAND && ` / ${product.CAR_SUBBRAND}`}
              </p>
            )}
            {product.modeli && (
              <p>
                <span className="font-medium">Model: </span>
                {product.modeli}
              </p>
            )}
          </div>

          {/* Sepete Ekle Alanı */}
          <div className="flex flex-col gap-3 mt-2">
            <div className="flex flex-wrap items-center gap-3">
              {/* Adet seçici */}
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                  className="px-3 py-2 text-lg text-gray-600 hover:bg-gray-100"
                >
                  -
                </button>
                <input
                  type="number"
                  min={1}
                  max={product.STOCK_QUANTITY || 1}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  className="w-16 text-center border-x text-sm py-2 outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) =>
                      product.STOCK_QUANTITY ? Math.min(q + 1, product.STOCK_QUANTITY) : q + 1
                    )
                  }
                  className="px-3 py-2 text-lg text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              {/* Sepete ekle butonu */}
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium text-sm transition ${
                  inStock
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <ShoppingCart size={18} />
                {inStock ? "Sepete Ekle" : "Stokta Yok"}
              </button>

              {/* Favori butonu (tasarım aynı) */}
              <button
                onClick={handleFavorite}
                disabled={favBusy}
                className="flex gap-2 items-center border px-4 py-2 rounded-lg hover:bg-gray-50 transition text-sm disabled:opacity-60"
              >
                <Heart
                  size={18}
                  className={`text-red-600 transition-transform ${
                    heartBump ? "scale-125" : "scale-100"
                  }`}
                  // sadece ikon dolu-görünümü için stroke/fill oynamıyoruz; tasarım bozulmasın diye sınıf kullanıyoruz
                />
                {isFavorited ? "Favorilerden Çıkar" : "Favorilere Ekle"}
              </button>
            </div>

            <p className="text-[11px] text-gray-500 flex items-center gap-1">
              <Info size={14} className="text-gray-400" />
              Saat 16:00&apos;ya kadar verilen siparişler aynı gün kargoya verilir. Yanlış parça
              durumunda iade/değişim hakkınız vardır.
            </p>
          </div>

          {/* (Bu satır sadece senin debug için istersen kaldır) */}
          <p className="text-[10px] text-gray-400">
            {/* Favori için gerekli UUID: */}
            {/* product.id: {product.id || "(YOK)"} */}
          </p>
        </div>
      </div>

      {/* Alt içerik: Teknik detay + açıklama + SSS + yorumlar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol taraf */}
        <div className="lg:col-span-2 space-y-6">
          {/* Teknik Bilgiler */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-5 shadow-sm">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Info size={18} className="text-red-600" />
              Ürün Teknik Bilgileri
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs text-gray-700">
              {product.ozelKodu1 && (
                <div className="flex justify-between border-b py-1">
                  <span className="text-gray-500">OEM Kodu</span>
                  <span className="font-medium font-mono">{displayOem}</span>
                </div>
              )}
              {showOemHint && (
                <div className="md:col-span-2 text-[11px] text-gray-500 pt-1">{oemHintText}</div>
              )}
              {product.barkodu && (
                <div className="flex justify-between border-b py-1">
                  <span className="text-gray-500">Barkod</span>
                  <span className="font-medium">{product.barkodu}</span>
                </div>
              )}
              {product.grubu && (
                <div className="flex justify-between border-b py-1">
                  <span className="text-gray-500">Parça Grubu</span>
                  <span className="font-medium">{product.grubu}</span>
                </div>
              )}
              {product.CAR_BRAND && (
                <div className="flex justify-between border-b py-1">
                  <span className="text-gray-500">Araç Markası</span>
                  <span className="font-medium">
                    {product.CAR_BRAND}
                    {product.CAR_SUBBRAND && ` / ${product.CAR_SUBBRAND}`}
                  </span>
                </div>
              )}
              {product.modeli && (
                <div className="flex justify-between border-b py-1">
                  <span className="text-gray-500">Model</span>
                  <span className="font-medium">{product.modeli}</span>
                </div>
              )}
              {product.secondaryNAME && (
                <div className="flex justify-between border-b py-1">
                  <span className="text-gray-500">Güncelleme / Not</span>
                  <span className="font-medium">{product.secondaryNAME}</span>
                </div>
              )}
            </div>
          </div>

          {/* Açıklama */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-5 shadow-sm">
            <h2 className="text-lg font-semibold mb-3">Ürün Açıklaması</h2>
            {product.aciklama2 ? (
              <p className="text-sm text-gray-700 whitespace-pre-line">{product.aciklama2}</p>
            ) : (
              <p className="text-sm text-gray-500">
                Bu ürün, {product.CAR_BRAND || "çeşitli araçlarla"} uyumlu, kalite standartlarına
                uygun bir yedek parçadır. OEM kodunu ve araç marka/model bilgilerinizi kontrol ederek
                uyumluluğu teyit etmenizi öneririz.
              </p>
            )}
          </div>

          {/* Soru & Cevap (SSS) */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-5 shadow-sm">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <HelpCircle size={18} className="text-red-600" />
              Sık Sorulan Sorular
            </h2>

            <div className="space-y-2">
              {qas.map((item, index) => {
                const isOpen = openQuestionIndex === index;
                return (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleQuestion(index)}
                      className="w-full flex justify-between items-center px-3 py-2 text-left text-sm hover:bg-gray-50"
                    >
                      <span className="font-medium text-gray-800">{item.question}</span>
                      <span className="text-gray-400 text-xs">{isOpen ? "-" : "+"}</span>
                    </button>
                    {isOpen && <div className="px-3 pb-3 text-xs text-gray-600">{item.answer}</div>}
                  </div>
                );
              })}
            </div>

            <p className="mt-3 text-[11px] text-gray-500">
              Sorunuz mu var? Siparişten sonra teknik ekibimizle WhatsApp üzerinden birebir iletişime
              geçebilirsiniz.
            </p>
          </div>

          {/* Müşteri Yorumları (dummy) */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-5 shadow-sm">
            <h2 className="text-lg font-semibold mb-3">Müşteri Yorumları</h2>
            <div className="space-y-4 text-sm">
              <div className="border-b pb-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Ali K.</span>
                  <div className="flex items-center gap-1 text-yellow-500 text-xs">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="#fbbf24" stroke="none" />
                    ))}
                    <span className="ml-1 text-gray-600 text-xs">5 / 5</span>
                  </div>
                </div>
                <p className="mt-1 text-gray-700">
                  “Ürün çok kaliteli, birebir uydu. Kargo süreci de hızlıydı.”
                </p>
              </div>

              <div className="border-b pb-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Mehmet T.</span>
                  <div className="flex items-center gap-1 text-yellow-500 text-xs">
                    {[...Array(4)].map((_, i) => (
                      <Star key={i} size={14} fill="#fbbf24" stroke="none" />
                    ))}
                    <Star size={14} className="text-gray-300" />
                    <span className="ml-1 text-gray-600 text-xs">4 / 5</span>
                  </div>
                </div>
                <p className="mt-1 text-gray-700">
                  “Fiyat/performans olarak gayet iyi, tekrar tercih ederim.”
                </p>
              </div>

              <p className="text-[11px] text-gray-500">
                Yorumlar temsilidir. Gerçek kullanıcı yorumları entegrasyonu daha sonra eklenebilir.
              </p>
            </div>
          </div>
        </div>

        {/* Sağ: Sipariş & Garanti kutuları */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-5 shadow-sm text-sm space-y-3">
            <h3 className="font-semibold text-gray-900">Sipariş & Teslimat</h3>
            <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
              <li>Saat 16:00&apos;ya kadar aynı gün kargo.</li>
              <li>Türkiye&apos;nin her yerine hızlı teslimat.</li>
              <li>Orijinal / muadil ürün tedariki.</li>
              <li>14 gün içinde iade / değişim imkanı.</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-5 shadow-sm text-sm space-y-3">
            <h3 className="font-semibold text-gray-900">Garanti & Destek</h3>
            <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
              <li>Ürünler faturalı ve garantilidir.</li>
              <li>Montaj öncesi ürün kontrolü yapınız.</li>
              <li>Destek için WhatsApp hattımızdan bize ulaşabilirsiniz.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Benzer Ürünler */}
      {similarProducts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Benzer Ürünler</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {similarProducts.map((sp) => {
              const spInStock = typeof sp.STOCK_QUANTITY === "number" && sp.STOCK_QUANTITY > 0;

              return (
                <Link
                  key={sp.BRANDCODE}
                  href={`/products/${encodeURIComponent(sp.BRANDCODE)}`}
                  className="group bg-white border border-gray-200 rounded-xl p-3 flex flex-col hover:shadow-md hover:-translate-y-0.5 transition"
                >
                  <div className="relative w-full aspect-square mb-2 bg-white rounded-lg border border-gray-50 overflow-hidden">
                    <Image
                      src={sp.image || "/placeholder.svg"}
                      alt={sp.NAME}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {sp.BRAND || sp.CAR_BRAND || "Marka"}
                  </p>
                  <p className="text-sm font-medium line-clamp-2 min-h-[38px]">{sp.NAME}</p>
                  <p className="text-sm font-semibold text-red-600 mt-1">
                    {sp.price.toLocaleString("tr-TR")} ₺
                  </p>
                  <p className={`text-[11px] mt-1 ${spInStock ? "text-emerald-600" : "text-red-600"}`}>
                    {spInStock ? `Stok: ${sp.STOCK_QUANTITY}` : "Stokta yok"}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal Lightbox */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full">
            <Image
              src={images[currentImage]}
              alt={product.NAME}
              width={800}
              height={800}
              className="rounded-lg object-contain w-full max-h-[80vh] bg-white"
            />
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-white bg-gray-800/60 rounded-full p-2 hover:bg-gray-900 transition"
            >
              <X size={22} />
            </button>
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-800/60 p-2 rounded-full text-white hover:bg-gray-900 transition"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800/60 p-2 rounded-full text-white hover:bg-gray-900 transition"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
