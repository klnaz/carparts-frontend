import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

// Backend'den gelen profilin normalize edilmiş tipi
export interface ApiUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
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
      query: () => "/", // GET /users/
      // ❗ Backend ne dönerse dönsün, burada tek formata çeviriyoruz
      transformResponse: (response: any): ApiUser => {
        // Bazı backend’ler { user: {...} } veya { data: {...} } döner
        const raw = response?.user ?? response?.data ?? response;

        return {
          id: raw.id,
          email: raw.email ?? "",
          first_name: raw.first_name ?? raw.name ?? "",
          last_name: raw.last_name ?? raw.surname ?? "",
          phone: raw.phone ?? raw.phone_number ?? "",
        };
      },
      providesTags: ["User"],
    }),

    // PROFİL GÜNCELLE
    updateUser: builder.mutation<ApiUser, Partial<ApiUser>>({
      query: (body) => ({
        url: "/", // PUT /users/
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"], // ✅ update sonrası profil query'sini yeniden çeker
    }),

    // ŞİFRE DEĞİŞTİR
    changePassword: builder.mutation<
      void,
      { oldPassword: string; newPassword: string }
    >({
      query: (body) => ({
        url: "/password",
        method: "PUT",
        body,
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
