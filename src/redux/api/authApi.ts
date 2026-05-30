import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/auth`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    register: builder.mutation({ query: (body) => ({ url: '/register', method: 'POST', body }) }),
    login: builder.mutation({ query: (body) => ({ url: '/login', method: 'POST', body }) }),
    refreshToken: builder.mutation({ query: (body) => ({ url: '/refresh-token', method: 'POST', body }) }),
    logout: builder.mutation({ query: (body) => ({ url: '/logout', method: 'POST', body }) }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
} = authApi;
