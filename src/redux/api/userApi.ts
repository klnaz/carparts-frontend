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

  // DB / bazı cevaplar snake_case dönebilir
  first_name?: string;
  last_name?: string;

  // bazı yerlerde camelCase dönebilir
  firstName?: string;
  lastName?: string;

  phone?: string | null;
  phoneNumber?: string | null;
  phone_number?: string | null;

  role?: string;
};

function pickUser(response: any): RawUserLike {
  return (response?.user ?? response?.data ?? response) as RawUserLike;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/users`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    /**
     * ✅ PROFİL GETİR
     * Backend route: GET /auth/profile
     * Not: baseUrl /users olduğu için full URL kullanıyoruz.
     */
    getUserProfile: builder.query<ApiUser, void>({
      query: () => ({
        url: `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
        method: "GET",
      }),
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

    /**
     * PROFİL GÜNCELLE
     * Backend: PUT /users/
     */
    updateUser: builder.mutation<ApiUser, UpdateUserPayload>({
      query: (body) => ({
        url: "/",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    /**
     * ŞİFRE DEĞİŞTİR
     * Backend: PUT /users/password
     */
    changePassword: builder.mutation<
      void,
      { oldPassword: string; newPassword: string }
    >({
      query: ({ oldPassword, newPassword }) => ({
        url: "/password",
        method: "PUT",
        body: {
          currentPassword: oldPassword,
          newPassword,
        },
      }),
    }),

    /**
     * HESAP SİL
     * Backend: DELETE /users/
     */
    deleteUser: builder.mutation<void, void>({
      query: () => ({
        url: "/",
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
