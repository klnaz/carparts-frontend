import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";

import { userApi } from "./api/userApi";
import { authApi } from "./api/authApi";
import { favoritesApi } from "./api/favoritesApi"; // ✅ EKLE
import { addressApi } from "./api/addressApi";
import { paymentApi } from "./api/paymentApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,

    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [favoritesApi.reducerPath]: favoritesApi.reducer, // ✅ EKLE
    [addressApi.reducerPath]: addressApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      favoritesApi.middleware,
      addressApi.middleware,
      paymentApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
