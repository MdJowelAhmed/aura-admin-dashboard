import { api } from "../baseApi";
// enums / helper types
type ShopType =
  | "Call"
  | "Bundle"
  | string;

// single promo item
export interface ShopManagement {
  _id: string;
  promoCode: string;
  shopType: ShopType;
  value: number;
  usageLimit: number;
  usedCount: number;
  startDate: string; // ISO date string (e.g. "2025-09-20T00:00:00.000Z")
  endDate: string; // ISO date string (e.g. "2025-10-20T23:59:59.999Z")
  image: string | null;
  isActive: boolean;
  createdBy: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// pagination block
export interface Pagination {
  total: number;
  limit: number;
  page: number;
  totalPage: number;
}

// top-level response
export interface PromoCodeResponse {
  success: boolean;
  message: string;
  pagination: Pagination;
  data: ShopManagement[];
}

const shopManagementApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllShopManagement: build.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg: { name: string; value: string }) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          method: "GET",
          url: "/shop",
          params,
        };
      },
      providesTags: ["Users"],
    }),
    getSingleShopManagement: build.query<ShopManagement, string>({
      query: (id) => ({
        url: `/shop/${id}`,
        method: "GET",
      }),
      providesTags: ["Users"],
    }),
    createShopManagement: build.mutation<ShopManagement, ShopManagement>({
      query: (shopManagement) => ({
        url: "/shop",
        method: "POST",
        body: shopManagement,
      }),
      invalidatesTags: ["Users"],
    }),
    updateShopManagement: build.mutation<ShopManagement, ShopManagement>({
      query: (shopManagement) => ({
        url: `/shop/${shopManagement._id}`,
        method: "PATCH",
        body: shopManagement,
      }),
      invalidatesTags: ["Users"],
    }),
    updateShopManagementStatus: build.mutation< ShopManagement,
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/shop/toggle/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Users"],
    }),
    deleteShopManagement: build.mutation<ShopManagement, string>({
      query: (id) => ({
        url: `/shop/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
  
});
export const {
    useGetAllShopManagementQuery,
    useGetSingleShopManagementQuery,
    useCreateShopManagementMutation,
    useUpdateShopManagementMutation,
    useUpdateShopManagementStatusMutation,
    useDeleteShopManagementMutation,
} = shopManagementApi;
