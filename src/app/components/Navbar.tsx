"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { RootState } from "@/redux/store";
import { CgSearch } from "react-icons/cg";
import { HiOutlineShoppingBag, HiShoppingBag } from "react-icons/hi";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaUser, FaRegUser } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoverAccount, setHoverAccount] = useState(false);

  // ⭐ Sepette kaç FARKLI ürün var? (cart.items.length)
  const cartCount = useSelector(
    (state: RootState) => state.cart?.items?.length ?? 0
  );

  return (
    <div className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between py-4 px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="text-3xl font-bold tracking-wider text-black">
          Ko<span className="text-red-600">parts</span>
        </Link>

        {/* Search */}
        <div className="hidden md:flex items-center text-sm gap-2 border border-gray-300 bg-gray-100 px-4 rounded-xl flex-1 max-w-2xl mx-6">
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

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-6">
          {/* HOVER HESAP DROPDOWN */}
          <div
            className="relative"
            onMouseEnter={() => setHoverAccount(true)}
            onMouseLeave={() => setHoverAccount(false)}
          >
            {/* HESAP BUTONU */}
            <button className="group flex items-center gap-2 text-red-600 hover:text-black transition">
              <span className="relative w-[20px] h-[20px] flex items-center justify-center">
                <FaRegUser
                  size={20}
                  className="absolute text-red-600 transition-opacity group-hover:opacity-0"
                />
                <FaUser
                  size={20}
                  className="absolute text-red-600 opacity-0 transition-opacity group-hover:opacity-100"
                />
              </span>
              {token ? "Hesabım" : "Giriş Yap"}
            </button>

            {/* DROPDOWN — BUTONA TAM YAPIŞIK */}
            {hoverAccount && (
              <div className="absolute right-0 top-full mt-0 w-48 bg-white shadow-lg border rounded-lg py-2 z-50">
                {token ? (
                  <>
                    <button
                      onClick={() => router.push("/hesabim")}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Hesabım
                    </button>
                    <button
                      onClick={() => router.push("/siparislerim")}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Siparişlerim
                    </button>
                    <button
                      onClick={() => {
                        dispatch(logout());
                        router.push("/signin");
                      }}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Çıkış Yap
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => router.push("/signin")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Giriş Yap
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Favoriler */}
          <Link
            href="/favorilerim"
            className="group flex items-center gap-2 text-gray-700 hover:text-red-600 transition"
          >
            <AiOutlineHeart
              size={22}
              className="text-red-600 group-hover:hidden"
            />
            <AiFillHeart
              size={22}
              className="text-red-600 hidden group-hover:block"
            />
            Favoriler
          </Link>

          {/* Sepet */}
          <Link
            href="/sepetim"
            className="group relative flex items-center gap-2 text-gray-700 hover:text-red-600 transition"
          >
            <HiOutlineShoppingBag
              size={22}
              className="text-red-600 group-hover:hidden"
            />
            <HiShoppingBag
              size={22}
              className="text-red-600 hidden group-hover:block"
            />
            <span>Sepetim</span>

            {/* 🔴 Sepette kaç farklı ürün varsa badge */}
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-[10px] px-2 py-[2px] rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden text-red-600"
          onClick={() => setMobileMenuOpen(true)}
        >
          <FiMenu size={26} />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-gray-200 bg-opacity-60"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 bg-white h-full p-5 flex flex-col shadow-xl z-50">
            <button
              className="self-end mb-4 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiX size={26} />
            </button>

            <div className="flex items-center text-sm gap-2 border border-gray-300 bg-gray-100 px-3 rounded-lg mb-4">
              <CgSearch size={20} className="text-gray-500" />
              <input
                className="py-2 w-full bg-transparent outline-none"
                type="text"
                placeholder="Parça, oem numara veya marka ara"
              />
            </div>

            <Link href="/favorilerim" className="py-2 border-b">
              Favorilerim
            </Link>
            <Link href="/sepetim" className="py-2 border-b flex items-center justify-between">
              <span>Sepetim</span>
              {cartCount > 0 && (
                <span className="inline-flex items-center justify-center bg-red-600 text-white text-[10px] px-2 py-[2px] rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {token ? (
              <>
                <Link href="/hesabim" className="py-2 border-b">
                  Hesabım
                </Link>
                <Link href="/siparislerim" className="py-2 border-b">
                  Siparişlerim
                </Link>
                <button
                  onClick={() => {
                    dispatch(logout());
                    setMobileMenuOpen(false);
                    router.push("/signin");
                  }}
                  className="text-left py-2 text-red-600"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <Link href="/signin" className="py-2 border-b">
                Giriş Yap
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
