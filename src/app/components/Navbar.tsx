"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import type { RootState } from "@/redux/store";
import { CgSearch } from "react-icons/cg";
import { HiOutlineShoppingBag, HiShoppingBag } from "react-icons/hi";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaUser, FaRegUser } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useGetUserProfileQuery } from "@/redux/api/userApi";

const Navbar = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  // Hydration fix: server ve client ilk render aynı olsun
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { token } = useSelector((state: RootState) => state.auth);

  const cartCount = useSelector(
    (state: RootState) => state.cart?.items?.length ?? 0
  );

  // Login ise profil isteği
  const { data: profileData } = useGetUserProfileQuery(undefined, {
    skip: !token,
  });

  const fullName = profileData
    ? `${profileData.firstName ?? ""} ${profileData.firstName?? ""}`.trim()
    : "";

  const inputRef = useRef<HTMLInputElement>(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hesap dropdown state
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Arama state
  const [searchTerm, setSearchTerm] = useState("");

  const handleAccountMouseEnter = () => {
    if (accountCloseTimer.current) {
      clearTimeout(accountCloseTimer.current);
      accountCloseTimer.current = null;
    }
    setIsAccountOpen(true);
  };

  const handleAccountMouseLeave = () => {
    accountCloseTimer.current = setTimeout(() => {
      setIsAccountOpen(false);
    }, 150);
  };

  const handleSearchSubmit = () => {
    const q = searchTerm.trim();
    if (!q) return;
    router.push(`/arama?q=${encodeURIComponent(q)}`);
    setMobileMenuOpen(false);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchSubmit();
    }
  };

  return (
    <div className="w-full bg-white/95 border-b border-zinc-200/85 backdrop-blur-md sticky top-0 z-50 text-zinc-800 transition-all duration-300 shadow-sm">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between py-4 px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="text-3xl font-extrabold tracking-wider text-zinc-900">
          Ko<span className="text-red-600 drop-shadow-[0_2px_8px_rgba(220,38,38,0.15)]">parts</span>
        </Link>

        {/* Search - Desktop */}
        <div className="hidden md:flex items-center text-sm gap-2 border border-zinc-200 bg-zinc-100/60 hover:bg-zinc-100/90 focus-within:bg-white focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-200 px-4 rounded-xl flex-1 max-w-2xl mx-6 transition-all duration-300 shadow-inner">
          <CgSearch
            onClick={handleSearchSubmit}
            className="cursor-pointer text-zinc-400 hover:text-red-600 transition-colors"
            size={20}
          />
          <input
            ref={inputRef}
            className="py-2.5 w-full bg-transparent outline-none placeholder-zinc-400 text-zinc-800 text-sm font-medium"
            type="text"
            placeholder="Parça, OEM numara veya marka ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-6">
          {/* ACCOUNT */}
          <div
            className="relative"
            onMouseEnter={handleAccountMouseEnter}
            onMouseLeave={handleAccountMouseLeave}
          >
            <button className="group flex items-center gap-2 text-zinc-650 hover:text-red-650 transition-colors cursor-pointer select-none">
              {/* Icon */}
              <span className="relative w-[20px] h-[20px] flex items-center justify-center">
                <FaRegUser
                  size={19}
                  className="absolute text-zinc-450 transition-opacity group-hover:opacity-0"
                />
                <FaUser
                  size={19}
                  className="absolute text-red-600 opacity-0 transition-opacity group-hover:opacity-100"
                />
              </span>

              {/* Metin bloğu */}
              <span className="flex flex-col items-start leading-tight">
                <span className="text-xs font-semibold">Hesabım</span>

                {/* Hydration safe: sadece mounted olduktan sonra koşullu render */}
                {mounted && (
                  <>
                    {token ? (
                      fullName ? (
                        <span className="text-[10px] text-zinc-450 max-w-[100px] truncate font-medium">
                          {fullName}
                        </span>
                      ) : null
                    ) : (
                      <span className="text-[10px] text-zinc-450 font-medium">
                        Giriş yap
                      </span>
                    )}
                  </>
                )}
              </span>
            </button>

            {/* Dropdown */}
            {isAccountOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-zinc-200/90 shadow-2xl rounded-xl py-2 z-50 text-zinc-700">
                {token ? (
                  <>
                    <button
                      onClick={() => router.push("/hesabim")}
                      className="block w-full text-left px-4 py-2 hover:bg-zinc-50 hover:text-zinc-900 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Hesabım
                    </button>
                    <button
                      onClick={() => router.push("/siparislerim")}
                      className="block w-full text-left px-4 py-2 hover:bg-zinc-50 hover:text-zinc-900 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Siparişlerim
                    </button>
                    <button
                      onClick={() => {
                        dispatch(logout());
                        router.push("/signin");
                      }}
                      className="block w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 hover:text-red-700 text-xs font-bold transition-colors border-t border-zinc-100 mt-1.5 pt-2.5"
                    >
                      Çıkış Yap
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => router.push("/signin")}
                    className="block w-full text-left px-4 py-2 hover:bg-zinc-50 hover:text-zinc-900 text-xs font-semibold transition-colors cursor-pointer"
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
            className="group flex items-center gap-2 text-zinc-650 hover:text-red-600 transition-colors"
          >
            <span className="relative w-[22px] h-[22px] flex items-center justify-center">
              <AiOutlineHeart
                size={22}
                className="absolute text-zinc-450 transition-opacity group-hover:opacity-0"
              />
              <AiFillHeart
                size={22}
                className="absolute text-red-600 opacity-0 transition-opacity group-hover:opacity-100"
              />
            </span>
            <span className="text-xs font-semibold">Favoriler</span>
          </Link>

          {/* Sepet */}
          <Link
            href="/sepetim"
            className="group relative flex items-center gap-2 text-zinc-650 hover:text-red-600 transition-colors"
          >
            <span className="relative w-[22px] h-[22px] flex items-center justify-center">
              <HiOutlineShoppingBag
                size={22}
                className="absolute text-zinc-450 transition-opacity group-hover:opacity-0"
              />
              <HiShoppingBag
                size={22}
                className="absolute text-red-600 opacity-0 transition-opacity group-hover:opacity-100"
              />
            </span>
            <span className="text-xs font-semibold">Sepetim</span>

            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center font-bold shadow-[0_2px_6px_rgba(220,38,38,0.4)]">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden text-zinc-600 hover:text-red-650 transition-colors"
          onClick={() => setMobileMenuOpen(true)}
        >
          <FiMenu size={26} />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-72 bg-white border-r border-zinc-200 h-full p-5 flex flex-col shadow-2xl z-50 text-zinc-700">
            <button
              className="self-end mb-6 text-zinc-400 hover:text-red-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiX size={26} />
            </button>

            {/* Search Mobile */}
            <div className="flex items-center text-sm gap-2 border border-zinc-200 bg-zinc-100 px-3 rounded-xl mb-6 focus-within:border-red-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-red-200">
              <CgSearch
                size={20}
                className="text-zinc-450 cursor-pointer hover:text-red-600"
                onClick={handleSearchSubmit}
              />
              <input
                className="py-2.5 w-full bg-transparent outline-none text-zinc-800 placeholder-zinc-400 font-semibold text-sm"
                type="text"
                placeholder="Parça, OEM numara ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
            </div>

            <Link
              href="/favorilerim"
              className="py-3 border-b border-zinc-100 text-sm font-semibold hover:text-red-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Favorilerim
            </Link>

            <Link
              href="/sepetim"
              className="py-3 border-b border-zinc-100 text-sm font-semibold flex items-center justify-between hover:text-red-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Sepetim</span>
              {cartCount > 0 && (
                <span className="inline-flex items-center justify-center bg-red-600 text-white text-[10px] px-2 py-[2px] rounded-full font-bold shadow-[0_2px_6px_rgba(220,38,38,0.3)]">
                  {cartCount}
                </span>
              )}
            </Link>

            {token ? (
              <>
                <Link
                  href="/hesabim"
                  className="py-3 border-b border-zinc-100 text-sm font-semibold hover:text-red-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Hesabım
                </Link>
                <Link
                  href="/siparislerim"
                  className="py-3 border-b border-zinc-100 text-sm font-semibold hover:text-red-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Siparişlerim
                </Link>
                <button
                  onClick={() => {
                    dispatch(logout());
                    setMobileMenuOpen(false);
                    router.push("/signin");
                  }}
                  className="text-left py-4 text-red-600 font-bold text-sm hover:text-red-500 transition-colors"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <Link
                href="/signin"
                className="py-3 border-b border-zinc-100 text-sm font-semibold hover:text-red-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
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
