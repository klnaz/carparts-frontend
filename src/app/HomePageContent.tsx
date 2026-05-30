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
    <main className="min-h-screen bg-zinc-50 text-zinc-800 pb-16 selection:bg-red-600 selection:text-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-zinc-50 to-zinc-100/50 border-b border-zinc-200/80 py-10 md:py-16">
        {/* Glowing Accents */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-zinc-200/20 rounded-full blur-[140px] pointer-events-none" />

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
          <div className="space-y-5 sm:space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-250/60 text-[10px] sm:text-xs font-bold tracking-wider text-red-655 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              PROFESYONEL OTO YEDEK PARÇA TEDARİĞİ
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-zinc-900">
              Aradığınız tüm <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-700 drop-shadow-[0_2px_10px_rgba(220,38,38,0.15)]">oto yedek parçalar</span> <br />
              tek noktada: Ko<span className="text-red-650">parts</span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-650 max-w-xl leading-relaxed font-medium">
              Binek ve ticari araçlar için geniş ürün gamı, hızlı teslimat ve
              kurumsal tedarik çözümleri. Ustanızın güvendiği parçaları, kurumsal
              hizmet kalitesiyle sunuyoruz.
            </p>

            {/* ANA SAYFA ARAMA BARI → /search */}
            <div className="pt-1">
              <HomeSearchBar />
            </div>

            {/* CTA (mobilde tam genişlik) */}
            <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-4 pt-2">
              <button
                onClick={() => router.push("/search")}
                className="
                  w-full sm:w-auto
                  px-7 py-3.5 rounded-xl text-sm font-bold
                  bg-red-600 hover:bg-red-700 text-white transition-all duration-300 shadow-md shadow-red-200 hover:shadow-red-300 cursor-pointer select-none
                "
              >
                Parça Bul
              </button>

              <button
                onClick={() => router.push("/kurumsal-teklif")}
                className="
                  w-full sm:w-auto
                  px-7 py-3.5 rounded-xl text-sm font-bold
                  border border-zinc-300 text-zinc-700 hover:bg-zinc-150 hover:border-zinc-450
                  transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer select-none
                "
              >
                <BsBuildingGear size={16} className="text-red-600" />
                Kurumsal / Toplu Teklif
              </button>
            </div>

            {/* Trust badges (mobil spacing iyileştirildi) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-zinc-250/70 mt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200/80 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <FiTruck className="text-red-600" size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-850">Aynı Gün Kargo</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5 leading-snug">
                    16:00&apos;ya kadar siparişler
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200/80 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <FiShield className="text-red-600" size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-855">Garantili Ürün</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5 leading-snug">
                    Faturalı &amp; kayıtlı tedarik
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200/80 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <FiPhoneCall className="text-red-600" size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-850">Teknik Destek</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5 leading-snug">
                    Araç uyumluluk teyidi
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
                h-72 sm:h-80 md:h-[420px] lg:h-[440px]
                rounded-3xl overflow-hidden
                bg-gradient-to-tr from-zinc-100 via-zinc-50 to-zinc-100
                border border-zinc-200 shadow-xl
              "
            >
              <Image
                src="https://images.pexels.com/photos/4489732/pexels-photo-4489732.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Oto yedek parça deposu"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                className="object-cover opacity-80"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-white via-white/40 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-3 text-xs">
                <div className="flex items-center justify-between font-semibold">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/90 border border-zinc-200 text-[11px] text-zinc-700 shadow-sm">
                    <MdOutlineTune className="mr-1.5 text-red-655" size={14} />
                    OEM Kodu ile Hızlı Arama
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    +10.000&apos;den fazla referans
                  </span>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1 rounded-xl bg-white/95 border border-zinc-200 p-3 shadow-md">
                    <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">Örnek arama:</p>
                    <p className="text-xs font-mono bg-zinc-150 text-zinc-800 rounded-lg mt-1.5 px-2.5 py-1.5 inline-block border border-zinc-250/60 font-semibold">
                      7701202057 &bull; RENAULT ÖN BALATA
                    </p>
                  </div>

                  <div className="w-28 rounded-xl bg-white/95 border border-zinc-200 p-2 flex flex-col justify-between text-[10px] shadow-md">
                    <p className="text-zinc-700 font-bold">Güvenli Ödeme</p>
                    <p className="text-zinc-550 leading-normal font-medium">
                      3D Secure <br /> &amp; SSL korumalı.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating stats (mobilde akıllı konum) */}
            <div
              className="
                mt-4 lg:mt-0
                lg:absolute lg:-bottom-5 lg:left-6 lg:right-6
                bg-white border border-zinc-200 rounded-2xl shadow-xl p-4 text-xs backdrop-blur-md bg-opacity-95 z-20
              "
            >
              <p className="font-bold text-zinc-900 mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                Türkiye genelinde binlerce müşteri
              </p>
              <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
                Hem bireysel kullanıcılar hem servisler için sürdürülebilir ve güvenilir tedarik ortağıyız.
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
      <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="flex items-end justify-between mb-8 border-b border-zinc-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-red-600 rounded-full" />
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-zinc-900 tracking-tight">
                Öne Çıkan Kategoriler
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                En çok sorulan ve en hızlı dönen ürün gruplarına hızlı erişim.
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push("/search")}
            className="hidden sm:inline-flex text-xs font-semibold text-zinc-550 hover:text-red-655 transition-colors cursor-pointer select-none"
          >
            Tüm ürünleri gör →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
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
              className="group bg-white border border-zinc-200 hover:border-red-500/50 hover:bg-red-50/10 transition-all duration-300 rounded-2xl px-4 py-5 flex flex-col items-start gap-1.5 text-left cursor-pointer shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-12 h-12 bg-red-500/5 rounded-full blur-xl pointer-events-none" />
              <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Kategori</span>
              <span className="text-sm font-semibold text-zinc-700 text-left line-clamp-2 leading-snug group-hover:text-red-650 transition-colors duration-200">
                {cat.label}
              </span>
              <span className="mt-1 text-[10px] text-zinc-500 group-hover:text-red-655 transition-colors font-medium">
                {cat.code ? "Ürünleri Gör →" : "Tüm Ürünler →"}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-6 pb-16 space-y-6">
        <div className="flex items-end justify-between border-b border-zinc-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-red-600 rounded-full" />
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-zinc-900 tracking-tight">
                Çok Satan Ürünler
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                Stok devir hızı yüksek, sık tercih edilen referanslar.
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push("/search?sort=best")}
            className="text-xs font-semibold text-zinc-500 hover:text-red-655 transition-colors cursor-pointer select-none"
          >
            Tüm çok satanları gör →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
      <section className="bg-white border-y border-zinc-200/80">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-10 md:py-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-4 text-left">
            <h3 className="text-lg font-bold text-zinc-900">
              Çalıştığımız Seçkin Markalar
            </h3>
            <p className="text-sm text-zinc-500 max-w-lg leading-relaxed font-medium">
              Orijinal ve kaliteli muadil markalarla çalışıyor, tedarik zincirimizi
              sürekli güncel tutuyoruz.
            </p>
            <div className="flex flex-wrap gap-2.5 mt-3">
              {["MGA", "EDGE", "ZEGEN", "RENAULT", "FİAT", "PEUGEOT"].map(
                (brand) => (
                  <span
                    key={brand}
                    className="px-4 py-1.5 rounded-xl border border-zinc-250 bg-zinc-100/50 text-xs text-zinc-700 font-semibold shadow-sm"
                  >
                    {brand}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-900 text-white rounded-2xl p-6 shadow-xl space-y-4 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 rounded-full blur-xl pointer-events-none" />
            <h3 className="text-sm font-bold flex items-center gap-2 text-white">
              <BsBuildingGear size={18} className="text-red-500" />
              Servisler &amp; Filolar için Çözümler
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Düzenli alım yapan servisler, filo şirketleri ve kurumsal müşteriler
              için özel fiyatlandırma, tahsisli temsilci ve stok planlama hizmeti
              sunuyoruz.
            </p>
            <button
              onClick={() => router.push("/kurumsal-teklif")}
              className="mt-1 w-full text-xs py-3 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-bold transition-all duration-300 cursor-pointer shadow-md select-none"
            >
              Kurumsal Teklif Formuna Git
            </button>
          </div>
        </div>
      </section>

      {/* FINAL INFO STRIP */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-sm">
            <h4 className="font-bold text-zinc-800 mb-2 text-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
              OEM Kodu ile Doğru Parça
            </h4>
            <p className="text-zinc-500 text-xs leading-relaxed font-medium">
              Ürün detay sayfalarımızda OEM kodu, barkod ve araç marka/model
              bilgisini şeffaf şekilde paylaşıyoruz. Giriş yaptığınızda daha detaylı
              teknik bilgilere erişebilirsiniz.
            </p>
          </div>

          <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-sm">
            <h4 className="font-bold text-zinc-800 mb-2 text-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
              Güvenli Ödeme ve İade
            </h4>
            <p className="text-zinc-500 text-xs leading-relaxed font-medium">
              3D Secure destekli ödeme altyapısı ile güvenli alışveriş, montajı
              yapılmamış ürünlerde 14 gün iade hakkı.
            </p>
          </div>

          <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-sm">
            <h4 className="font-bold text-zinc-800 mb-2 text-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
              Teknik Destek &amp; Danışmanlık
            </h4>
            <p className="text-zinc-500 text-xs leading-relaxed font-medium">
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
