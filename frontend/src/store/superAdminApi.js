import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const superAdminApi = createApi({
  reducerPath: "superAdmin_Api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/superadmin`,
    credentials: "include",
  }),
  tagTypes: ["Team", "Player", "Tournament"],
  endpoints: (builder) => ({
    getAllDataInNumber: builder.query({
      query: () => ({
        url: "/admin-dashboard",
        method: "GET",
      }),
      providesTags: ["Team", "Player", "Tournament"],
    }),
  }),
});

export const { useGetAllDataInNumberQuery } = superAdminApi;
