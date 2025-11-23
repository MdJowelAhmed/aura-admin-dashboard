

import { AgeDistributionResponse } from "../../../../types";
import { api } from "../baseApi";

const dashbaordOverviewApi=api.injectEndpoints({
    endpoints: (build) => ({
        ageDistribution: build.query<AgeDistributionResponse, void>({
            query: () => ({
                url: "/overview/age-distribution",
                method: "GET",
            }),
            providesTags: ["DashboardOverview"],
        }),
    })
})
export const { useAgeDistributionQuery } = dashbaordOverviewApi;