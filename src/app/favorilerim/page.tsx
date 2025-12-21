"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import type { RootState } from "@/redux/store";
import {
  useGetFavoritesQuery,
  useRemoveFavoriteMutation,
  type FavoriteRow,
} from "@/redux/api/favoritesApi";
import {
  getGuestFavorites,
  removeGuestFavorite,
  clearGuestFavorites,
} from "@/utils/guestFavorites";

function formatTRY(value?: number) {
  if (typeof value !== "number") return "-";
  try {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value} ₺`;
  }
}

export default function FavoritesPage() {
  const { token } = useSelector((s: RootState) => s.auth);

  // ✅ Hydration-safe guest favorites
  const [mounted, setMounted] = useState(false);
  const [guestIds, setGuestIds] = useState<string[]>([]);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (token) return; // girişliyse guest göstermeye gerek yok
    setGuestIds(getGuestFavorites());
  }, [mounted, token]);

  // ✅ Logged-in favorites
  const {
    data: favorites = [],
    isLoading,
    isError,
    refetch,
  } = useGetFavoritesQuery(undefined, { skip: !token });

  const [removeFavorite, { isLoading: removing }] = useRemoveFavoriteMutation();

  const headerCount = token ? favorites.length : guestIds.length;

  const sortedFavorites = useMemo(() => {
    // backend zaten createdAt DESC yolluyor ama yine de güvenli
    return [...favorites].sort((a, b) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return db - da;
    });
  }, [favorites]);

  const handleRemoveLoggedIn = async (productId: string) => {
    await removeFavorite({ productId }).unwrap();
  };

  const handleRemoveGuest = (productId: string) => {
    removeGuestFavorite(productId);
    setGuestIds(getGuestFavorites());
  };

  const handleClearGuest = () => {
    clearGuestFavorites();
    setGuestIds([]);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-gray-900">Favorilerim</h1>
          <p className="text-sm text-gray-500">
            {headerCount} ürün favorilerinizde.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!token ? (
            <Link
              href="/signin"
              className="text-xs px-3 py-2 rounded-md bg-gray-900 text-white hover:opacity-90"
            >
              Giriş Yap
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => refetch()}
              className="text-xs px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
            >
              Yenile
            </button>
          )}
        </div>
      </div>

      {/* Guest notice */}
      {!token && mounted && (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm mb-4">
          <p className="text-xs text-gray-700">
            Üye olmadan eklediğiniz favoriler bu cihazda tutulur. Giriş yaptığınızda
            isterseniz hesabınıza aktarabilirsiniz.
          </p>

          {guestIds.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Link
                href="/signin"
                className="text-xs px-3 py-2 rounded-md bg-red-600 text-white hover:opacity-90"
              >
                Giriş yap ve aktar
              </Link>
              <button
                type="button"
                onClick={handleClearGuest}
                className="text-xs px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
              >
                Hepsini Sil
              </button>
            </div>
          )}
        </div>
      )}

      {/* States */}
      {token && isLoading && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm text-sm text-gray-600">
          Favoriler yükleniyor...
        </div>
      )}

      {token && isError && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <p className="text-sm text-red-600">Favoriler alınamadı.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 text-xs px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
          >
            Tekrar dene
          </button>
        </div>
      )}

      {/* Empty */}
      {token && !isLoading && !isError && sortedFavorites.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm text-center">
          <p className="text-sm text-gray-700">
            Henüz favorilere eklediğiniz ürün yok.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Ürün kartlarında kalp ikonuna tıklayarak favorilerinize ekleyebilirsiniz.
          </p>
          <div className="mt-4">
            <Link
              href="/"
              className="inline-flex text-xs px-3 py-2 rounded-md bg-gray-900 text-white hover:opacity-90"
            >
              Alışverişe Başla
            </Link>
          </div>
        </div>
      )}

      {!token && mounted && guestIds.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm text-center">
          <p className="text-sm text-gray-700">
            Bu cihazda kayıtlı favoriniz yok.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Ürün kartlarında kalp ikonuna tıklayarak favorilerinize ekleyebilirsiniz.
          </p>
        </div>
      )}

      {/* Logged-in list */}
      {token && !isLoading && !isError && sortedFavorites.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-3 sm:p-4 lg:p-5 shadow-sm">
          <div className="grid gap-4 sm:gap-5 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedFavorites.map((fav) => (
              <FavoriteCard
                key={fav.id}
                fav={fav}
                onRemove={() => handleRemoveLoggedIn(fav.productId)}
                removing={removing}
              />
            ))}
          </div>
        </div>
      )}

      {/* Guest list (ID-based) */}
      {!token && mounted && guestIds.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-3 sm:p-4 lg:p-5 shadow-sm">
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {guestIds.map((id) => (
              <div
                key={id}
                className="border border-gray-200 rounded-xl p-4 flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Ürün ID</p>
                  <p className="text-sm font-medium text-gray-900 break-all">
                    {id}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Detayları görmek için giriş yapmanız gerekebilir.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveGuest(id)}
                  className="shrink-0 text-xs px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
                >
                  Kaldır
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FavoriteCard({
  fav,
  onRemove,
  removing,
}: {
  fav: FavoriteRow;
  onRemove: () => void;
  removing: boolean;
}) {
  const p = fav.Product;

  const title =
    p?.stockName1 ||
    (p?.brand || p?.model ? `${p?.brand ?? ""} ${p?.model ?? ""}`.trim() : "") ||
    "Ürün";

  const price = typeof p?.salesPrice1 === "number" ? p.salesPrice1 : undefined;

  return (
    <div className="border border-gray-200 rounded-2xl p-4 hover:shadow-sm transition flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] text-gray-500">Favori Ürün</p>
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {title}
          </h3>

          <div className="mt-2 space-y-1">
            <p className="text-xs text-gray-600">
              <span className="text-gray-500">Fiyat:</span>{" "}
              <span className="font-medium">{formatTRY(price)}</span>
            </p>

            {(p?.brand || p?.model) && (
              <p className="text-xs text-gray-600">
                <span className="text-gray-500">Marka/Model:</span>{" "}
                {(p?.brand ?? "-") + " / " + (p?.model ?? "-")}
              </p>
            )}

            <p className="text-[11px] text-gray-500 break-all">
              <span className="text-gray-400">Ürün ID:</span> {fav.productId}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        {/* Ürün detay route'un sende /products/:id ise burayı aç. Değilse kaldır. */}
        <Link
          href={`/products/${encodeURIComponent(fav.productId)}`}
          className="text-xs px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
        >
          Ürüne Git
        </Link>

        <button
          type="button"
          onClick={onRemove}
          disabled={removing}
          className="text-xs px-3 py-2 rounded-md bg-red-600 text-white hover:opacity-90 disabled:opacity-60"
        >
          Kaldır
        </button>
      </div>
    </div>
  );
}
