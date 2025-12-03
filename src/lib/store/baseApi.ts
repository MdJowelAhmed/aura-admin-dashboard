import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://10.10.7.8:5002/api/v1",
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("accessToken");
        if (token) headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Products",
    "Users",
    "Orders",
    "Brands",
    "Category",
    "Brand",
    "Categories",
    "News",
    "Profile",
    "Chats",
    "chatId",
    "Messages",
    "DashboardOverview",
    "EventManagement",
  ],
  endpoints: () => ({}),
});
