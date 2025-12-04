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

export type ChangePasswordRequest = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type VerifyOTPRequest = {
  email: string;
  otp: string;
};

export type VerifyOTPResponse = {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
  };
};

export type ResetPasswordRequest = {
  newPassword: string;
  confirmPassword: string;
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
          }
          dispatch(
            setCredentials({ user, accessToken: access, refreshToken: refresh })
          );
        } catch {
          // ignore - hook consumer handles errors
        }
      },
    }),
    changePassword: builder.mutation<
      { success: boolean },
      ChangePasswordRequest
    >({
      query: (passwords) => ({
        url: "/auth/change-password",
        method: "POST",
        body: passwords,
      }),
      invalidatesTags: ["User"],
    }),
    forgotPassword: builder.mutation<{ success: boolean }, { email: string }>({
      query: (email) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: email,
      }),
      invalidatesTags: ["User"],
    }),
    verifyOTP: builder.mutation<VerifyOTPResponse, VerifyOTPRequest>({
      query: (data) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const access = data.data.accessToken;
          if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", access);
          }
        } catch {
          // ignore - hook consumer handles errors
        }
      },
      invalidatesTags: ["User"],
    }),
    resetPassword: builder.mutation<{ success: boolean; message: string }, ResetPasswordRequest>({
      query: (data) => {
        const token = localStorage.getItem("authToken");
        return {
          url: "/auth/reset-password",
          method: "POST",
          headers: {
            Authorization: token ?? "",
          },
          body: data,
        };
      },
    }),
    getMyProfile: builder.query<User, void>({
      query: () => ({
        url: "/user/profile",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    updateMyProfile: builder.mutation<User, Partial<User>>({
      query: (formData) => ({
        url: "/user",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),
    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
        } catch {
          // Even if API call fails, clear local storage and dispatch logout
          dispatch(logout());
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useChangePasswordMutation,
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useForgotPasswordMutation,
  useVerifyOTPMutation,
  useResetPasswordMutation,

} = authApi;
