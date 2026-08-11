import crypto from "crypto";
import { InviteLink } from "../models/inviteLinkSchema.js";
import { CustomErrHandler } from "../utils/CustomErrHandler.js";
import { Team } from "../models/teamSchema.js";
import mongoose from "mongoose";

export const createInviteLink = async (req, res, next) => {
  try {
    const { tournamentId, teamId } = req.params;

    if (!teamId || !mongoose.Types.ObjectId.isValid(teamId))
      return next(new CustomErrHandler(404, "No team found !"));

    if (!tournamentId || !mongoose.Types.ObjectId.isValid(tournamentId))
      return next(new CustomErrHandler(400, "No tournament found !"));
    const token = crypto.randomBytes(32).toString("hex");

    const checkLinkExists = await InviteLink.findOne({ teamId });

    if (checkLinkExists) {
      const inviteLinkUrl = `${process.env.FRONTEND_URL}/join-team/${checkLinkExists.token}`;
      return res.status(200).json(inviteLinkUrl);
    }
    if (!req.user.id)
      return next(new CustomErrHandler(403, "Unatherized access"));

    await InviteLink.create({
      token,
      teamId,
      tournamentId,
      createdBy: req.user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });

    const inviteLinkUrl = `${process.env.FRONTEND_URL}/join-team/${token}`;
    return res.status(201).json(inviteLinkUrl);
  } catch (error) {
    console.log("create Invite link : ", error);
    next(error);
  }
};

// function to validate link
// check token validation and expire link
export const validateInviteLink = async (req, res, next) => {
  try {
    const { token } = req.params;

    if (!token) return next(new CustomErrHandler(400, "No token token"));
    const inviteLink = await InviteLink.findOne({ token });

    if (!inviteLink) return next(new CustomErrHandler(400, "link not found"));

    const isPlayerAlreadyExists = await Team.exists({
      tournamentId: inviteLink.tournamentId,
      "teamPlayers.player": req.user.id,
    });

    if (isPlayerAlreadyExists) {
      if (isPlayerAlreadyExists._id.equals(inviteLink.teamId)) {
        return next(new CustomErrHandler(400, "You are already in this team"));
      } else {
        return next(
          new CustomErrHandler(400, "You are already in a different team"),
        );
      }
    }

    await Team.updateOne(
      { _id: inviteLink.teamId },
      { $push: { teamPlayers: { player: req.user.id } } },
    );

    return res.status(201).json({
      success: true,
      message: "Added in team successfully",
    });
  } catch (error) {
    console.log("validate token error : ", error);
    next(error);
  }
};

//get token data function
export const getInviteData = async (req, res, next) => {
  try {
    const { token } = req.params;

    if (!token) return next(new CustomErrHandler(404, "token not found !"));

    const inviteData = await InviteLink.findOne({ token })
      .populate("teamId", "teamName teamPlayers")
      .populate(
        "tournamentId",
        "tournamentName organiserName city ground startDate endDate",
      )
      .populate("createdBy", "playerName profilePicture ");

    if (!inviteData)
      return next(new CustomErrHandler(404, "Invalid or expired token"));

    if (token !== inviteData.token)
      return next(new CustomErrHandler(404, "Invalid or expired link"));
    return res.status(200).json(inviteData);
  } catch (error) {
    console.log("get invite data error ", error);
    next(error);
  }
};
