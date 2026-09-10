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

// function to add legal runs
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

// add wide runs
const addWideBallRunData = (state, data) => {
  const match = state.currentMatchData;
  const inningIndex = match?.currentInning - 1;
  const inning = match?.innings?.[inningIndex];
  const bowler = match?.currentPlayers?.bowler.bowlingStats;
  inning.runs += match.wideBallRun + data.runs;
  inning.extras.wideBallRun += match.wideBallRun;
  bowler.runs += match.wideBallRun + data.runs;
  // Change strike for 1 or 3 bat runs
  if (data.runs === 1 || data.runs === 3) {
    swapStriker(state);
  }
};
// add no ball runs
const addNoBallRunData = (state, data) => {
  const match = state.currentMatchData;
  const inningIndex = match?.currentInning - 1;
  const inning = match?.innings?.[inningIndex];
  const striker = match?.currentPlayers?.striker?.battingStats;
  const bowler = match?.currentPlayers?.bowler?.bowlingStats;
  // 1 run penalty for every no-ball
  const noBallRun = match?.noBallRun;

  // Add total runs to innings
  inning.runs += noBallRun + data.runs;

  // Add no-ball penalty to extras
  inning.extras.noBallRun += noBallRun;

  // Bowler is charged with no-ball + BAT runs
  // BYE and LB are not charged to bowler
  bowler.runs += noBallRun;

  switch (data.runType) {
    case "BAT":
      // Runs scored by the batsman
      console.log(striker.runs);
      striker.runs += data.runs;
      striker.fours += data.runs === 4 ? 1 : 0;
      striker.sixes += data.runs === 6 ? 1 : 0;
      striker.strikeRate =
        striker.balls > 0 ? (striker.runs / striker.balls) * 100 : 0;

      // Bat runs are charged to bowler
      bowler.runs += data.runs;
      // Change strike for 1 or 3 bat runs
      if (data.runs === 1 || data.runs === 3) {
        swapStriker(state);
      }
      break;

    case "BYE":
      // Bye runs
      inning.extras.bye += data.runs;
      bowler.runs += data.runs;
      // Change strike for 1 or 3 bat runs
      if (data.runs === 1 || data.runs === 3) {
        swapStriker(state);
      }
      break;

    case "LB":
      // Leg-bye runs
      inning.extras.legBye += data.runs;
      bowler.runs += data.runs;
      // Change strike for 1 or 3 bat runs
      if (data.runs === 1 || data.runs === 3) {
        swapStriker(state);
      }
      break;

    default:
      console.warn("Invalid no-ball run type:", data.type);
  }
};

// Add leg-bye runs
const addLBRunData = (state, data) => {
  const match = state.currentMatchData;

  const inningIndex = match?.currentInning - 1;
  const inning = match?.innings?.[inningIndex];

  const bowler = match?.currentPlayers?.bowler?.bowlingStats;

  if (!inning || !bowler) {
    console.warn("Invalid inning or bowler data");
    return;
  }

  const runs = data?.runs || 1;

  // 1. Add leg-bye runs to main innings score
  inning.runs += runs;
  inning.legalBalls += 1;
  // 2. Add leg-bye runs to extras
  inning.extras.legBye += runs;

  bowler.balls += 1;

  // 4. Change strike for 1 or 3 leg-bye runs
  if (runs === 1 || runs === 3) {
    swapStriker(state);
  }
};

// add bye runs
const addByeRunData = (state, data) => {
  const match = state.currentMatchData;

  const inningIndex = match?.currentInning - 1;
  const inning = match?.innings?.[inningIndex];

  const bowler = match?.currentPlayers?.bowler?.bowlingStats;

  if (!inning || !bowler) {
    console.warn("Invalid inning or bowler data");
    return;
  }

  const runs = data?.runs || 1;

  // 1. Add leg-bye runs to main innings score
  inning.runs += runs;
  inning.legalBalls += 1;
  // 2. Add leg-bye runs to extras
  inning.extras.byes += runs;

  bowler.balls += 1;

  // 4. Change strike for 1 or 3 leg-bye runs
  if (runs === 1 || runs === 3) {
    swapStriker(state);
  }
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

      // Undo should NEVER save a new history entry
      if (payload === "UNDO") {
        undoMatch(state);
        return;
      }

      // Save the state BEFORE making any changes
      saveHistory(state);

      const isRuns = ["0", "1", "2", "3", "4", "5", "6"].includes(payload);

      if (payload === "SWAP") {
        swapStriker(state);
        return;
      }

      if (isRuns) {
        const numRuns = Number(payload) || 0;

        addRuns(state, numRuns);

        // Change strike for 1, 3, 5
        if (["1", "3", "5"].includes(payload)) {
          swapStriker(state);
        }

        return;
      }

      if (payload?.type === "WD") {
        addWideBallRunData(state, payload);
        return;
      }

      if (payload?.type === "NB") {
        addNoBallRunData(state, payload);
        return;
      }

      if (payload?.type === "LB") {
        addLBRunData(state, payload);
        return;
      }

      if (payload?.type === "BYE") {
        addByeRunData(state, payload);
        return;
      }
    },
  },
});

export const { recordDelivery, setCurrentMatchData } = scoreSlice.actions;

export default scoreSlice.reducer;
