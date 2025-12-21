import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

export type FavoriteRow = {
  id: string;
  userId: string;
  productId: string;
  createdAt?: string;
  updatedAt?: string;
  Product?: {
    id: string;
    stockName1?: string;
    salesPrice1?: number;
    brand?: string;
    model?: string;
  };
};

export const favoritesApi = createApi({
  reducerPath: "favoritesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Favorites"],
  endpoints: (builder) => ({
    getFavorites: builder.query<FavoriteRow[], void>({
      query: () => "/favorites",
      transformResponse: (response: any) => {
        const data = response?.data ?? response;
        return Array.isArray(data) ? (data as FavoriteRow[]) : [];
      },
      providesTags: ["Favorites"],
    }),

    addFavorite: builder.mutation<void, { productId: string }>({
      query: ({ productId }) => ({
        url: "/favorites",
        method: "POST",
        body: { productId },
      }),
      invalidatesTags: ["Favorites"],
    }),

    removeFavorite: builder.mutation<void, { productId: string }>({
      query: ({ productId }) => ({
        url: `/favorites/${encodeURIComponent(productId)}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Favorites"],
    }),
  }),
});

export const {
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} = favoritesApi;
