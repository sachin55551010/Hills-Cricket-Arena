import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import {
  getAllDataInNumber,
  getAllPlayers,
  updatePlayer,
  deletePlayer,
  updatePlayerStats,
} from "../controllers/superadmin_dashboard.controller.js";
import { isSuperAdminAuthenticated } from "../middlewares/isSuperAdminAuthenticated.js";

export const superadmin_route = express.Router();

// dashboard stats
superadmin_route.get(
  "/admin-dashboard",
  isAuthenticated,
  isSuperAdminAuthenticated,
  getAllDataInNumber,
);

// ── player management ─────────────────────────────────────────────────────────
superadmin_route.get(
  "/players",
  isAuthenticated,
  isSuperAdminAuthenticated,
  getAllPlayers,
);

superadmin_route.patch(
  "/players/:playerId",
  isAuthenticated,
  isSuperAdminAuthenticated,
  updatePlayer,
);

superadmin_route.delete(
  "/players/:playerId",
  isAuthenticated,
  isSuperAdminAuthenticated,
  deletePlayer,
);

superadmin_route.patch(
  "/players/:playerId/stats",
  isAuthenticated,
  isSuperAdminAuthenticated,
  updatePlayerStats,
);
