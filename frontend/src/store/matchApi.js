import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const matchApi = createApi({
  reducerPath: "match_api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/match`,
    credentials: "include",
  }),
  tagTypes: ["Match"],
  endpoints: (builder) => ({
    // create match
    startMatch: builder.mutation({
      query: ({ data, tournamentId }) => ({
        url: `/create-match/${tournamentId}/matches`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Match"],
    }),

    //schedule match
    scheduleMatch: builder.mutation({
      query: ({ data, tournamentId }) => ({
        url: `/schedule-match/${tournamentId}/matches`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Match"],
    }),

    getMyTournamentTeams: builder.query({
      query: (tournamentId) => ({
        url: `/tournament-matches/${tournamentId}`,
        method: "GET",
      }),
      providesTags: ["Match"],
    }),

    // get all matches
    getAllMatches: builder.query({
      query: (tournamentCategory) => ({
        url: `/all-matches/${tournamentCategory}`,
      }),
      providesTags: ["Match"],
    }),

    // get match by id
    getMatchById: builder.query({
      query: (matchId) => ({
        url: `/match/${matchId}`,
      }),
      providesTags: ["Match"],
    }),

    getManOfTheMatch: builder.mutation({
      query: ({ data, matchId }) => ({
        url: `/${matchId}/get-man-of-the-match`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useStartMatchMutation,
  useScheduleMatchMutation,
  useGetMyTournamentTeamsQuery,
  useGetAllMatchesQuery,
  useGetMatchByIdQuery,
  useGetManOfTheMatchMutation,
} = matchApi;
