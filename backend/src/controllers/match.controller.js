import mongoose from "mongoose";
import { CustomErrHandler } from "../utils/CustomErrHandler.js";
import { Match } from "../models/matchSchema.js";
import { Tournament } from "../models/tournamentSchema.js";
import { io } from "../utils/socket.js";

export const createMatch = async (req, res, next) => {
  try {
    const { tournamentId } = req.params;
    const {
      firstTeamId,
      secondTeamId,
      overs,
      tossWinnerTeamId,
      decision,
      round,
    } = req.body;

    if (!tournamentId || !mongoose.Types.ObjectId.isValid(tournamentId))
      return next(new CustomErrHandler(404, "Invalid tournament id"));

    if (!firstTeamId || !mongoose.Types.ObjectId.isValid(firstTeamId))
      return next(new CustomErrHandler(404, "Invalid first team id"));

    if (!secondTeamId || !mongoose.Types.ObjectId.isValid(secondTeamId))
      return next(new CustomErrHandler(404, "Invalid second team id"));

    const tournament = await Tournament.findById(tournamentId);

    if (!tournament.createdBy._id.equals(req.user.id))
      return next(new CustomErrHandler(403, "Unauthorized access"));

    if (
      !firstTeamId?.trim() ||
      !secondTeamId?.trim() ||
      !overs ||
      !tossWinnerTeamId ||
      !decision ||
      !round
    )
      return next(new CustomErrHandler(400, "All fields are required"));

    if (firstTeamId === secondTeamId)
      return next(new CustomErrHandler(400, "Both teams cannot be same"));

    // ✅ Create match
    const createdMatch = await Match.create({
      tournamentId,
      firstTeamId,
      secondTeamId,
      overs,
      tossWinnerTeamId,
      decision,
      round,
    });

    // ✅ Populate required UI fields
    const populatedMatch = await Match.findById(createdMatch._id)
      .populate("firstTeamId", "teamName teamLogo")
      .populate("secondTeamId", "teamName teamLogo")
      .populate("tournamentId", "tournamentName ground city matchScheduleDate");

    // ✅ Transform data for frontend
    const formattedMatch = {
      _id: populatedMatch._id,
      firstTeamId: {
        teamName: populatedMatch.firstTeamId.teamName,
        teamLogo: populatedMatch.firstTeamId.teamLogo,
      },
      secondTeamId: {
        teamName: populatedMatch.secondTeamId.teamName,
        teamLogo: populatedMatch.secondTeamId.teamLogo,
      },
      tournamentId: {
        tournamentName: populatedMatch.tournamentId.tournamentName,
        ground: populatedMatch.tournamentId.ground,
        city: populatedMatch.tournamentId.city,
      },
      matchScheduleDate: populatedMatch.tournamentId.matchScheduleDate,
      status: populatedMatch.status,
      overs: populatedMatch.overs,
      round: populatedMatch.round,
    };

    // ✅ Emit populated data
    io.emit("newMatch", formattedMatch);

    return res.status(201).json({
      success: true,
      match: formattedMatch,
    });
  } catch (error) {
    console.log("Create match error:", error);
    next(error);
  }
};

export const scheduleMatch = async (req, res, next) => {
  try {
    const { tournamentId } = req.params;
    const { firstTeamId, secondTeamId, overs, matchScheduleDate, round } =
      req.body;

    if (
      !firstTeamId?.trim() ||
      !secondTeamId?.trim() ||
      !overs ||
      !matchScheduleDate ||
      !round
    )
      return next(new CustomErrHandler(400, "All fields are required"));
    if (!tournamentId || !mongoose.Types.ObjectId.isValid(tournamentId))
      return next(new CustomErrHandler(400, "No tournament found"));
    if (!firstTeamId || !mongoose.Types.ObjectId.isValid(firstTeamId))
      return next(
        new CustomErrHandler(404, "no first team id found or invalid team id"),
      );
    if (!secondTeamId || !mongoose.Types.ObjectId.isValid(secondTeamId))
      return next(
        new CustomErrHandler(404, "no second team id found or invalid team id"),
      );
    const organiserId = await Tournament.findById(tournamentId);
    if (!organiserId.createdBy.equals(req.user.id))
      return next(
        new CustomErrHandler(403, "Unautherised request Access denied"),
      );
    if (firstTeamId === secondTeamId)
      return next(new CustomErrHandler(400, "Both teams cannot be same"));
    const checkIsMatchAlreadyExists = await Match.findOne({
      $or: [
        { firstTeamId, secondTeamId },
        { firstTeamId: secondTeamId, secondTeamId: firstTeamId },
      ],
    })
      .populate("firstTeamId", "teamName")
      .populate("secondTeamId", "teamName");

    if (checkIsMatchAlreadyExists && checkIsMatchAlreadyExists.round === round)
      return next(
        new CustomErrHandler(
          403,
          `A ${checkIsMatchAlreadyExists.round} match between ${checkIsMatchAlreadyExists.firstTeamId.teamName} and ${checkIsMatchAlreadyExists.secondTeamId.teamName} already schedule. Please choose a different round or schedule another match.`,
        ),
      );
    const match = await Match.create({
      tournamentId,
      firstTeamId,
      secondTeamId,
      overs,
      matchScheduleDate,
      round,
      createdBy: req.user.id,
    });

    return res
      .status(201)
      .json({ match, success: true, message: "Match Schedule successfully" });
  } catch (error) {
    console.log("Schedule Match error : ", error);
    next(error);
  }
};

