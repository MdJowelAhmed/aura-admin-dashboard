import { api } from "../baseApi";
// enums / helper types
type DiscountType =
  | "Percentage Discount"
  | "Flat Discount"
  | "BuyOneGetOne"
  | string;

// single promo item
export interface Promo {
  _id: string;
  promoCode: string;
  discountType: DiscountType;
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
  data: Promo[];
}

const shopPackageApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllShopPackages: build.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg: { name: string; value: string }) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          method: "GET",
          url: "/aura",
          params,
        };
      },
      providesTags: ["Users"],
    }),
    getSingleShopPackage: build.query<PromoCodeResponse, string>({
      query: (id) => ({
        url: `/promo/${id}`,
        method: "GET",
      }),
      providesTags: ["Users"],
    }),
    createShopPackage: build.mutation<PromoCodeResponse, Promo>({
      query: (promo) => ({
        url: "/aura",
        method: "POST",
        body: promo,
      }),
      invalidatesTags: ["Users"],
    }),
    updateShopPackage: build.mutation<PromoCodeResponse, Promo>({
      query: (promo) => ({
        url: `/promo/${promo._id}`,
        method: "PATCH",
        body: promo,
      }),
      invalidatesTags: ["Users"],
    }),
    updateShopPackageStatus: build.mutation<
      PromoCodeResponse,
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/promo/toggle/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Users"],
    }),
    deleteShopPackage: build.mutation<PromoCodeResponse, string>({
      query: (id) => ({
        url: `/promo/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
  
});
export const {
    useGetAllShopPackagesQuery,
    useGetSingleShopPackageQuery,
    useCreateShopPackageMutation,
    useUpdateShopPackageMutation,
    useUpdateShopPackageStatusMutation,
    useDeleteShopPackageMutation,
} = shopPackageApi;
