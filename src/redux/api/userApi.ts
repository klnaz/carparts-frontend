import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import { User } from '@/types/user';

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
    getUserProfile: builder.query<User, void>({
      query: () => '/',
    }),
    updateUser: builder.mutation<User, Partial<User>>({
      query: (body) => ({
        url: '/',
        method: 'PUT',
        body,
      }),
    }),
    changePassword: builder.mutation<void, { oldPassword: string; newPassword: string }>({
      query: (body) => ({
        url: '/password',
        method: 'PUT',
        body,
      }),
    }),
    deleteUser: builder.mutation<void, void>({
      query: () => ({
        url: '/',
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
