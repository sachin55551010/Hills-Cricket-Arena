import { createSlice } from "@reduxjs/toolkit";

// Load initial state from localStorage
let initialTeams = [];

try {
  initialTeams = JSON.parse(localStorage.getItem("localTeams") || "[]");
} catch (error) {
  console.error("Invalid localTeams in localStorage:", error);
}

// Persist helper
const persistTeams = (teams) => {
  localStorage.setItem("localTeams", JSON.stringify(teams));
};

const localTeamSlice = createSlice({
  name: "local_team",
  initialState: {
    teams: initialTeams,
    players: [],
  },

  reducers: {
    setLocalTeams: (state, action) => {
      state.teams = action.payload;
      persistTeams(state.teams);
    },

    addLocalTeam: (state, action) => {
      state.teams.push(action.payload);
      persistTeams(state.teams);
    },

    updateLocalTeamName: (state, action) => {
      const { teamId, name } = action.payload;
      const team = state.teams.find((t) => t.teamId === teamId);
      if (team) {
        team.name = name;
        persistTeams(state.teams);
      }
    },

    deleteLocalTeam: (state, action) => {
      state.teams = state.teams.filter(
        (team) => team.teamId !== action.payload,
      );
      persistTeams(state.teams);
    },
    addPlayerToTeam: (state, action) => {
      const { teamId, player } = action.payload;

      const team = state.teams.find((t) => t.teamId === teamId);

      if (team) {
        team.players ??= [];
        team.players.push(player);
        persistTeams(state.teams);
      }
    },
    updatePlayerInTeam: (state, action) => {
      const { teamId, playerId, name } = action.payload;

      const team = state.teams.find((team) => team.teamId === teamId);

      if (team?.players) {
        const player = team.players.find(
          (player) => player.playerId === playerId,
        );

        if (player) {
          player.name = name;
          persistTeams(state.teams);
        }
      }
    },

    deletePlayerFromTeam: (state, action) => {
      const { teamId, playerId } = action.payload;

      const team = state.teams.find((team) => team.teamId === teamId);

      if (team?.players) {
        team.players = team.players.filter(
          (player) => player.playerId !== playerId,
        );

        persistTeams(state.teams);
      }
    },
  },
});

export const {
  setLocalTeams,
  addLocalTeam,
  updateLocalTeamName,
  deleteLocalTeam,
  addPlayerToTeam,
  updatePlayerInTeam,
  deletePlayerFromTeam,
} = localTeamSlice.actions;

export default localTeamSlice.reducer;
