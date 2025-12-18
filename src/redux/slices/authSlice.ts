import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types/user";

interface AuthState {
  token: string | null;
  user: User | null;
  hydrated: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  hydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateAuth: (
      state,
      action: PayloadAction<{ token: string | null; user: User | null }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.hydrated = true;
    },

    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload);
      }
    },

    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(action.payload));
      }
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      state.hydrated = true;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    },
  },
});

export const { hydrateAuth, setToken, setUser, logout } =
  authSlice.actions;

export default authSlice.reducer;
