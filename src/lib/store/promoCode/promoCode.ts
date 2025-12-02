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

const promoCodeApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllPromoCodes: build.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg: { name: string; value: string }) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          method: "GET",
          url: "/promo",
          params,
        };
      },
      providesTags: ["Users"],
    }),
    getSinglePromoCode: build.query<PromoCodeResponse, string>({
      query: (id) => ({
        url: `/promo/${id}`,
        method: "GET",
      }),
      providesTags: ["Users"],
    }),
    createPromoCode: build.mutation<PromoCodeResponse, Promo>({
      query: (promo) => ({
        url: "/promo",
        method: "POST",
        body: promo,
      }),
      invalidatesTags: ["Users"],
    }),
    updatePromoCode: build.mutation<PromoCodeResponse, Promo>({
      query: (promo) => ({
        url: `/promo/${promo._id}`,
        method: "PATCH",
        body: promo,
      }),
      invalidatesTags: ["Users"],
    }),
    updatePromoCodeStatus: build.mutation<
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
    deletePromoCode: build.mutation<PromoCodeResponse, string>({
      query: (id) => ({
        url: `/promo/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
  
});
export const {
    useGetAllPromoCodesQuery,
    useGetSinglePromoCodeQuery,
    useCreatePromoCodeMutation,
    useUpdatePromoCodeMutation,
    useUpdatePromoCodeStatusMutation,
    useDeletePromoCodeMutation,
} = promoCodeApi;
