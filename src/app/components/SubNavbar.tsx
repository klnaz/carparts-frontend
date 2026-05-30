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
        className="hidden md:flex flex-col bg-white border-t border-b border-zinc-200/80 relative shadow-sm"
        onMouseLeave={() => setShowMega(false)}
      >
        <div className="flex items-center justify-between px-6 py-3 text-sm font-medium">

          {/* CATEGORY BUTTON */}
          <div className="relative">
            <button
              onMouseEnter={() => setShowMega(true)}
              className="flex items-center gap-2.5 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl transition-all shadow-md shadow-red-200 cursor-pointer font-semibold"
            >
              <FiMenu size={18} />
              <span>Kategoriler</span>
            </button>

            {showMega && (
              <div className="absolute top-12 left-0 bg-white border border-zinc-200/80 shadow-2xl rounded-2xl p-6 z-50 grid grid-cols-4 gap-8 animate-fadeIn w-[950px] text-zinc-800">

                {categoryData.map((category) => (
                  <div key={category.name} className="space-y-4">
                    <h3 className="font-bold text-red-600 text-[14px] border-b border-zinc-100 pb-1.5 uppercase tracking-wider">
                      {category.name}
                    </h3>

                    {category.subcategories.map((sub) => (
                      <div key={sub.name} className="space-y-1.5">
                        <h4 className="font-semibold text-zinc-800 text-xs">
                          {sub.name}
                        </h4>

                        <div className="flex flex-col gap-1 pl-2">
                          {sub.items.map((item) => (
                            <Link
                              key={item}
                              href={`/products/${item.toLowerCase().replace(/ /g, "-")}`}
                              className="text-zinc-500 hover:text-red-650 transition-colors text-xs py-0.5 font-medium"
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
          <div className="flex items-center gap-8 text-zinc-600 font-semibold">
            <Link href="/cok-satanlar" className="hover:text-red-650 transition-colors text-xs">
              Çok Satanlar
            </Link>
            <Link href="/kampanyalar" className="hover:text-red-650 transition-colors text-xs">
              Kampanyalar
            </Link>
            <Link href="/yeni-urunler" className="hover:text-red-650 transition-colors text-xs">
              Yeni Ürünler
            </Link>
            <Link href="/bakim-seti" className="hover:text-red-650 transition-colors text-xs">
              Bakım Setleri
            </Link>
            <Link href="/yag-cesitleri" className="hover:text-red-650 transition-colors text-xs">
              Yağ Çeşitleri
            </Link>
            <Link href="/antifiriz" className="hover:text-red-650 transition-colors text-xs">
              Antifriz Çeşitleri
            </Link>
          </div>
        </div>
      </div>

      {/* MOBILE NAV */}
      <div className="flex md:hidden px-4 py-3 bg-white border-t border-zinc-200 items-center justify-between text-zinc-800 shadow-sm">
        <FiMenu
          size={26}
          onClick={() => setMobileMenu(true)}
          className="text-zinc-650 hover:text-red-600 cursor-pointer"
        />
        <span className="font-bold text-zinc-700 text-md tracking-wider">KATEGORİLER</span>
      </div>

      {/* MOBILE SLIDE MENU */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-zinc-200 z-50 shadow-2xl transform transition-transform duration-300 ${
          mobileMenu ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-4 py-4 border-b border-zinc-100">
          <span className="text-md font-bold text-zinc-800 uppercase tracking-wide">Kategoriler</span>
          <IoMdClose
            size={26}
            className="text-zinc-400 hover:text-red-600 cursor-pointer"
            onClick={() => setMobileMenu(false)}
          />
        </div>

        <div className="overflow-y-auto h-[calc(100%-80px)] p-4 space-y-4">
          {categoryData.map((category) => (
            <div key={category.name} className="space-y-3">
              <h3 className="font-bold text-red-600 text-sm border-b border-zinc-100 pb-1">{category.name}</h3>

              {category.subcategories.map((sub) => (
                <div key={sub.name} className="space-y-1.5 pl-1.5">
                  <h4 className="font-semibold text-zinc-800 text-xs">{sub.name}</h4>

                  <div className="flex flex-col gap-1 pl-2 border-l border-zinc-100">
                    {sub.items.map((item) => (
                      <Link
                        key={item}
                        href={`/products/${item.toLowerCase().replace(/ /g, "-")}`}
                        onClick={() => setMobileMenu(false)}
                        className="block text-zinc-500 hover:text-red-650 text-xs py-1 transition-colors font-medium"
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
