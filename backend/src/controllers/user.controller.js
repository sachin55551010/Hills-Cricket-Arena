import mongoose from "mongoose";
import { Player } from "../models/playerSchema.js";
import { Tournament } from "../models/tournamentSchema.js";
import cloudinary from "../utils/cloudinary.js";
import { CustomErrHandler } from "../utils/CustomErrHandler.js";

export const checkAuth = async (req, res, next) => {
  try {
    const { id } = req.user;
    const player = await Player.findById(id).populate("playerId");
    if (!player) return next(new CustomErrHandler(404, "User not found"));

    const myTournament = await Tournament.find({ createdBy: id });
    if (
      !myTournament ||
      myTournament.length === 0 ||
      myTournament === undefined
    ) {
      await Player.findByIdAndUpdate(id, { role: "user" });
    }

    return res.status(200).json({ player, success: true });
  } catch (error) {
    console.log("MyProfile error : ", error);
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    return res
      .clearCookie("crickAuthToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development" ? false : true,
        sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      })
      .status(200)
      .json({ message: "Logout successfully", success: true });
  } catch (error) {
    console.log("Logout error : ", error);
    next(error);
  }
};

export const updatePlayer = async (req, res, next) => {
  try {
    let {
      profilePicture,
      playerName,
      number,
      gender,
      dateOfBirth,
      playingRole,
      battingStyle,
      bowlingStyle,
      playerId,
    } = req.body;

    if (playerId !== req.user.id)
      return next(new CustomErrHandler(403, "unatherised or invalid request"));
    let player = await Player.findById(req.user.id);

    

    if (
      req.body.profilePicture &&
      req.body.profilePicture.startsWith("data:image")
    ) {
      const uploadResponse = await cloudinary.uploader.upload(profilePicture, {
        folder: "players_img",
      });
      profilePicture = uploadResponse.secure_url;
    }

    const checkDuplicateNumber = await Player.findOne({
      number,
      _id: { $ne: req.user.id },
    });
    if (checkDuplicateNumber)
      return next(
        new CustomErrHandler(
          400,
          "This Number is already in used with different account! please enter different number"
        )
      );
    player = await Player.findByIdAndUpdate(
      player._id,
      {
        profilePicture: profilePicture,
        playerName: playerName || "",
        gender: gender || "",
        number: number || "",
        dateOfBirth: dateOfBirth || "",
        playingRole: playingRole || "",
        battingStyle: battingStyle || "",
        bowlingStyle: bowlingStyle || "",
      },
      { new: true }
    ).populate("playerId");

    return res
      .status(201)
      .json({ player, success: true, message: "Profile Updated Successfully" });
  } catch (error) {
    console.log("Edit profile error : ", error);
    next(error);
  }
};

export const removeProfilePic = async (req, res, next) => {
  try {
    const { playerId } = req.params;
    if (!playerId || !mongoose.Types.ObjectId.isValid(playerId))
      return next(
        new CustomErrHandler(404, "No user found or invalid user id")
      );

    if (req.user.id !== playerId)
      return next(
        new CustomErrHandler(400, "Unatherised request. Access denied!")
      );

    await Player.findByIdAndUpdate(
      req.user.id,
      { profilePicture: "" },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "profile picture removed",
    });
  } catch (error) {
    next(error);
  }
};

export const profile = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id))
      // mongoose.Types.ObjectId.isValid(id) is used to prevent error if frontend sending nothing in id and "undefined" id truthy value
      return next(new CustomErrHandler(403, "Unautherized request"));
    const playerProfile = await Player.findById(id);

    if (!playerProfile)
      return next(new CustomErrHandler(403, "No profile found"));
    return res.status(200).json({ playerProfile, success: true });
  } catch (error) {
    console.log("Profile error : ", error);
    next(error);
  }
};
