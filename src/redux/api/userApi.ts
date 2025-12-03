import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

// Frontend'te kullanacağımız normalize edilmiş tip
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
      transformResponse: (response: any): ApiUser => {
        // Backend genelde: { success, message, data }
        const raw = response?.data ?? response?.user ?? response;

        return {
          id: raw.id,
          email: raw.email ?? "",
          // ⭐ Burada camelCase'den snake_case'e map yapıyoruz
          first_name:
            raw.first_name ??
            raw.firstName ??
            "",
          last_name:
            raw.last_name ??
            raw.lastName ??
            "",
          phone:
            raw.phone ??
            raw.phoneNumber ??
            "",
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
      invalidatesTags: ["User"],
      transformResponse: (response: any): ApiUser => {
        const raw = response?.data ?? response?.user ?? response;

        return {
          id: raw.id,
          email: raw.email ?? "",
          first_name:
            raw.first_name ??
            raw.firstName ??
            "",
          last_name:
            raw.last_name ??
            raw.lastName ??
            "",
          phone:
            raw.phone ??
            raw.phoneNumber ??
            "",
        };
      },
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
