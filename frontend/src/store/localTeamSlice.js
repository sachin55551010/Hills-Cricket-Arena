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
      
      console.log("action payload", action);
      
      
      state.teams = state.teams.filter(
        (team) => team.teamId !== action.payload
      );
      persistTeams(state.teams);
    },
  },
});

export const {
  setLocalTeams,
  addLocalTeam,
  updateLocalTeamName,
  deleteLocalTeam,
} = localTeamSlice.actions;

export default localTeamSlice.reducer;