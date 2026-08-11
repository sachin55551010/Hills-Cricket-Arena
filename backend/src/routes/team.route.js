import express from "express";
import {
  createTeam,
  getTeamById,
  deleteTeam,
  getTeamPlayers,
  getTeamsByTournament,
  updateTeam,
  updateTeamPlayerRole,
  removePlayerFromTeam,
} from "../controllers/team.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

export const team_route = express.Router();

team_route.post("/create-team/:tournamentId", isAuthenticated, createTeam);

team_route.get("/my-tournament-teams/:tournamentId", getTeamsByTournament);

team_route.get("/team-players/:teamId", getTeamPlayers);

team_route.get("/get-team/:teamId", getTeamById);
team_route.patch(
  "/update-team/:tournamentId/:teamId",
  isAuthenticated,
  updateTeam,
);
team_route.delete(
  "/delete-team/:tournamentId/:teamId",
  isAuthenticated,
  deleteTeam,
);

team_route.patch(
  "/update-team-player-role/:teamId/:playerId",
  isAuthenticated,
  updateTeamPlayerRole,
);

team_route.delete(
  "/remove-player-from-team/:tournamentId/:teamId/:playerId",
  isAuthenticated,
  removePlayerFromTeam,
);
