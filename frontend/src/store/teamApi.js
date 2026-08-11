import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { getSocket } from "../utils/socket";

export const teamApi = createApi({
  reducerPath: "team_api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/team`,
    credentials: "include",
  }),
  tagTypes: ["Team", "Player"],
  endpoints: (builder) => ({
    // get all teams from specific tournaments
    createTeam: builder.mutation({
      query: ({ tournamentId, teamData }) => ({
        url: `/create-team/${tournamentId}`,
        method: "POST",
        body: teamData,
      }),
      invalidatesTags: ["Team", "Player"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data.message, { autoClose: 1500, theme: "colored" });
        } catch (error) {
          console.log("create team error : ", error);
          toast.error(error.error.data.message, {
            autoClose: 2000,
            theme: "colored",
          });
        }
      },
    }),

    // get teams linked with tournament
    getTeamsByTournament: builder.query({
      query: (tournamentId) => ({
        url: `/my-tournament-teams/${tournamentId}`,
      }),
      providesTags: ["Team"],
      async onCacheEntryAdded(
        tournamentId,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        try {
          await cacheDataLoaded;
          const socket = getSocket();
          socket.on("createTeam", (newTeam) => {
            updateCachedData((draft) => {
              draft.myTournamentTeams.push(newTeam);
            });
          });
          await cacheEntryRemoved;
          socket.off("createTeam");
        } catch (error) {
          console.log("get Team by tournament error : ", error);
        }
      },
    }),

    //get players linked with team
    getTeamPlayers: builder.query({
      query: (teamId) => ({
        url: `/team-players/${teamId}`,
        method: "GET",
      }),
      providesTags: ["Player"],
    }),

    getTeamById: builder.query({
      query: (teamId) => ({
        url: `get-team/${teamId}`,
        method: "GET",
      }),
      providesTags: ["Team"],
    }),

    deleteTeam: builder.mutation({
      query: ({ tournamentId, teamId }) => ({
        url: `/delete-team/${tournamentId}/${teamId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Team"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data.message, { autoClose: 1500, theme: "colored" });
        } catch (error) {
          toast.error(error.error.data.message);
        }
      },
    }),

    updateTeam: builder.mutation({
      query: ({ tournamentId, teamId, teamData }) => ({
        url: `/update-team/${tournamentId}/${teamId}`,
        method: "PATCH",
        body: teamData,
      }),
      invalidatesTags: ["Team", "Player"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data.message, { autoClose: 1500, theme: "colored" });
        } catch (error) {
          console.log("Update team error");
          toast.error(error.error.data.message, {
            autoClose: 2000,
            theme: "colored",
          });
        }
      },
    }),

    // update player role in team
    updateTeamPlayerRole: builder.mutation({
      query: ({ teamId, playerId, role }) => ({
        url: `/update-team-player-role/${teamId}/${playerId}`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["Team", "Player"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data.message, { autoClose: 1500, theme: "colored" });
        } catch (error) {
          console.log("Update team player role error");
          toast.error(error.error.data.message);
        }
      },
    }),

    // remove player from team
    removePlayerFromTeam: builder.mutation({
      query: ({ tournamentId, teamId, playerId }) => ({
        url: `/remove-player-from-team/${tournamentId}/${teamId}/${playerId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Player"],
    }),
  }),
});

export const {
  useCreateTeamMutation,
  useGetTeamsByTournamentQuery,
  useGetTeamPlayersQuery,
  useGetTeamByIdQuery,
  useDeleteTeamMutation,
  useUpdateTeamMutation,
  useUpdateTeamPlayerRoleMutation,
  useRemovePlayerFromTeamMutation,
} = teamApi;
