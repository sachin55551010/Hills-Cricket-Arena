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

// Record ball-by-ball stats into the current over's history
const recordBallInOver = (state, ballData) => {
  const match = state.currentMatchData;
  const inningIndex = match?.currentInning - 1;
  const inning = match?.innings?.[inningIndex];
  if (!inning) return;

  const overHistory = inning.overHistory;
  if (!overHistory || overHistory.length === 0) return;

  const currentOver = overHistory[overHistory.length - 1];

  const ball = {
    ballNumber: currentOver.balls.length + 1,
    runs: ballData.runs || 0,
    batsmanId: match.currentPlayers?.striker?.playerId,
    batsmanName: match.currentPlayers?.striker?.name,
    bowlerId: match.currentPlayers?.bowler?.playerId,
    bowlerName: match.currentPlayers?.bowler?.name,
    type: ballData.type || "NORMAL",     // NORMAL, WD, NB, LB, BYE, WICKET
    isLegal: ballData.isLegal ?? true,
    extras: ballData.extras || 0,
    totalRuns: ballData.totalRuns ?? ballData.runs ?? 0,
    timestamp: Date.now(),
  };

  currentOver.balls.push(ball);

  // Update the over-level aggregates
  currentOver.runs += ball.totalRuns;
  if (ball.isLegal) {
    currentOver.legalBalls += 1;
  }
};

// Max wickets = configured squad size - 1, not how many players were added
const getMaxWicketsForBattingTeam = (match, battingTeamId) => {
  const isFirstTeam = match?.firstTeam?.teamId === battingTeamId;
  const squadSize = isFirstTeam
    ? (match?.firstTeamTotalPlayer ?? match?.firstTeam?.players?.length ?? 11)
    : (match?.secondTeamTotalPlayer ?? match?.secondTeam?.players?.length ?? 11);
  return Math.max(Number(squadSize) - 1, 1);
};

// Check if inning 2 target is chased or match is over
const checkMatchEnd = (state) => {
  const match = state.currentMatchData;
  if (match?.currentInning !== 2) return;

  const inning2 = match?.innings?.[1];
  if (!inning2) return;

  const target = match?.target;
  if (target === undefined || target === null) return;

  const totalOvers = match?.totalOvers ?? match?.overs ?? 0;
  const maxWickets = getMaxWicketsForBattingTeam(match, inning2.battingTeamId);
  const runs2 = inning2.runs;
  const wickets2 = inning2.wickets;
  const legalBalls2 = inning2.legalBalls;

  const chased = runs2 >= target;
  const allOut = wickets2 >= maxWickets;
  const oversCompleted = totalOvers > 0 && legalBalls2 >= totalOvers * 6;

  if (chased) {
    const wicketsLeft = maxWickets - wickets2;
    match.matchStatus = "completed";
    match.matchResult = `${inning2.battingTeam} won by ${wicketsLeft} wicket${wicketsLeft !== 1 ? "s" : ""}`;
    return;
  }

  if (allOut || oversCompleted) {
    const runsShort = target - 1 - runs2;
    match.matchStatus = "completed";
    match.matchResult = `${inning2.bowlingTeam} won by ${runsShort} run${runsShort !== 1 ? "s" : ""}`;
  }
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

  // Record ball in over history
  recordBallInOver(state, {
    runs,
    type: "NORMAL",
    isLegal: true,
    totalRuns: runs,
  });
};

