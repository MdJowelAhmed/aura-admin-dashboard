import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../baseApi";

// Minimal User type based on provided JSON
export interface User {
  pages: unknown[];
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

// RTK Query endpoint injection for auth
export type LoginRequest = { email: string; password: string };
export type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    success: boolean;
    message: string;
    accessToken: string;
    refreshToken: string;
    user: User;
  };
};

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const access = data.data.accessToken;
          const refresh = data.data.refreshToken;
          const user = data.data.user;
          if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", access);
            localStorage.setItem("refreshToken", refresh);
            // Also set cookie for middleware access
            document.cookie = `accessToken=${access}; path=/; max-age=86400; SameSite=Strict`;
            document.cookie = `refreshToken=${refresh}; path=/; max-age=604800; SameSite=Strict`;
          }
          dispatch(
            setCredentials({ user, accessToken: access, refreshToken: refresh })
          );
        } catch {
          // ignore - hook consumer handles errors
        }
      },
    }),
    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          if (typeof window !== "undefined") {
            // Clear localStorage
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            // Clear cookies by setting expiration to past date
            document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
            document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
          }
          dispatch(logout());
        } catch {
          // Even if API call fails, clear local storage and dispatch logout
          if (typeof window !== "undefined") {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
            document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
          }
          dispatch(logout());
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useLogoutMutation } = authApi;
