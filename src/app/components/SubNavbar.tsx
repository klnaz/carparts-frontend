"use client";

import Link from "next/link";
import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import categoryData from "@/data/categoryData.json";

const SubNavbar = () => {
  const [showMega, setShowMega] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <>
      {/* DESKTOP NAV */}
      <div
        className="hidden md:flex flex-col bg-white border-t border-gray-200 relative"
        onMouseLeave={() => setShowMega(false)}
      >
        <div className="flex items-center justify-between px-6 py-3 text-sm font-medium">

          {/* CATEGORY BUTTON */}
          <div className="relative">
            <button
              onMouseEnter={() => setShowMega(true)}
              className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition-all shadow-sm"
            >
              <FiMenu size={18} />
              <span>Kategoriler</span>
            </button>

            {showMega && (
              <div className="absolute top-12 left-0 bg-white shadow-xl rounded-xl border border-gray-200 p-6 z-50 grid grid-cols-4 gap-8 animate-fadeIn w-[900px]">

                {categoryData.map((category) => (
                  <div key={category.name}>
                    <h3 className="font-bold text-gray-900 mb-3 text-[15px]">
                      {category.name}
                    </h3>

                    {category.subcategories.map((sub) => (
                      <div key={sub.name} className="mb-2">
                        <h4 className="font-semibold text-gray-700 text-sm mb-1">
                          {sub.name}
                        </h4>

                        <div className="flex flex-col gap-1">
                          {sub.items.map((item) => (
                            <Link
                              key={item}
                              href={`/products/${item.toLowerCase().replace(/ /g, "-")}`}
                              className="text-gray-600 hover:text-gray-900 transition text-sm"
                            >
                              {item}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* QUICK LINKS */}
          <div className="flex items-center gap-8 text-gray-700">
            <Link href="/cok-satanlar" className="hover:text-gray-900 transition">
              Çok Satanlar
            </Link>
            <Link href="/kampanyalar" className="hover:text-gray-900 transition">
              Kampanyalar
            </Link>
            <Link href="/yeni-urunler" className="hover:text-gray-900 transition">
              Yeni Ürünler
            </Link>
            <Link href="/bakim-seti" className="hover:text-gray-900 transition">
              Bakım Setleri
            </Link>
            <Link href="/yag-cesitleri" className="hover:text-gray-900 transition">
              Yağ Çeşitleri
            </Link>
            <Link href="/antifiriz" className="hover:text-gray-900 transition">
              Antifriz Çeşitleri
            </Link>
          </div>
        </div>
      </div>

      {/* MOBILE NAV */}
      <div className="flex md:hidden px-4 py-3 bg-white border-t border-gray-200 items-center justify-between">
        <FiMenu
          size={26}
          onClick={() => setMobileMenu(true)}
          className="text-gray-900"
        />
        <span className="font-semibold text-gray-900 text-lg">Kategoriler</span>
      </div>

      {/* MOBILE SLIDE MENU */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-xl transform transition-transform duration-300 ${
          mobileMenu ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-4 py-4 border-b">
          <span className="text-lg font-semibold">Kategoriler</span>
          <IoMdClose
            size={26}
            className="text-gray-900"
            onClick={() => setMobileMenu(false)}
          />
        </div>

        <div className="overflow-y-auto h-full p-4">

          {categoryData.map((category) => (
            <div key={category.name} className="mb-4">
              <h3 className="font-bold text-gray-900 mb-2">{category.name}</h3>

              {category.subcategories.map((sub) => (
                <div key={sub.name} className="mb-3">
                  <h4 className="font-semibold text-gray-700 text-sm mb-1">{sub.name}</h4>

                  {sub.items.map((item) => (
                    <Link
                      key={item}
                      href={`/products/${item.toLowerCase().replace(/ /g, "-")}`}
                      onClick={() => setMobileMenu(false)}
                      className="block text-gray-600 hover:text-gray-900 text-sm py-1"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ANIMATIONS */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
      `}</style>
    </>
  );
};

export default SubNavbar;
