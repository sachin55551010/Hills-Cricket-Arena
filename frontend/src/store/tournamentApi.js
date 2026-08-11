import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
export const tournamentApi = createApi({
  reducerPath: "tournament_api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/tournament`,
    credentials: "include",
  }),
  tagTypes: ["Tournament", "Auth"],
  endpoints: (builder) => ({
    getAllTournaments: builder.query({
      query: ({ tournamentCategory, searchData, page, limit }) => ({
        url: `/all-tournaments/${tournamentCategory}`,
        params: {
          page,
          limit,
          ...(searchData && {
            search: searchData.search,
            value: searchData.value,
            status: searchData.status,
          }),
        },
      }),
      providesTags: ["Tournament"],
    }),
    addTournament: builder.mutation({
      query: (data) => ({
        url: "/add-tournament",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Tournament", "Auth"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data.message, { autoClose: 1500, theme: "colored" });
        } catch (error) {
          console.log(error);
          toast.error(error.error.data.message, {
            autoClose: 1500,
            theme: "colored",
          });
        }
      },
    }),

    getMyTournament: builder.query({
      query: () => ({
        url: "/my-tournaments",
      }),
      providesTags: ["Tournament"],
    }),

    getTournamentInfo: builder.query({
      query: (tournamentId) => ({
        url: `/my-tournaments/${tournamentId}`,
        method: "GET",
      }),
      providesTags: ["Tournament"],
    }),

    updateTournamentInfo: builder.mutation({
      query: ({ tournamentId, updatedFields }) => ({
        url: `/update-tournament/${tournamentId}`,
        method: "PATCH",
        body: updatedFields,
      }),
      invalidatesTags: ["Tournament"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data.message, { autoClose: 1500, theme: "colored" });
        } catch (error) {
          console.log(error);
          toast.error(error.error.data.message, {
            autoClose: 1500,
            theme: "colored",
          });
        }
      },
    }),

    deleteTournament: builder.mutation({
      query: (id) => ({
        url: `/delete-tournament/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tournament", "Auth"],
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          toast.success(data.message, { autoClose: 1500, theme: "colored" });
        } catch (error) {
          toast.error(error.error.data.message);
        }
      },
    }),
  }),
});

export const {
  useAddTournamentMutation,
  useGetMyTournamentQuery,
  useGetTournamentInfoQuery,
  useUpdateTournamentInfoMutation,
  useDeleteTournamentMutation,
  useGetAllTournamentsQuery,
} = tournamentApi;
