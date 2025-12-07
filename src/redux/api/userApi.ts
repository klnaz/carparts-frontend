import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

// Frontend'te kullanacağımız normalize profil tipi
export interface ApiUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
}

// Backend'e UPDATE için gönderilecek payload (Joi şemasıyla uyumlu)
export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
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
    // PROFİL GETİR
    getUserProfile: builder.query<ApiUser, void>({
      query: () => "/",
      // Backend ne dönerse dönsün normalize et
      transformResponse: (response: any): ApiUser => {
        const raw = response?.user ?? response?.data ?? response;

        return {
          id: raw.id,
          email: raw.email ?? "",
          // Hem snake_case hem camelCase destekle
          first_name: raw.first_name ?? raw.firstName ?? "",
          last_name: raw.last_name ?? raw.lastName ?? "",
          phone:
            raw.phone ??
            raw.phoneNumber ??
            raw.phone_number ??
            "",
        };
      },
      providesTags: ["User"],
    }),

    // PROFİL GÜNCELLE (Joi: firstName, lastName, phoneNumber, email)
    updateUser: builder.mutation<ApiUser, UpdateUserPayload>({
      query: (body) => ({
        url: "/",
        method: "PUT",
        body, // id göndermiyoruz, userId token'dan geliyor
      }),
      invalidatesTags: ["User"],
    }),

    // ŞİFRE DEĞİŞTİR
    // Backend tarafında Joi şeması: { currentPassword, newPassword }
    changePassword: builder.mutation<
      void,
      { oldPassword: string; newPassword: string }
    >({
      query: ({ oldPassword, newPassword }) => ({
        url: "/password",
        method: "PUT",
        body: {
          currentPassword: oldPassword, // ❗ backend'in beklediği alan ismi
          newPassword,
        },
      }),
    }),

    // HESAP SİL
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