//get all matches from specific tournament
export const myTournamentMatches = async (req, res, next) => {
  try {
    const { tournamentId } = req.params;

    if (!tournamentId || !mongoose.Types.ObjectId.isValid(tournamentId)) {
      return next(new CustomErrHandler(400, "No Tournament found"));
    }

    const matches = await Match.aggregate([
      {
        $match: {
          tournamentId: new mongoose.Types.ObjectId(tournamentId),
        },
      },

      {
        $lookup: {
          from: "tournaments",
          localField: "tournamentId",
          foreignField: "_id",
          as: "tournamentId",
        },
      },
      { $unwind: "$tournamentId" },

      {
        $lookup: {
          from: "teams",
          localField: "firstTeamId",
          foreignField: "_id",
          as: "firstTeamId",
        },
      },
      { $unwind: "$firstTeamId" },

      {
        $lookup: {
          from: "teams",
          localField: "secondTeamId",
          foreignField: "_id",
          as: "secondTeamId",
        },
      },
      { $unwind: "$secondTeamId" },

      { $sort: { createdAt: -1 } },

      {
        $project: {
          _id: 1,
          status: 1,
          round: 1,
          overs: 1,
          matchScheduleDate: 1,

          firstTeamId: {
            teamName: "$firstTeamId.teamName",
            teamLogo: "$firstTeamId.teamLogo",
          },
          secondTeamId: {
            teamName: "$secondTeamId.teamName",
            teamLogo: "$secondTeamId.teamLogo",
          },
          tournamentId: {
            tournamentName: "$tournamentId.tournamentName",
            city: "$tournamentId.city",
            ground: "$tournamentId.ground",
          },
        },
      },
    ]);

    return res.status(200).json({ matches, success: true });
  } catch (error) {
    console.log("get my tournament matches error:", error);
    next(error);
  }
};

export const getAllMatches = async (req, res, next) => {
  try {
    const { tournamentCategory } = req.params;

    const allMatches = await Match.aggregate([
      {
        $lookup: {
          from: "tournaments",
          localField: "tournamentId",
          foreignField: "_id",
          as: "tournamentId",
        },
      },
      { $unwind: "$tournamentId" },

      {
        $match: {
          "tournamentId.tournamentCategory": tournamentCategory,
        },
      },

      {
        $lookup: {
          from: "teams",
          localField: "firstTeamId",
          foreignField: "_id",
          as: "firstTeamId",
        },
      },
      { $unwind: "$firstTeamId" },

      {
        $lookup: {
          from: "teams",
          localField: "secondTeamId",
          foreignField: "_id",
          as: "secondTeamId",
        },
      },
      { $unwind: "$secondTeamId" },

      { $sort: { createdAt: -1 } },

      {
        $project: {
          _id: 1,
          status: 1,
          round: 1,
          overs: 1,
          matchScheduleDate: 1,

          firstTeamId: {
            teamName: "$firstTeamId.teamName",
            teamLogo: "$firstTeamId.teamLogo",
          },
          secondTeamId: {
            teamName: "$secondTeamId.teamName",
            teamLogo: "$secondTeamId.teamLogo",
          },
          tournamentId: {
            tournamentName: "$tournamentId.tournamentName",
            city: "$tournamentId.city",
            ground: "$tournamentId.ground",
          },
        },
      },
    ]);

    return res.status(200).json({ allMatches });
  } catch (error) {
    console.log("get all matches error", error);
    next(error);
  }
};

export const getMatchById = async (req, res, next) => {
  try {
    const { matchId } = req.params;
    console.log("match id : ", matchId);

    const match = await Match.findById(matchId)
      .populate("tournamentId")
      .populate("firstTeamId", "teamName teamLogo")
      .populate("secondTeamId", "teamName teamLogo");
    console.log("Match", match);

    res.status(200).json({
      match,
      success: true,
    });
  } catch (error) {
    console.log("Get match error : ", error);
    next(error);
  }
};
