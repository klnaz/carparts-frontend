import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

// Backend'in gerçekten döndürdüğü tip
export interface ApiUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/users`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // PROFİL GETİR
    getUserProfile: builder.query<ApiUser, void>({
      query: () => '/', // GET /users/
    }),

    // PROFİL GÜNCELLE
    updateUser: builder.mutation<ApiUser, Partial<ApiUser>>({
      query: (body) => ({
        url: '/',          // PUT /users/
        method: 'PUT',
        body,
      }),
    }),

    // ŞİFRE DEĞİŞTİR
    changePassword: builder.mutation<
      void,
      { oldPassword: string; newPassword: string }
    >({
      query: (body) => ({
        url: '/password',
        method: 'PUT',
        body,
      }),
    }),

    // HESAP SİL
    deleteUser: builder.mutation<void, void>({
      query: () => ({
        url: '/',          // DELETE /users/
        method: 'DELETE',
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
