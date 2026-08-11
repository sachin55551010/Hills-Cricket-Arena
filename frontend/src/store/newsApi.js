import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const newsApi = createApi({
  reducerPath: "news_api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_BASE_URL}`,
    credentials: "include",
  }),
  tagTypes: ["News"],
  endpoints: (builder) => ({
    getNews: builder.query({
      query: () => ({
        url: "/",
      }),
    }),
    provideTags: ["News"],
  }),
});

export const { useGetNewsQuery } = newsApi;
