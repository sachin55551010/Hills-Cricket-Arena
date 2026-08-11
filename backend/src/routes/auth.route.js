import express from "express";
import passport from "passport";
import { sendCookies } from "../utils/sendCookies.js";
export const auth_router = express.Router();

auth_router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

auth_router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    sendCookies(req.user, res);
    res.redirect(process.env.FRONTEND_URL);
  },
);
