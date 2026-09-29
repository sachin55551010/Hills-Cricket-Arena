import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";

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
    getRecentActivities: builder.query({
      query: () => ({
        url: "/admin-dashboard",
        method: "GET",
      }),
      providesTags: ["Team", "Player", "Tournament"],
      transformResponse: (response) => ({
        recent: response.recent,
        tournamentsByCategory: response.tournamentsByCategory,
      }),
    }),

    // ── Player management ─────────────────────────────────────────────────
    getAllPlayers: builder.query({
      query: ({ search, value, role } = {}) => ({
        url: "/players",
        params: { search, value, role },
      }),
      providesTags: ["Player"],
    }),

    updatePlayer: builder.mutation({
      query: ({ playerId, updatedFields }) => ({
        url: `/players/${playerId}`,
        method: "PATCH",
        body: updatedFields,
      }),
      invalidatesTags: ["Player"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data.message, { autoClose: 1500, theme: "colored" });
        } catch (error) {
          toast.error(error?.error?.data?.message || "Update failed", {
            autoClose: 1500,
            theme: "colored",
          });
        }
      },
    }),

    deletePlayer: builder.mutation({
      query: (playerId) => ({
        url: `/players/${playerId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Player"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data.message, { autoClose: 1500, theme: "colored" });
        } catch (error) {
          toast.error(error?.error?.data?.message || "Delete failed", {
            autoClose: 1500,
            theme: "colored",
          });
        }
      },
    }),

    updatePlayerStats: builder.mutation({
      query: ({ playerId, careerStats }) => ({
        url: `/players/${playerId}/stats`,
        method: "PATCH",
        body: { careerStats },
      }),
      invalidatesTags: ["Player"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data.message, { autoClose: 1500, theme: "colored" });
        } catch (error) {
          toast.error(error?.error?.data?.message || "Stats update failed", {
            autoClose: 1500,
            theme: "colored",
          });
        }
      },
    }),
  }),
});

export const {
  useGetAllDataInNumberQuery,
  useGetRecentActivitiesQuery,
  useGetAllPlayersQuery,
  useUpdatePlayerMutation,
  useDeletePlayerMutation,
  useUpdatePlayerStatsMutation,
} = superAdminApi;
