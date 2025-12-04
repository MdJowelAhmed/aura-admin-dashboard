import { api } from "../baseApi";

export interface TermsData {
  _id: string;
  content: string;
  __v: number;
}

export interface TermsResponse {
  success: boolean;
  message: string;
  data: TermsData;
}

const guidelinesApi = api.injectEndpoints({
  endpoints: (build) => ({
    
    getAllGuidelines: build.query<TermsResponse, void>({
      query: () => ({
        method: "GET",
        url: "/rule/terms-and-conditions",
      }),
      providesTags: ["Guidelines"],
    }),

    createGuideline: build.mutation<TermsResponse, { content: string }>({
      query: (data) => ({
        url: "/rule/terms-and-conditions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Guidelines"],
    }),

    updateGuidelineStatus: build.mutation<
      TermsResponse,
      { id: string; status: string }
    >({
      query: (data) => ({
        url: `/rule/terms-and-conditions`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Guidelines"],
    }),
  }),
});

export const {
  useGetAllGuidelinesQuery,
  useCreateGuidelineMutation,
  useUpdateGuidelineStatusMutation,
} = guidelinesApi;
