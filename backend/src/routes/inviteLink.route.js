import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import {
  createInviteLink,
  getInviteData,
  validateInviteLink,
} from "../controllers/inviteLink.controller.js";

export const inviteLink_route = express.Router();

inviteLink_route.post(
  "/create-invite/:tournamentId/:teamId",
  isAuthenticated,
  createInviteLink
);

inviteLink_route.post("/join-team/:token", isAuthenticated, validateInviteLink);

inviteLink_route.get("/invite/:token", getInviteData);
