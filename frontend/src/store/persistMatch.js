const CURRENT_MATCH_KEY = "currentMatch";
const MATCH_HISTORY_KEY = "matchHistory";
const UNDO_STACK_KEY = "currentMatchUndoStack";
const MAX_UNDO_SNAPSHOTS = 80;

const parseJson = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export const loadCurrentMatch = () =>
  parseJson(localStorage.getItem(CURRENT_MATCH_KEY), {});

export const loadUndoStack = (matchId) => {
  const saved = parseJson(localStorage.getItem(UNDO_STACK_KEY), null);
  if (!saved || saved.matchId !== matchId || !Array.isArray(saved.stack)) {
    return [];
  }
  return saved.stack;
};

export const upsertMatchHistory = (match) => {
  if (!match?.matchId) return;
  const history = parseJson(localStorage.getItem(MATCH_HISTORY_KEY), []);
  const updatedHistory = history.filter(
    (item) => item.matchId !== match.matchId,
  );
  updatedHistory.push(match);
  localStorage.setItem(MATCH_HISTORY_KEY, JSON.stringify(updatedHistory));
};

const persistUpdatedTeamPlayers = (match) => {
  if (!match?.careerStatsApplied) return;

  const teams = parseJson(localStorage.getItem("localTeams"), []);
  if (!Array.isArray(teams)) return;

  const updatedTeams = teams.map((team) => {
    const matchTeam = [match.firstTeam, match.secondTeam].find(
      (candidate) => candidate?.teamId === team.teamId,
    );
    if (!matchTeam) return team;

    const updatedPlayers = (team.players || []).map((player) => {
      const updatedPlayer = (matchTeam.players || []).find(
        (candidate) =>
          (candidate.playerId || candidate.id) ===
          (player.playerId || player.id),
      );
      return updatedPlayer || player;
    });

    return { ...team, players: updatedPlayers };
  });

  localStorage.setItem("localTeams", JSON.stringify(updatedTeams));
};

export const persistScoreState = (scoreState) => {
  const match = scoreState?.currentMatchData;
  if (!match || typeof match !== "object" || Object.keys(match).length === 0) {
    return;
  }

  const undoStack = (scoreState.matchHistory || []).slice(-MAX_UNDO_SNAPSHOTS);

  try {
    localStorage.setItem(CURRENT_MATCH_KEY, JSON.stringify(match));
    localStorage.setItem(
      UNDO_STACK_KEY,
      JSON.stringify({ matchId: match.matchId, stack: undoStack }),
    );
    persistUpdatedTeamPlayers(match);
    upsertMatchHistory(match);
  } catch (error) {
    console.error("Failed to persist match:", error);
    try {
      localStorage.removeItem(UNDO_STACK_KEY);
      localStorage.setItem(CURRENT_MATCH_KEY, JSON.stringify(match));
      persistUpdatedTeamPlayers(match);
      upsertMatchHistory(match);
    } catch (retryError) {
      console.error("Failed to persist match after retry:", retryError);
    }
  }
};

export const persistMatchMiddleware = (storeApi) => (next) => (action) => {
  const result = next(action);
  if (
    typeof action?.type === "string" &&
    action.type.startsWith("score_slice/")
  ) {
    persistScoreState(storeApi.getState().score);
  }
  return result;
};
