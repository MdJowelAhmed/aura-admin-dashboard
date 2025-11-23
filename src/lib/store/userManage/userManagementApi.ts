import { UsersResponse } from "../../../../types";
import { api } from "../baseApi";

const userManagementApi = api.injectEndpoints({
    endpoints: (build) => ({
        getAllUsers: build.query<UsersResponse, void>({
            query: () => ({
                url: "/users",  
                method: "GET",
            }),
            providesTags: ["Users"],
        }),
    })
})
export const { useGetAllUsersQuery } = userManagementApi;