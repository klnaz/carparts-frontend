import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

// Frontend standardı: camelCase
export interface ApiUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  role?: string;
}

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
}

type RawUserLike = {
  id?: string;
  email?: string;

  // backend farklı yazabilir
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;

  phoneNumber?: string | null;
  phone_number?: string | null;
  phone?: string | null;

  role?: string;
};

function pickUser(response: any): RawUserLike {
  // /auth/profile -> { user: {...} }
  // bazı yerlerde { data: {...} } ya da direkt {...}
  return (response?.user ?? response?.data ?? response) as RawUserLike;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // ✅ PROFİL GETİR: /auth/profile
    getUserProfile: builder.query<ApiUser, void>({
      query: () => "/auth/profile",
      transformResponse: (response: any): ApiUser => {
        const raw = pickUser(response);

        const firstName = (raw.firstName ?? raw.first_name ?? "").trim();
        const lastName = (raw.lastName ?? raw.last_name ?? "").trim();

        const phone =
          raw.phoneNumber ?? raw.phone ?? raw.phone_number ?? null;

        return {
          id: raw.id ?? "",
          email: raw.email ?? "",
          firstName,
          lastName,
          phoneNumber: phone ? String(phone) : null,
          role: raw.role,
        };
      },
      providesTags: ["User"],
    }),

    // PROFİL GÜNCELLE: /users
    updateUser: builder.mutation<ApiUser, UpdateUserPayload>({
      query: (body) => ({
        url: "/users",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // ŞİFRE DEĞİŞTİR: /users/password
    changePassword: builder.mutation<
      void,
      { oldPassword: string; newPassword: string }
    >({
      query: ({ oldPassword, newPassword }) => ({
        url: "/users/password",
        method: "PUT",
        body: {
          currentPassword: oldPassword,
          newPassword,
        },
      }),
    }),

    // HESAP SİL: /users
    deleteUser: builder.mutation<void, void>({
      query: () => ({
        url: "/users",
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateUserMutation,
  useChangePasswordMutation,
  useDeleteUserMutation,
} = userApi;