// add wide runs
const addWideBallRunData = (state, data) => {
  const match = state.currentMatchData;
  const inningIndex = match?.currentInning - 1;
  const inning = match?.innings?.[inningIndex];
  const bowler = match?.currentPlayers?.bowler.bowlingStats;
  const totalRuns = match.wideBallRun + data.runs;
  inning.runs += totalRuns;
  inning.extras.wideBallRun += match.wideBallRun;
  bowler.runs += totalRuns;

  // Record ball in over history
  recordBallInOver(state, {
    runs: data.runs,
    type: "WD",
    isLegal: false,
    extras: match.wideBallRun,
    totalRuns,
  });

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
  const totalRuns = noBallRun + data.runs;

  // Add total runs to innings
  inning.runs += totalRuns;

  // Add no-ball penalty to extras
  inning.extras.noBallRun += noBallRun;

  // Bowler is charged with no-ball + BAT runs
  // BYE and LB are not charged to bowler
  bowler.runs += noBallRun;

  switch (data.runType) {
    case "BAT":
      // Runs scored by the batsman
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

  // Record ball in over history
  recordBallInOver(state, {
    runs: data.runs,
    type: "NB",
    isLegal: false,
    extras: noBallRun,
    totalRuns,
  });
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

  // Record ball in over history
  recordBallInOver(state, {
    runs,
    type: "LB",
    isLegal: true,
    extras: runs,
    totalRuns: runs,
  });

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

  // 1. Add bye runs to main innings score
  inning.runs += runs;
  inning.legalBalls += 1;
  // 2. Add bye runs to extras
  inning.extras.byes += runs;

  bowler.balls += 1;

  // Record ball in over history
  recordBallInOver(state, {
    runs,
    type: "BYE",
    isLegal: true,
    extras: runs,
    totalRuns: runs,
  });

  // 4. Change strike for 1 or 3 bye runs
  if (runs === 1 || runs === 3) {
    swapStriker(state);
  }
};

// Handle wicket/out deliveries
const recordWicketData = (state, data) => {
  const match = state.currentMatchData;
  const inningIndex = match?.currentInning - 1;
  const inning = match?.innings?.[inningIndex];
  const bowler = match?.currentPlayers?.bowler?.bowlingStats;
  const striker = match?.currentPlayers?.striker;
  const nonStriker = match?.currentPlayers?.nonStriker;
  if (!match || !inning || !bowler) return;

  const wicketType = data.wicketType;
  const completedRuns = data.completedRuns || 0;
  const playerOutId = data.playerOut?.id;
  const newBatsman = data.newBatsman;
  const newPlayerPosition = data.newPlayerPosition || "striker";

  // Determine if this is a legal delivery (Run Out on a no-ball is not legal)
  const isExtraWicket = data.isExtraWicket;
  const isLegalDelivery = !isExtraWicket;
  const extraType = data.type; // "WD", "NB", "LB", "BYE" or undefined

  // --- Dismissal types where bowler gets credit ---
  const bowlerGetsCreditTypes = ["Bowled", "Caught", "LBW", "Stumped", "Hit Wicket"];
  const bowlerGetsCredit = bowlerGetsCreditTypes.includes(wicketType);

  // 1. Update innings wickets
  inning.wickets += 1;

  // 2. Update innings runs (completed runs before dismissal)
  inning.runs += completedRuns;

  // 2a. Handle extra penalty runs (wide/no-ball/bye/leg-bye)
  let extraPenaltyRuns = 0;
  if (isExtraWicket && extraType) {
    const extraRuns = data.runs || 0; // bat/bye runs on the extra delivery

    if (extraType === "WD") {
      const widePenalty = match.wideBallRun || 1;
      extraPenaltyRuns = widePenalty + extraRuns;
      inning.runs += extraPenaltyRuns;
      inning.extras.wideBallRun += widePenalty;
      bowler.runs += extraPenaltyRuns;
    } else if (extraType === "NB") {
      const noBallPenalty = match.noBallRun || 1;
      extraPenaltyRuns = noBallPenalty + extraRuns;
      inning.runs += extraPenaltyRuns;
      inning.extras.noBallRun += noBallPenalty;
      bowler.runs += noBallPenalty;
      // Bat runs on NB are charged to bowler, bye/LB on NB are not
      if (data.runType === "BAT") {
        bowler.runs += extraRuns;
      }
    } else if (extraType === "LB") {
      extraPenaltyRuns = extraRuns;
      inning.runs += extraPenaltyRuns;
      inning.extras.legBye = (inning.extras.legBye || 0) + extraRuns;
    } else if (extraType === "BYE") {
      extraPenaltyRuns = extraRuns;
      inning.runs += extraPenaltyRuns;
      inning.extras.byes = (inning.extras.byes || 0) + extraRuns;
    }
  }

  // 3. Legal ball counting
  if (isLegalDelivery) {
    inning.legalBalls += 1;
    bowler.balls += 1;
  }

  // 4. Bowler stats
  if (bowlerGetsCredit) {
    bowler.wickets += 1;
  }
  bowler.runs += completedRuns;
  bowler.economy = bowler.balls > 0 ? (bowler.runs / bowler.balls) * 6 : 0;

  // 5. Update striker batting stats if they scored completed runs
  if (completedRuns > 0) {
    const outPlayerIsStriker = playerOutId === (striker?.playerId || striker?.id);
    const batsmanStats = outPlayerIsStriker
      ? striker?.battingStats
      : nonStriker?.battingStats;
    if (batsmanStats) {
      batsmanStats.runs += completedRuns;
      batsmanStats.fours += completedRuns === 4 ? 1 : 0;
      batsmanStats.sixes += completedRuns === 6 ? 1 : 0;
      batsmanStats.strikeRate =
        batsmanStats.balls > 0 ? (batsmanStats.runs / batsmanStats.balls) * 100 : 0;
    }
  }

  // 6. Count the ball faced by striker (if legal and not run out of non-striker)
  if (isLegalDelivery) {
    const outPlayerIsStriker = playerOutId === (striker?.playerId || striker?.id);
    // For most dismissals, striker faces the ball
    if (striker?.battingStats) {
      striker.battingStats.balls += 1;
      striker.battingStats.strikeRate =
        striker.battingStats.balls > 0
          ? (striker.battingStats.runs / striker.battingStats.balls) * 100
          : 0;
    }
  }

  // 7. Record ball in over history
  const ballTotalRuns = completedRuns + extraPenaltyRuns;
  recordBallInOver(state, {
    runs: completedRuns,
    type: "WICKET",
    isLegal: isLegalDelivery,
    extras: extraPenaltyRuns,
    totalRuns: ballTotalRuns,
  });

  // 8. Add dismissed player to outPlayers list
  const outPlayerIsStriker = playerOutId === (striker?.playerId || striker?.id);
  const dismissedPlayer = outPlayerIsStriker ? striker : nonStriker;

  inning.outPlayers.push({
    playerId: playerOutId,
    name: dismissedPlayer?.name || data.playerOut?.name,
    battingStats: { ...(dismissedPlayer?.battingStats || {}) },
    wicketType,
    fielder: data.fielder || null,
    bowlerName: match.currentPlayers?.bowler?.name,
    bowlerId: match.currentPlayers?.bowler?.playerId,
  });

  // 9. Replace dismissed player with new batsman
  if (newBatsman) {
    if (outPlayerIsStriker) {
      // Striker got out
      if (newPlayerPosition === "striker") {
        match.currentPlayers.striker = newBatsman;
      } else {
        // New batsman goes to non-striker, current non-striker becomes striker
        match.currentPlayers.striker = match.currentPlayers.nonStriker;
        match.currentPlayers.nonStriker = newBatsman;
      }
    } else {
      // Non-striker got out (run out)
      if (newPlayerPosition === "nonStriker") {
        match.currentPlayers.nonStriker = newBatsman;
      } else {
        // New batsman takes strike, current striker goes to non-striker
        match.currentPlayers.nonStriker = match.currentPlayers.striker;
        match.currentPlayers.striker = newBatsman;
      }
    }
  }

  // 10. Handle strike changes for completed runs (odd runs swap strike)
  if (completedRuns === 1 || completedRuns === 3 || completedRuns === 5) {
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

        checkMatchEnd(state);
        return;
      }

      if (payload?.type === "WD" && !payload?.wicket) {
        addWideBallRunData(state, payload);
        checkMatchEnd(state);
        return;
      }

      if (payload?.type === "NB" && !payload?.wicket) {
        addNoBallRunData(state, payload);
        checkMatchEnd(state);
        return;
      }

      if (payload?.type === "LB" && !payload?.wicket) {
        addLBRunData(state, payload);
        checkMatchEnd(state);
        return;
      }

      if (payload?.type === "BYE" && !payload?.wicket) {
        addByeRunData(state, payload);
        checkMatchEnd(state);
        return;
      }

      // Wicket (normal or extra+wicket)
      if (payload?.wicket) {
        recordWicketData(state, payload);
        checkMatchEnd(state);
        return;
      }
    },
    setNewBowler: (state, action) => {
      const newBowler = action.payload;
      const match = state.currentMatchData;
      const inningIndex = match?.currentInning - 1;
      const inning = match?.innings?.[inningIndex];
      if (!match || !inning) return;

      // Save history before making changes
      saveHistory(state);

      // Set the new bowler in currentPlayers
      match.currentPlayers.bowler = newBowler;

      // Swap striker (batsmen change ends at end of over)
      swapStriker(state);

      // Create a new over entry in overHistory
      const newOverNumber = inning.overHistory.length + 1;
      inning.overHistory.push({
        over: newOverNumber,
        bowlerId: newBowler.playerId,
        batsmanId: match.currentPlayers.striker.playerId,
        balls: [],
        runs: 0,
        legalBalls: 0,
      });
    },
    retireBatsman: (state, action) => {
      const { retiringPosition, retireType, newBatsman } = action.payload;
      const match = state.currentMatchData;
      const inningIndex = match?.currentInning - 1;
      const inning = match?.innings?.[inningIndex];
      if (!match || !inning) return;

      saveHistory(state);

      // Deep clone the retiring player to preserve their full stats
      const retiringPlayer = JSON.parse(
        JSON.stringify(match.currentPlayers[retiringPosition]),
      );

      if (retireType === "retired-out") {
        inning.wickets += 1;
        inning.outPlayers.push({
          playerId: retiringPlayer?.playerId || retiringPlayer?.id,
          name: retiringPlayer?.name,
          battingStats: { ...(retiringPlayer?.battingStats || {}) },
          wicketType: "Retired Out",
          fielder: null,
          bowlerName: null,
          bowlerId: null,
        });
      } else {
        // Retire Hurt — save FULL player object so stats are preserved
        if (!inning.retiredHurtPlayers) {
          inning.retiredHurtPlayers = [];
        }
        inning.retiredHurtPlayers.push(retiringPlayer);
      }

      // Determine who the actual new batsman is
      if (newBatsman) {
        const newBatsmanId = newBatsman.playerId || newBatsman.id;

        // Check if this new batsman is a returning retired-hurt player
        // If so, use the SAVED version (with match stats) instead of whatever the modal sent
        let playerToSet = newBatsman;
        if (inning.retiredHurtPlayers && inning.retiredHurtPlayers.length > 0) {
          const savedPlayer = inning.retiredHurtPlayers.find(
            (p) => (p.playerId || p.id) === newBatsmanId,
          );
          if (savedPlayer) {
            // Use the saved player with their accumulated stats
            playerToSet = JSON.parse(JSON.stringify(savedPlayer));
          }
        }

        // Remove the returning player from retiredHurtPlayers
        if (inning.retiredHurtPlayers) {
          inning.retiredHurtPlayers = inning.retiredHurtPlayers.filter(
            (p) => (p.playerId || p.id) !== newBatsmanId,
          );
        }

        match.currentPlayers[retiringPosition] = playerToSet;
      }
    },
    replaceBatsman: (state, action) => {
      const { position, newBatsman } = action.payload;
      const match = state.currentMatchData;
      const inningIndex = match?.currentInning - 1;
      const inning = match?.innings?.[inningIndex];
      if (!match) return;

      saveHistory(state);

      if (newBatsman) {
        const newBatsmanId = newBatsman.playerId || newBatsman.id;

        // Check if this new batsman is a returning retired-hurt player
        // If so, use the SAVED version (with match stats) instead of the roster version
        let playerToSet = newBatsman;
        if (inning?.retiredHurtPlayers && inning.retiredHurtPlayers.length > 0) {
          const savedPlayer = inning.retiredHurtPlayers.find(
            (p) => (p.playerId || p.id) === newBatsmanId,
          );
          if (savedPlayer) {
            playerToSet = JSON.parse(JSON.stringify(savedPlayer));
          }
        }

        // Remove the returning player from retiredHurtPlayers
        if (inning?.retiredHurtPlayers) {
          inning.retiredHurtPlayers = inning.retiredHurtPlayers.filter(
            (p) => (p.playerId || p.id) !== newBatsmanId,
          );
        }

        match.currentPlayers[position] = playerToSet;
      }
    },
    startSecondInning: (state, action) => {
      const { striker, nonStriker, bowler, newBattingTeamId, newBowlingTeamId, newBattingTeamName, newBowlingTeamName } = action.payload;
      const match = state.currentMatchData;
      if (!match) return;

      saveHistory(state);

      const inning1 = match.innings?.[0];
      if (!inning1) return;

      // Calculate target = inning1 runs + 1
      const target = inning1.runs + 1;
      match.target = target;

      // Set up second inning
      const totalOvers = match.totalOvers ?? match.overs ?? 0;
      const inning2 = {
        inning: 2,
        runs: 0,
        wickets: 0,
        legalBalls: 0,
        battingTeam: newBattingTeamName,
        bowlingTeam: newBowlingTeamName,
        battingTeamId: newBattingTeamId,
        bowlingTeamId: newBowlingTeamId,
        extras: {
          wideBallRun: 0,
          noBallRun: 0,
          byes: 0,
          legByes: 0,
          overthrow: 0,
        },
        outPlayers: [],
        retiredHurtPlayers: [],
        overHistory: [
          {
            over: 1,
            bowlerId: bowler.playerId,
            batsmanId: striker.playerId,
            balls: [],
            runs: 0,
            legalBalls: 0,
          },
        ],
      };

      // Append inning 2 (keep inning 1 intact for scorecard)
      match.innings = [inning1, inning2];

      // Switch current inning
      match.currentInning = 2;

      // Set players: opening batsmen from the new batting team, new bowler
      match.currentPlayers = { striker, nonStriker, bowler };

      // maxWickets = configured squad size - 1 (not players added to the team)
      match.maxWickets = getMaxWicketsForBattingTeam(match, newBattingTeamId);

      match.matchStatus = "second_inning";
    },
  },
});

export const {
  recordDelivery,
  setCurrentMatchData,
  setNewBowler,
  retireBatsman,
  replaceBatsman,
  startSecondInning,
} = scoreSlice.actions;

export default scoreSlice.reducer;
