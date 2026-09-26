import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { getAllDataInNumber } from "../controllers/superadmin_dashboard.controller.js";
import { isSuperAdminAuthenticated } from "../middlewares/isSuperAdminAuthenticated.js";

export const superadmin_route = express.Router();

superadmin_route.get(
  "/admin-dashboard",
  isAuthenticated,
  isSuperAdminAuthenticated,
  getAllDataInNumber,
);
