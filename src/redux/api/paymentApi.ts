
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

export interface PaymentMethod {
  id: string;
  userId: string;
  cardType: string;
  cardholderName: string;
  cardNumberLast4: string;
  expiryMonth: string;
  expiryYear: string;
  isPrimary: boolean;
}

export interface PaymentMethodPayload {
  cardType: string;
  cardholderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: number;
  cvv: string;
  isPrimary: boolean;
};

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/payment-methods`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['PaymentMethod'],
  endpoints: (builder) => ({
    getPaymentMethods: builder.query<PaymentMethod[], void>({
      query: () => '/',
      providesTags: ['PaymentMethod'],
    }),
    createPaymentMethod: builder.mutation<PaymentMethod, PaymentMethodPayload>({
      query: (body) => ({ url: '/', method: 'POST', body }),
      invalidatesTags: ['PaymentMethod'],
    }),

    updatePaymentMethod: builder.mutation<
      PaymentMethod,
      { paymentMethodId: string; body: Partial<PaymentMethod> }
    >({
      query: ({ paymentMethodId, body }) => ({
        url: `/${paymentMethodId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['PaymentMethod'],
    }),
    deletePaymentMethod: builder.mutation<{ success: boolean; id: string }, string>({
      query: (paymentMethodId) => ({
        url: `/${paymentMethodId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PaymentMethod'],
    }),
  }),
});

export const {
  useGetPaymentMethodsQuery,
  useCreatePaymentMethodMutation,
  useUpdatePaymentMethodMutation,
  useDeletePaymentMethodMutation,
} = paymentApi;
