import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";

import { userApi } from "./api/userApi";
import { authApi } from "./api/authApi";
import { favoritesApi } from "./api/favoritesApi"; // ✅ EKLE

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,

    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [favoritesApi.reducerPath]: favoritesApi.reducer, // ✅ EKLE
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(userApi.middleware)
      .concat(favoritesApi.middleware), // ✅ EKLE
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
