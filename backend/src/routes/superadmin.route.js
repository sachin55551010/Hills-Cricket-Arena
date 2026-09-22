import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { superAdminDashboard } from "../controllers/superadmin_dashboard.controller.js";
import { isSuperAdminAuthenticated } from "../middlewares/isSuperAdminAuthenticated.js";

export const superadmin_route = express.Router();

superadmin_route.get(
  "/dashboard",
  isAuthenticated,
  isSuperAdminAuthenticated,
  superAdminDashboard,
);
