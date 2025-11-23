

import { AgeDistributionResponse, EthnicityDistributionResponse, GenderDistribution } from "../../../../types";
import { api } from "../baseApi";

const dashbaordOverviewApi = api.injectEndpoints({
    endpoints: (build) => ({
        ageDistribution: build.query<AgeDistributionResponse, void>({
            query: () => ({
                url: "/overview/age-distribution",
                method: "GET",
            }),
            providesTags: ["DashboardOverview"],
        }),

        ethnicityDistribution: build.query<EthnicityDistributionResponse, void>({
            query: () => ({
                url: "/overview/ethnicity-distribution",
                method: "GET",
            }),
            providesTags: ["DashboardOverview"],
        }),

        genderdistribution: build.query<GenderDistribution, void>({
            query: () => ({
                url: "/overview/gender-distribution",
                method: "GET",
            }),
            providesTags: ["DashboardOverview"],
        }),
    })

})
export const { useAgeDistributionQuery, useEthnicityDistributionQuery, useGenderdistributionQuery } = dashbaordOverviewApi;