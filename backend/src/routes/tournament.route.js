import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import {
  addTournament,
  deleteTournament,
  getAllTournaments,
  getMyTournaments,
  getTournamentInfo,
  updateTournamentInfo,
  uploadTournamentImages,
  superAdminUpdateTournament,
  superAdminDeleteTournament,
} from "../controllers/tournament.controller.js";
import { isSuperAdminAuthenticated } from "../middlewares/isSuperAdminAuthenticated.js";

export const tournament_route = express.Router();

tournament_route.post("/add-tournament", isAuthenticated, addTournament);

tournament_route.get("/my-tournaments", isAuthenticated, getMyTournaments);

tournament_route.get("/my-tournaments/:tournamentId", getTournamentInfo);

tournament_route.patch(
  "/update-tournament/:tournamentId",
  isAuthenticated,
  updateTournamentInfo,
);

tournament_route.delete(
  "/delete-tournament/:tournamentId",
  isAuthenticated,
  deleteTournament,
);

tournament_route.get("/all-tournaments/:tournamentCategory", getAllTournaments);

tournament_route.patch(
  "/upload-images/:tournamentId",
  isAuthenticated,
  uploadTournamentImages,
);

// ── Super Admin routes (bypass ownership + status checks) ───────────────
tournament_route.patch(
  "/superadmin-update/:tournamentId",
  isAuthenticated,
  isSuperAdminAuthenticated,
  superAdminUpdateTournament,
);

tournament_route.delete(
  "/superadmin-delete/:tournamentId",
  isAuthenticated,
  isSuperAdminAuthenticated,
  superAdminDeleteTournament,
);
