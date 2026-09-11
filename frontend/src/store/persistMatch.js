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

export const loadCurrentMatch = () => parseJson(localStorage.getItem(CURRENT_MATCH_KEY), {});

export const loadUndoStack = (matchId) => {
  const saved = parseJson(localStorage.getItem(UNDO_STACK_KEY), null);
  if (!saved || saved.matchId !== matchId || !Array.isArray(saved.stack)) {
    return [];
  }
  return saved.stack;
};

const upsertMatchHistory = (match) => {
  if (!match?.matchId) return;
  const history = parseJson(localStorage.getItem(MATCH_HISTORY_KEY), []);
  const index = history.findIndex((item) => item.matchId === match.matchId);
  if (index === -1) {
    history.push(match);
  } else {
    history[index] = match;
  }
  localStorage.setItem(MATCH_HISTORY_KEY, JSON.stringify(history));
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
    upsertMatchHistory(match);
  } catch (error) {
    console.error("Failed to persist match:", error);
    try {
      localStorage.removeItem(UNDO_STACK_KEY);
      localStorage.setItem(CURRENT_MATCH_KEY, JSON.stringify(match));
      upsertMatchHistory(match);
    } catch (retryError) {
      console.error("Failed to persist match after retry:", retryError);
    }
  }
};

export const persistMatchMiddleware = (storeApi) => (next) => (action) => {
  const result = next(action);
  if (typeof action?.type === "string" && action.type.startsWith("score_slice/")) {
    persistScoreState(storeApi.getState().score);
  }
  return result;
};
