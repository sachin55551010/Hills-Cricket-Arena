import express from "express";
import {
  logout,
  checkAuth,
  removeProfilePic,
  updatePlayer,
  profile,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

export const user_route = express.Router();

user_route.get("/me", isAuthenticated, checkAuth);

user_route.post("/logout", logout);

user_route.patch("/update-player", isAuthenticated, updatePlayer);

user_route.get("/profile/:id", profile);

user_route.patch("/remove-photo/:playerId", isAuthenticated, removeProfilePic);
