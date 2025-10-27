"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { CgSearch } from "react-icons/cg";
import { HiOutlineShoppingBag, HiShoppingBag } from "react-icons/hi";
import { FiMenu, FiX } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaUser, FaRegUser } from "react-icons/fa"; // 👈 Font Awesome user ikonları (react-icons)
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [showCategories, setShowCategories] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (categoriesRef.current && !categoriesRef.current.contains(e.target as Node)) {
        setShowCategories(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full bg-white shadow-sm sticky top-0 z-50">
      {/* Üst Bar */}
      <div className="flex items-center justify-between py-4 px-4 md:px-6 font-medium">
        <Link href="/" className="text-2xl font-bold tracking-wider text-black">
          Ko<span className="text-red-600">parts</span>
        </Link>

        {/* Arama */}
        <div className="hidden md:flex items-center text-sm gap-2 border border-gray-300 bg-gray-100 px-4 rounded-lg flex-1 max-w-2xl mx-6">
          <CgSearch
            onClick={() => inputRef.current?.focus()}
            className="cursor-pointer text-gray-500"
            size={20}
          />
          <input
            ref={inputRef}
            className="py-2 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Parça, oem numara veya marka ara"
          />
        </div>

        {/* Sağ ikonlar */}
        <div className="hidden md:flex items-center gap-4 md:gap-6">
          {/* Hesap */}
          <button
            onClick={() => router.push(token ? "/hesabim" : "/signin")}
            className="group flex items-center gap-2 text-red-600 hover:text-black transition"
          >
            {/* Hover geçişli kullanıcı ikonu */}
            <span className="relative w-[18px] h-[18px] flex items-center justify-center">
              <FaRegUser
                size={18}
                className="absolute text-red-600 transition-opacity duration-200 group-hover:opacity-0"
              />
              <FaUser
                size={18}
                className="absolute text-red-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              />
            </span>
            {token ? "Hesabım" : "Giriş Yap"}
          </button>

          {/* Favoriler */}
          <Link
            href="/favorilerim"
            className="group flex items-center gap-2 text-gray-700 hover:text-red-600 transition"
          >
            <AiOutlineHeart
              size={22}
              className="text-red-600 group-hover:hidden transition"
            />
            <AiFillHeart
              size={22}
              className="text-red-600 hidden group-hover:block transition"
            />
            <span className="font-medium">Favoriler</span>
          </Link>

          {/* Sepet */}
          <Link
            href="/sepetim"
            className="group flex items-center gap-2 text-gray-700 hover:text-red-600 transition"
          >
            <HiOutlineShoppingBag
              size={22}
              className="text-red-600 group-hover:hidden transition"
            />
            <HiShoppingBag
              size={22}
              className="text-red-600 hidden group-hover:block transition"
            />
            <span className="font-medium">Sepetim</span>
          </Link>
        </div>

        {/* Mobil Hamburger */}
        <button
          className="md:hidden text-red-600"
          onClick={() => setMobileMenuOpen(true)}
        >
          <FiMenu size={26} />
        </button>
      </div>

      {/* Alt Bar - Kategoriler */}
      <div className="hidden md:flex flex-col bg-white border-t border-gray-200">
        <div className="flex items-center justify-between px-6 py-3 text-sm font-medium">
          <div className="relative" ref={categoriesRef}>
            <button
              onClick={() => setShowCategories(!showCategories)}
              className="flex items-center gap-2 text-white bg-red-600 px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
              <FiMenu size={18} />
              <span>Kategoriler</span>
            </button>

            {showCategories && (
              <div className="absolute top-12 left-0 bg-white text-black shadow-lg rounded-md w-60 z-50 border border-gray-200">
                {[
                  "Motor Parçaları",
                  "Fren Sistemleri",
                  "Elektrik & Aydınlatma",
                  "Aksesuarlar",
                  "Diğer Parçalar",
                ].map((item) => (
                  <div
                    key={item}
                    className="category-item flex items-center justify-between px-4 py-2 border-b cursor-pointer hover:bg-gray-100"
                  >
                    {item} <IoIosArrowForward />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hızlı Kategoriler */}
          <div className="flex items-center gap-6 text-gray-700">
            <Link href="/cok-satanlar" className="hover:text-red-600">
              Çok Satanlar
            </Link>
            <Link href="/kampanyalar" className="hover:text-red-600">
              Kampanyalar
            </Link>
            <Link href="/yeni-urunler" className="hover:text-red-600">
              Yeni Ürünler
            </Link>
            <Link href="/bakim-seti" className="hover:text-red-600">
              Bakım Setleri
            </Link>
            <Link href="/yag-cesitleri" className="hover:text-red-600">
              Yağ Çeşitleri
            </Link>
            <Link href="/antifiriz" className="hover:text-red-600">
              Antifriz Çeşitleri
            </Link>
          </div>
        </div>
      </div>

      {/* Mobil Menü Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-gray-200 bg-opacity-70"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 bg-white h-full p-5 flex flex-col z-50 shadow-xl">
            <button
              className="self-end mb-4 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiX size={26} />
            </button>

            {/* Arama */}
            <div className="flex items-center text-sm gap-2 border border-gray-300 bg-gray-100 px-3 rounded-lg mb-4">
              <CgSearch size={20} className="text-gray-500" />
              <input
                ref={inputRef}
                className="py-2 w-full bg-transparent outline-none placeholder-gray-500"
                type="text"
                placeholder="Parça, oem numara veya marka ara"
              />
            </div>

            <p className="font-semibold text-red-600 mb-2">Kategoriler</p>
            <div className="flex flex-col gap-2 mb-4">
              {[
                "Motor Parçaları",
                "Fren Sistemleri",
                "Elektrik & Aydınlatma",
                "Aksesuarlar",
                "Diğer Parçalar",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between px-3 py-2 border-b cursor-pointer hover:bg-gray-100"
                >
                  {item} <IoIosArrowForward />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
