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
  const snapshot = JSON.parse(
    JSON.stringify(state.currentMatchData)
  );

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
  currentMatchData = JSON.parse(
    localStorage.getItem("currentMatch") || "{}"
  );
} catch (error) {
  console.error(
    "Invalid currentMatchData in localStorage:",
    error
  );
}


// Slice

const scoreSlice = createSlice({
  name: "score_slice",

  initialState: {
    currentMatchData,
    matchHistory: [],
  },

  reducers: {
    addRuns: (state, action) => {

      
      // UNDO
      if (action.payload === "UNDO") {
        undoMatch(state);
        return;
      }

      
      // SWAP
      if (action.payload === "SWAP") {

        // Save state BEFORE changing it
        saveHistory(state);

        swapStriker(state);

        return;
      }

      // handle extra runs
      if(["WD", "NB", "LB", "BYE"].includes(action.payload)){
        console.log(action.payload);
        return
        
      }

      
      // RUN 
      if (
        ["0", "1", "2", "3", "4", "6"].includes(
          action.payload
        )
      ) {

        // Save state BEFORE changing it
        saveHistory(state);

        const numRuns = Number(action.payload);

        // Current inning
        const currentInning =
          state.currentMatchData.innings[
            state.currentMatchData.currentInning - 1
          ];

        currentInning.runs += numRuns;
        currentInning.legalBalls += 1;

        
        // Striker
        
        const striker =
          state.currentMatchData.currentPlayers.striker;

        striker.battingStats.runs += numRuns;
        striker.battingStats.balls += 1;

        
        // Bowler
        
        const bowler =
          state.currentMatchData.currentPlayers.bowler;

        bowler.bowlingStats.balls += 1;
        bowler.bowlingStats.runs += numRuns;

        
        // Strike rate
        
        const batsmanStats =
          striker.battingStats;

        batsmanStats.strikeRate =
          batsmanStats.balls > 0
            ? (batsmanStats.runs * 100) /
              batsmanStats.balls
            : 0;

        if (action.payload === "6") {
  state.currentMatchData.currentPlayers.striker.battingStats.sixes += 1;
}

if (action.payload === "4") {
  state.currentMatchData.currentPlayers.striker.battingStats.fours += 1;
}
        // Economy 
        const bowlerStats =
          bowler.bowlingStats;

        bowlerStats.economy =
          bowlerStats.balls > 0
            ? (bowlerStats.runs * 6) /
              bowlerStats.balls
            : 0;

           
        
        // Swap after 1 or 3
        
        if (
          ["1", "3"].includes(action.payload)
        ) {
          swapStriker(state);
        }

        return;
      }
    },
  },
});

export const {
  addRuns,
} = scoreSlice.actions;

export default scoreSlice.reducer;