import { createSlice } from "@reduxjs/toolkit";

// Swap striker
const swapStriker = (state) => {
  [
    state.currentMatchData.currentPlayers.striker,
    state.currentMatchData.currentPlayers.nonStriker,
  ] = [
    state.currentMatchData.currentPlayers.nonStriker,
    state.currentMatchData.currentPlayers.striker,
  ];
};

// Save current state to history
const saveHistory = (state) => {
  const snapshot = JSON.parse(JSON.stringify(state.currentMatchData));

  state.matchHistory.push(snapshot);
};

// Undo
const undoMatch = (state) => {
  if (state.matchHistory.length === 0) {
    return;
  }

  const previousState = state.matchHistory.pop();

  state.currentMatchData = previousState;
};

// Initial match data

let currentMatchData = {};

try {
  currentMatchData = JSON.parse(localStorage.getItem("currentMatch") || "{}");
} catch (error) {
  console.error("Invalid currentMatchData in localStorage:", error);
}

// function to add runs
const addRuns = (state, runs) => {
  console.log(currentMatchData);

  const match = state.currentMatchData;
  const striker = match?.currentPlayers?.striker.battingStats;
  const bowler = match?.currentPlayers?.bowler.bowlingStats;
  const inningIndex = match?.currentInning - 1;
  const inning = match?.innings?.[inningIndex];

  if (!striker || !bowler || !inning) return;

  inning.runs += runs;
  inning.legalBalls += 1;

  // batsman stats update
  striker.runs += runs;
  striker.balls += 1;
  striker.fours += runs === 4 ? 1 : 0;
  striker.sixes += runs === 6 ? 1 : 0;
  striker.strikeRate =
    striker.balls > 0 ? (striker.runs / striker.balls) * 100 : 0;

  // bowler stats update
  bowler.balls += 1;
  bowler.runs += runs;
  bowler.economy = bowler.balls > 0 ? (bowler.runs / bowler.balls) * 6 : 0;
};
// Slice
const scoreSlice = createSlice({
  name: "score_slice",

  initialState: {
    currentMatchData,
    matchHistory: [],
  },

  reducers: {
    setCurrentMatchData: (state, action) => {
      state.currentMatchData = action.payload;
    },
    recordDelivery: (state, action) => {
      const payload = action.payload;

      const isRuns = ["0", "1", "2", "3", "4", "5", "6"].includes(payload);

      if (payload === "UNDO") {
        undoMatch(state);
        return;
      }

      if (payload === "SWAP" || isRuns) {
        saveHistory(state); // snapshot BEFORE the action
      }

      if (payload === "SWAP") {
        swapStriker(state);
        return;
      }

      if (isRuns) {
        const numRuns = Number(payload) || 0;
        addRuns(state, numRuns);
      }
      if (["1", "3", "5"].includes(payload)) {
        swapStriker(state);
      }
    },
  },
});

export const { recordDelivery, setCurrentMatchData } = scoreSlice.actions;

export default scoreSlice.reducer;
