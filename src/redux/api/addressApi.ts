import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

export interface Address {
  id: string;
  title: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export const addressApi = createApi({
  reducerPath: 'addressApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/addresses`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Address'],
  endpoints: (builder) => ({
    getAddresses: builder.query<Address[], void>({
      query: () => '/',
      transformResponse: (response: any) => {
        console.log("🔥 Backend Address Response:", response);

        if (Array.isArray(response)) return response;
        if (Array.isArray(response?.addresses)) return response.addresses;
        if (Array.isArray(response?.data)) return response.data;

        return [];
      },
      providesTags: ['Address'],
    }),

    createAddress: builder.mutation<Address, Partial<Address>>({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Address'],
    }),

    updateAddress: builder.mutation<
      Address,
      { addressId: string; body: Partial<Address> }
    >({
      query: ({ addressId, body }) => ({
        url: `/${addressId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Address'],
    }),

    deleteAddress: builder.mutation<{ success: boolean; id: string }, string>({
      query: (addressId) => ({
        url: `/${addressId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Address'],
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressApi;
