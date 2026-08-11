import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { createPlayer } from "../controllers/player.controller.js";

export const player_router = express.Router();

player_router.post("/create-player", isAuthenticated, createPlayer);
