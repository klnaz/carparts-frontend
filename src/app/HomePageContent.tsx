"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { FiTruck, FiShield, FiPhoneCall } from "react-icons/fi";
import { BsBuildingGear } from "react-icons/bs";
import { MdOutlineTune } from "react-icons/md";

import ProductCard, { Product } from "./components/ProductCard";
import HomeSearchBar from "./components/HomeSearchBar";
import CarBrandLogosStrip from "./components/CarBrandLogosStrip";
import RecentlyViewedSection, {
  RecentlyViewedItem,
} from "./components/RecentlyViewedSection";

import { getRecentlyViewed } from "@/utils/recentlyViewed";

interface HomePageContentProps {
  bestSellers: Product[];
  topBestSellers: Product[];
}

const HomePageContent = ({ topBestSellers }: HomePageContentProps) => {
  const router = useRouter();
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>([]);

  useEffect(() => {
    try {
      const items = getRecentlyViewed();
      setRecentlyViewed(items);
    } catch (err) {
      console.error("Son görüntülenenler okunamadı:", err);
    }
  }, []);

  const handleProductClick = useCallback(
    (brandCode: string) => {
      router.push(`/products/${encodeURIComponent(brandCode)}`);
    },
    [router]
  );

  return (
    <main className="min-h-screen bg-gray-50">
      {/* HERO */}
      <section className="bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white">
        <div
          className="
            max-w-[1400px] mx-auto
            px-4 sm:px-6
            py-8 sm:py-10 md:py-12 lg:py-16
            grid grid-cols-1 lg:grid-cols-2
            gap-8 lg:gap-10
            items-center
          "
        >
          {/* Left */}
          <div className="space-y-5 sm:space-y-6">
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-gray-400">
              PROFESYONEL OTO YEDEK PARÇA TEDARİĞİ
            </p>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
              Aradığınız tüm{" "}
              <span className="text-red-500">oto yedek parçalar</span> tek
              noktada: Ko<span className="text-red-500">parts</span>
            </h1>

            <p className="text-sm sm:text-base text-gray-300 max-w-xl">
              Binek ve ticari araçlar için geniş ürün gamı, hızlı teslimat ve
              kurumsal tedarik çözümleri. Ustanızın güvendiği parçaları, kurumsal
              hizmet kalitesiyle sunuyoruz.
            </p>

            {/* ANA SAYFA ARAMA BARI → /search */}
            <div className="pt-1">
              <HomeSearchBar />
            </div>

            {/* CTA (mobilde tam genişlik) */}
            <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-3">
              <button
                onClick={() => router.push("/search")}
                className="
                  w-full sm:w-auto
                  px-5 py-2.5 rounded-full text-sm font-medium
                  bg-red-600 hover:bg-red-700 text-white transition shadow-sm
                "
              >
                Parça Bul
              </button>

              <button
                onClick={() => router.push("/kurumsal-teklif")}
                className="
                  w-full sm:w-auto
                  px-5 py-2.5 rounded-full text-sm font-medium
                  border border-gray-500 text-gray-100 hover:bg-gray-800
                  transition flex items-center justify-center gap-2
                "
              >
                <BsBuildingGear size={16} />
                Kurumsal / Toplu Teklif
              </button>
            </div>

            {/* Trust badges (mobil spacing iyileştirildi) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-gray-800 mt-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center">
                  <FiTruck className="text-gray-100" size={18} />
                </div>
                <div>
                  <p className="text-xs font-semibold">Aynı Gün Kargo</p>
                  <p className="text-[11px] text-gray-400">
                    16:00&apos;ya kadar verilen siparişler
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center">
                  <FiShield className="text-gray-100" size={18} />
                </div>
                <div>
                  <p className="text-xs font-semibold">Garantili Ürün</p>
                  <p className="text-[11px] text-gray-400">
                    Faturalı ve kayıtlı tedarik
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center">
                  <FiPhoneCall className="text-gray-100" size={18} />
                </div>
                <div>
                  <p className="text-xs font-semibold">Teknik Destek</p>
                  <p className="text-[11px] text-gray-400">
                    Araç uyumluluğu için destek
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right visual (mobil/tablet için daha dinamik yükseklik) */}
          <div className="relative">
            <div
              className="
                relative w-full
                h-72 sm:h-80 md:h-[420px] lg:h-96
                rounded-3xl overflow-hidden
                bg-gradient-to-tr from-gray-800 via-gray-900 to-gray-800
                border border-gray-700 shadow-2xl
              "
            >
              <Image
                src="https://images.pexels.com/photos/4489732/pexels-photo-4489732.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Oto yedek parça deposu"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                className="object-cover opacity-70"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-gray-900/80 via-gray-900/40 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-900/80 border border-gray-700 text-[11px]">
                    <MdOutlineTune className="mr-1" size={14} />
                    OEM Kodu ile Hızlı Arama
                  </span>
                  <span className="text-[11px] text-gray-300">
                    +10.000&apos;den fazla referans
                  </span>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1 rounded-xl bg-gray-900/80 border border-gray-700 p-3">
                    <p className="text-[11px] text-gray-400">Örnek arama:</p>
                    <p className="text-xs font-mono bg-black/40 rounded-md mt-1 px-2 py-1 inline-block">
                      7701202057 &bull; RENAULT ÖN BALATA
                    </p>
                  </div>

                  <div className="w-28 rounded-xl bg-black/40 border border-gray-700 p-2 flex flex-col justify-between text-[10px]">
                    <p className="text-gray-300 font-medium">Güvenli Alışveriş</p>
                    <p className="text-gray-400">
                      3D Secure <br /> &amp; SSL korumalı.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating stats (mobilde akıllı konum) */}
            <div
              className="
                mt-3 lg:mt-0
                lg:absolute lg:-bottom-4 lg:left-6 lg:right-6
                bg-white rounded-2xl shadow-lg border border-gray-100 p-3 text-xs
              "
            >
              <p className="font-semibold text-gray-900 mb-1">
                Türkiye genelinde binlerce müşteri
              </p>
              <p className="text-[11px] text-gray-500">
                Hem bireysel kullanıcılar hem servisler için sürdürülebilir tedarik
                ortağı.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BİNEK ARAÇ LOGO STANDI */}
      <CarBrandLogosStrip />

      {/* SON GÖRÜNTÜLENENLER */}
      {recentlyViewed.length > 0 && (
        <RecentlyViewedSection items={recentlyViewed} />
      )}

      {/* CATEGORIES */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-8 md:py-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">
              Öne Çıkan Kategoriler
            </h2>
            <p className="text-[12px] text-gray-500">
              En çok sorulan ve en hızlı dönen ürün gruplarına hızlı erişim.
            </p>
          </div>
          <button
            onClick={() => router.push("/search")}
            className="hidden sm:inline-flex text-[12px] text-gray-600 hover:text-gray-900"
          >
            Tüm ürünleri gör
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Fren Sistemleri", code: "FREN" },
            { label: "Motor & Yağ", code: "MOTOR" },
            { label: "Filtreler", code: "FILTRE" },
            { label: "Süspansiyon", code: "SUSPANS" },
            { label: "Elektrik & Aydınlatma", code: "ELEKTRIK" },
            { label: "Tüm Kategoriler", code: "" },
          ].map((cat) => (
            <button
              key={cat.label}
              onClick={() =>
                router.push(
                  cat.code
                    ? `/search?category=${encodeURIComponent(cat.code)}`
                    : "/search"
                )
              }
              className="group bg-white rounded-xl border border-gray-200 hover:border-gray-900 hover:-translate-y-0.5 transition shadow-sm px-3 py-3 flex flex-col items-start gap-1"
            >
              <span className="text-[11px] text-gray-500">Kategori</span>
              <span className="text-sm font-medium text-gray-900 text-left line-clamp-2">
                {cat.label}
              </span>
              <span className="mt-1 text-[11px] text-gray-500 group-hover:text-gray-900">
                {cat.code ? "Ürünleri görüntüle" : "Tüm ürünlere git"}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-6 pb-10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">
              Çok Satan Ürünler
            </h2>
            <p className="text-[12px] text-gray-500">
              Stok devir hızı yüksek, sık tercih edilen referanslar.
            </p>
          </div>
          <button
            onClick={() => router.push("/search?sort=best")}
            className="text-[12px] text-gray-600 hover:text-gray-900"
          >
            Tüm çok satanları gör
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {topBestSellers.map((p) => (
            <ProductCard
              key={p.BRANDCODE}
              product={p}
              onImageClick={handleProductClick}
            />
          ))}
        </div>
      </section>

      {/* BRANDS & TRUST BLOCK */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-8 md:py-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">
              Çalıştığımız Bazı Markalar
            </h3>
            <p className="text-[12px] text-gray-500 max-w-lg">
              Orijinal ve kaliteli muadil markalarla çalışıyor, tedarik zincirimizi
              sürekli güncel tutuyoruz.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {["MGA", "EDGE", "ZEGEN", "RENAULT", "FİAT", "PEUGEOT"].map(
                (brand) => (
                  <span
                    key={brand}
                    className="px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-[11px] text-gray-800"
                  >
                    {brand}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="bg-gray-900 text-white rounded-2xl p-4 md:p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <BsBuildingGear size={18} />
              Servisler & Filolar için Çözümler
            </h3>
            <p className="text-[12px] text-gray-300">
              Düzenli alım yapan servisler, filo şirketleri ve kurumsal müşteriler
              için özel fiyatlandırma, tahsisli temsilci ve stok planlama hizmeti
              sunuyoruz.
            </p>
            <button
              onClick={() => router.push("/kurumsal-teklif")}
              className="mt-1 w-full text-[12px] px-3 py-2 rounded-md bg-white text-gray-900 font-medium hover:bg-gray-100 transition"
            >
              Kurumsal teklif formuna git
            </button>
          </div>
        </div>
      </section>

      {/* FINAL INFO STRIP */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[12px]">
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-1">
              OEM Kodu ile Doğru Parça
            </h4>
            <p className="text-gray-500">
              Ürün detay sayfalarımızda OEM kodu, barkod ve araç marka/model
              bilgisini şeffaf şekilde paylaşıyoruz. Giriş yaptığınızda daha detaylı
              teknik bilgilere erişebilirsiniz.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-1">
              Güvenli Ödeme ve İade
            </h4>
            <p className="text-gray-500">
              3D Secure destekli ödeme altyapısı ile güvenli alışveriş, montajı
              yapılmamış ürünlerde 14 gün iade hakkı.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-1">
              Teknik Destek & Danışmanlık
            </h4>
            <p className="text-gray-500">
              Parçanın aracınızla uyumu hakkında emin değilseniz, sipariş sonrası
              uzman ekibimizle WhatsApp veya telefon üzerinden görüşerek destek
              alabilirsiniz.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePageContent;
