"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "@/redux/store";
import { hydrateAuth, setUser } from "@/redux/slices/authSlice";
import { useGetUserProfileQuery } from "@/redux/api/userApi";
import type { User } from "@/types/user";

import { getGuestFavorites, clearGuestFavorites } from "@/utils/guestFavorites";
import {
  useAddFavoriteMutation,
  useGetFavoritesQuery,
} from "@/redux/api/favoritesApi";

export default function AuthBootstrap({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const { token, hydrated } = useSelector((state: RootState) => state.auth);

  // 1) localStorage -> redux hydrate
  useEffect(() => {
    if (hydrated) return;

    const storedToken =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    let storedUser: User | null = null;
    if (typeof window !== "undefined") {
      try {
        storedUser = JSON.parse(localStorage.getItem("user") || "null");
      } catch {
        storedUser = null;
      }
    }

    dispatch(
      hydrateAuth({
        token: storedToken,
        user:
          storedUser &&
          storedUser.email &&
          storedUser.firstName &&
          storedUser.lastName
            ? storedUser
            : null,
      })
    );
  }, [dispatch, hydrated]);

  // 2) profile -> redux user (backend: /auth/profile)
  const { data: profileData } = useGetUserProfileQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (!profileData) return;

    const normalizedUser: User = {
      id: profileData.id,
      role: profileData.role,
      email: profileData.email,
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      phoneNumber: profileData.phoneNumber ?? null,
    };

    if (!normalizedUser.email) return;
    dispatch(setUser(normalizedUser));
  }, [dispatch, profileData]);

  // 3) Favorites sync prompt
  const [showFavPrompt, setShowFavPrompt] = useState(false);
  const [guestFavIds, setGuestFavIds] = useState<string[]>([]);
  const [syncing, setSyncing] = useState(false);

  const { data: myFavorites } = useGetFavoritesQuery(undefined, {
    skip: !token,
  });

  const myFavoriteIds = useMemo(() => {
    return (myFavorites ?? []).map((f) => f.productId).filter(Boolean);
  }, [myFavorites]);

  const [addFavorite] = useAddFavoriteMutation();

  useEffect(() => {
    if (!token) return;

    const guest = getGuestFavorites();
    if (guest.length === 0) return;

    // login oldu ve guest favoriler var → kullanıcı seçsin
    setGuestFavIds(guest);
    setShowFavPrompt(true);
  }, [token]);

  const handleTransferFavorites = async () => {
    try {
      setSyncing(true);

      // DB'de olmayanları ekle
      const existing = new Set(myFavoriteIds);
      const toAdd = guestFavIds.filter((id) => !existing.has(id));

      for (const productId of toAdd) {
        await addFavorite({ productId }).unwrap();
      }

      clearGuestFavorites();
    } finally {
      setSyncing(false);
      setShowFavPrompt(false);
      setGuestFavIds([]);
    }
  };

  const handleDiscardFavorites = () => {
    clearGuestFavorites();
    setShowFavPrompt(false);
    setGuestFavIds([]);
  };

  if (!hydrated) return null;

  return (
    <>
      {/* Prompt UI (minimal) */}
      {showFavPrompt && (
        <div className="fixed inset-0 z-[999] bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-4 space-y-3">
            <h3 className="text-sm font-semibold">Favorileriniz Bulundu</h3>
            <p className="text-xs text-gray-600">
              Üye olmadan eklediğiniz {guestFavIds.length} ürünü hesabınıza
              aktarmak ister misiniz?
            </p>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                className="text-xs px-3 py-2 border rounded-md"
                onClick={handleDiscardFavorites}
                disabled={syncing}
              >
                Sil
              </button>
              <button
                type="button"
                className="text-xs px-3 py-2 bg-gray-900 text-white rounded-md disabled:opacity-60"
                onClick={handleTransferFavorites}
                disabled={syncing}
              >
                {syncing ? "Aktarılıyor..." : "Aktar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {children}
    </>
  );
}
