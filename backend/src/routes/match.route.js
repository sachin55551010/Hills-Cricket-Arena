import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import {
  createMatch,
  getAllMatches,
  getMatchById,
  myTournamentMatches,
  scheduleMatch,
} from "../controllers/match.controller.js";

export const match_route = express.Router();

match_route.post(
  "/create-match/:tournamentId/matches",
  isAuthenticated,
  createMatch,
);

match_route.post(
  "/schedule-match/:tournamentId/matches",
  isAuthenticated,
  scheduleMatch,
);

match_route.get("/tournament-matches/:tournamentId", myTournamentMatches);

// match_route.patch("/update-match/:matchId")
match_route.get("/all-matches/:tournamentCategory", getAllMatches);

match_route.get("/match/:matchId", getMatchById);
