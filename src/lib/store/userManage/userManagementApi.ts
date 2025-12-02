import { UsersResponse } from "../../../../types";
import { api } from "../baseApi";

const userManagementApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllUsers: build.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg: { name: string; value: string }) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          method: "GET",
          url: "/usermanagement",
          params,
        };
      },
      providesTags: ["Users"],
    }),
    getSingleUser: build.query<UsersResponse, string>({
      query: (id) => ({
        url: `/usermanagement/${id}`,
        method: "GET",
      }),
      providesTags: ["Users"],
    }),
    updateUserStatus: build.mutation<
      UsersResponse,
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/usermanagement/toggle-status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});
export const {
  useGetAllUsersQuery,
  useGetSingleUserQuery,
  useUpdateUserStatusMutation,
} = userManagementApi;
