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
    setCurrentMatchData: (state, action) => {
      state.currentMatchData = action.payload;
    },
   addRuns: (state, action) => {
  const payload = action.payload;

  
  // UNDO
  
  if (payload === "UNDO") {
    undoMatch(state);
    return;
  }

  
  // SWAP
  
  if (payload === "SWAP") {
    // Save state BEFORE changing it
    saveHistory(state);

    swapStriker(state);

    return;
  }

  
  // CURRENT INNING
  
  const currentInning =
    state.currentMatchData.innings[
      state.currentMatchData.currentInning - 1
    ];

  
  // HANDLE EXTRAS
  
  if (["WD", "NB", "LB", "BYE"].includes(payload?.type)) {
    const {
      type,
      runs = 0,
      runType,
    } = payload;

    const additionalRuns = Number(runs) || 0;

    // Save state BEFORE changing it
    saveHistory(state);

    
    // WIDE
    
    if (type === "WD") {
      const wideRun = Number(state.currentMatchData.wideBallRun) || 1;

      // Total wide runs
      const totalWideRuns = wideRun + additionalRuns;

      // Main team score
      currentInning.runs += totalWideRuns;

      // Wide extras
      currentInning.extras.wideBallRun += totalWideRuns;

      // Wide is NOT a legal ball
      // legalBalls does not increase

      // Bowler concedes all wide runs
      const bowler =
        state.currentMatchData.currentPlayers.bowler;

      bowler.bowlingStats.runs += totalWideRuns;

      // Economy
      const bowlerStats = bowler.bowlingStats;

      bowlerStats.economy =
        bowlerStats.balls > 0
          ? (bowlerStats.runs * 6) / bowlerStats.balls
          : 0;

     

      return;
    }

    
    // NO BALL
    
    if (type === "NB") {
      const noBallRun =
        Number(state.currentMatchData.noBallRun) || 1;

      
      // No-ball penalty
      
      currentInning.runs += noBallRun;

      currentInning.extras.noBallRun += noBallRun;

      // Bowler concedes the no-ball penalty
      const bowler =
        state.currentMatchData.currentPlayers.bowler;

      bowler.bowlingStats.runs += noBallRun;

      
      // Additional runs
      
      if (additionalRuns > 0) {
        // All additional runs increase team score
        currentInning.runs += additionalRuns;

        
        // BAT
        
        if (runType === "BAT") {
          const striker =
            state.currentMatchData.currentPlayers.striker;

          striker.battingStats.runs += additionalRuns;

          // Batter gets the runs
          if (additionalRuns === 4) {
            striker.battingStats.fours += 1;
          }

          if (additionalRuns === 6) {
            striker.battingStats.sixes += 1;
          }

          // Strike rate
          const batsmanStats = striker.battingStats;

          batsmanStats.strikeRate =
            batsmanStats.balls > 0
              ? (batsmanStats.runs * 100) / batsmanStats.balls
              : 0;
        }

        
        // BYE
        
        if (runType === "BYE") {
          currentInning.extras.byes += additionalRuns;
        }

        
        // LEG BYE
        
        if (runType === "LB") {
          currentInning.extras.legByes += additionalRuns;
        }

        
        // Bowler runs
        
        // Bowler is charged with:
        // - No-ball penalty
        // - BAT runs
        //
        // Bowler is NOT charged with:
        // - Bye
        // - Leg-bye
        if (runType === "BAT") {
          bowler.bowlingStats.runs += additionalRuns;
        }
      }

      // No-ball is NOT a legal ball
      // legalBalls does not increase
      // bowler balls does not increase

      // Economy
      const bowlerStats = bowler.bowlingStats;

      bowlerStats.economy =
        bowlerStats.balls > 0
          ? (bowlerStats.runs * 6) / bowlerStats.balls
          : 0;

    

      return;
    }

    
    // BYE
    
    if (type === "BYE") {
      // Team score
      currentInning.runs += additionalRuns;

      // Bye extras
      currentInning.extras.byes += additionalRuns;

      // Bye IS a legal ball
      currentInning.legalBalls += 1;

      // Bowler ball count
      const bowler =
        state.currentMatchData.currentPlayers.bowler;

      bowler.bowlingStats.balls += 1;

      // Bowler does NOT get charged for bye runs
      const bowlerStats = bowler.bowlingStats;

      bowlerStats.economy =
        bowlerStats.balls > 0
          ? (bowlerStats.runs * 6) / bowlerStats.balls
          : 0;

      console.log("BYE:", {
        runs: additionalRuns,
      });

      return;
    }

    
    // LEG BYE
    
    if (type === "LB") {
      // Team score
      currentInning.runs += additionalRuns;

      // Leg-bye extras
      currentInning.extras.legByes += additionalRuns;

      // Leg bye IS a legal ball
      currentInning.legalBalls += 1;

      // Bowler ball count
      const bowler =
        state.currentMatchData.currentPlayers.bowler;

      bowler.bowlingStats.balls += 1;

      // Bowler does NOT get charged for leg-bye runs
      const bowlerStats = bowler.bowlingStats;

      bowlerStats.economy =
        bowlerStats.balls > 0
          ? (bowlerStats.runs * 6) / bowlerStats.balls
          : 0;

      console.log("LEG BYE:", {
        runs: additionalRuns,
      });

      return;
    }
  }

  
  // NORMAL RUNS
  
  if (
    ["0", "1", "2", "3", "4", "6"].includes(payload)
  ) {
    // Save state BEFORE changing it
    saveHistory(state);

    const numRuns = Number(payload);

    
    // Current inning
    
    currentInning.runs += numRuns;

    currentInning.legalBalls += 1;

    
    // Striker
    
    const striker =
      state.currentMatchData.currentPlayers.striker;

    striker.battingStats.runs += numRuns;

    striker.battingStats.balls += 1;

    
    // Strike rate
    
    const batsmanStats = striker.battingStats;

    batsmanStats.strikeRate =
      batsmanStats.balls > 0
        ? (batsmanStats.runs * 100) / batsmanStats.balls
        : 0;

    
    // Fours
    
    if (payload === "4") {
      striker.battingStats.fours += 1;
    }

    
    // Sixes
    
    if (payload === "6") {
      striker.battingStats.sixes += 1;
    }

    
    // Bowler
    
    const bowler =
      state.currentMatchData.currentPlayers.bowler;

    bowler.bowlingStats.balls += 1;

    bowler.bowlingStats.runs += numRuns;

    
    // Economy
    
    const bowlerStats = bowler.bowlingStats;

    bowlerStats.economy =
      bowlerStats.balls > 0
        ? (bowlerStats.runs * 6) / bowlerStats.balls
        : 0;

    
    // Swap after 1 or 3
    
    if (["1", "3"].includes(payload)) {
      swapStriker(state);
    }

    return;
  }
},
  },
});

export const {
  addRuns,
  setCurrentMatchData
} = scoreSlice.actions;

export default scoreSlice.reducer;