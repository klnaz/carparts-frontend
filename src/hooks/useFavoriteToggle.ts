"use client";

import { useMemo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import {
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
  useGetFavoritesQuery,
} from "@/redux/api/favoritesApi";
import {
  addGuestFavorite,
  removeGuestFavorite,
  getGuestFavorites,
} from "@/utils/guestFavorites";

export function useFavoriteToggle(productId: string) {
  const { token } = useSelector((s: RootState) => s.auth);

  const { data: favorites } = useGetFavoritesQuery(undefined, { skip: !token });
  const [addFav] = useAddFavoriteMutation();
  const [removeFav] = useRemoveFavoriteMutation();

  const isFav = useMemo(() => {
    if (!productId) return false;

    if (!token) {
      return getGuestFavorites().includes(productId);
    }

    const ids = (favorites ?? []).map((f) => f.productId);
    return ids.includes(productId);
  }, [token, favorites, productId]);

  const toggle = async () => {
    if (!productId) return;

    if (!token) {
      if (isFav) removeGuestFavorite(productId);
      else addGuestFavorite(productId);
      return;
    }

    if (isFav) {
      await removeFav({ productId }).unwrap();
    } else {
      await addFav({ productId }).unwrap();
    }
  };

  return { isFav, toggle };
}
