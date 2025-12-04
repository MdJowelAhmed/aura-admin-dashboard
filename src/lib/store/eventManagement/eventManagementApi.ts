import { api } from "../baseApi";

// Bundle sub-types
// Pagination
export interface Pagination {
  total: number;
  limit: number;
  page: number;
  totalPage: number;
}

// Single Event item
export interface EventManagement {
  _id: string;
  eventName: string;
  eventType: string;
  state: string;
  startDate: string;
  endDate: string;
  image: string | null;
  status: string;
  isActive: boolean;
  selectedGame?: string;
  offAPPercentage?: number | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Top level response
export interface EventManagementResponse {
  success: boolean;
  message: string;
  pagination: Pagination;
  data: EventManagement[];
}

const eventManagementApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllEventManagement: build.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg: { name: string; value: string }) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          method: "GET",
          url: "/event",
          params,
        };
      },
      providesTags: ["EventManagement"],
    }),
    getSingleEventManagement: build.query<EventManagementResponse, string>({
      query: (id) => ({
        url: `/event/${id}`,
        method: "GET",
      }),
      providesTags: ["EventManagement"],
    }),
    createEventManagement: build.mutation<EventManagement, EventManagement>({
      query: (eventManagement) => ({
        url: "/event",
        method: "POST",
        body: eventManagement,
      }),
      invalidatesTags: ["EventManagement"],
    }),
    updateEventManagement: build.mutation<
      EventManagement,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/event/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["EventManagement"],
    }),
    updateEventManagementStatus: build.mutation<
      EventManagement,
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/event/toggle/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["EventManagement"],
    }),
    deleteEventManagement: build.mutation<EventManagement, string>({
      query: (id) => ({
        url: `/event/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["EventManagement"],
    }),
  }),
});
export const {
  useGetAllEventManagementQuery,
  useGetSingleEventManagementQuery,
  useCreateEventManagementMutation,
  useUpdateEventManagementMutation,
  useUpdateEventManagementStatusMutation,
  useDeleteEventManagementMutation,
} = eventManagementApi;
