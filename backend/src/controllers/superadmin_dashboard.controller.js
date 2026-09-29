import { Team } from "../models/teamSchema.js";
import { Player } from "../models/playerSchema.js";
import { Tournament } from "../models/tournamentSchema.js";
import { CustomErrHandler } from "../utils/CustomErrHandler.js";

export const getAllDataInNumber = async (req, res, next) => {
  try {
    const recentSince = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    const categories = ["open", "panchayat", "panchayat+open", "corporate"];
    const [
      totalTeams,
      totalPlayers,
      totalTournaments,
      recentPlayers,
      recentTeams,
      tournaments,
    ] = await Promise.all([
      Team.countDocuments(),
      Player.countDocuments(),
      Tournament.countDocuments(),
      Player.find({ createdAt: { $gte: recentSince } })
        .select("playerName profilePicture createdAt")
        .sort({ createdAt: -1 }),
      Team.find({ createdAt: { $gte: recentSince } })
        .select("teamName city teamLogo createdAt tournamentId")
        .populate("tournamentId", "tournamentName")
        .sort({ createdAt: -1 }),
      Tournament.find()
        .select("tournamentName tournamentCategory city status createdAt")
        .sort({ createdAt: -1 }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalTeams,
        totalPlayers,
        totalTournaments,
      },
      recent: {
        players: recentPlayers,
        teams: recentTeams,
        tournaments: tournaments.filter(
          (tournament) => tournament.createdAt >= recentSince,
        ),
      },
      tournamentsByCategory: Object.fromEntries(
        categories.map((category) => [
          category,
          tournaments.filter(
            (tournament) => tournament.tournamentCategory === category,
          ),
        ]),
      ),
    });
  } catch (error) {
    next(error);
  }
};

// ── SuperAdmin: get all players with search/filter ────────────────────────────
export const getAllPlayers = async (req, res, next) => {
  try {
    const { search, value, role } = req.query;

    const filter = {};
    const allowedSearchFields = ["playerName", "number"];
    if (search && allowedSearchFields.includes(value)) {
      filter[value] = { $regex: search, $options: "i" };
    }
    if (role && role !== "") {
      filter.role = { $in: [role] };
    }

    const players = await Player.find(filter)
      .select(
        "playerName number gender dateOfBirth profilePicture playingRole battingStyle bowlingStyle role isVarified careerStats createdAt",
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({ players, success: true });
  } catch (error) {
    console.log("getAllPlayers error:", error);
    next(error);
  }
};

// ── SuperAdmin: update any player profile ────────────────────────────────────
export const updatePlayer = async (req, res, next) => {
  try {
    const { playerId } = req.params;
    const {
      playerName,
      number,
      gender,
      dateOfBirth,
      playingRole,
      battingStyle,
      bowlingStyle,
      role,
      isVarified,
    } = req.body;

    const player = await Player.findById(playerId);
    if (!player) return next(new CustomErrHandler(404, "Player not found"));

    const updatedPlayer = await Player.findByIdAndUpdate(
      playerId,
      {
        playerName,
        number: number || undefined,
        gender,
        dateOfBirth: dateOfBirth || null,
        playingRole,
        battingStyle,
        bowlingStyle,
        role,
        isVarified,
      },
      { new: true, runValidators: true },
    );

    return res.status(200).json({
      updatedPlayer,
      success: true,
      message: "Player updated successfully",
    });
  } catch (error) {
    console.log("updatePlayer error:", error);
    next(error);
  }
};

// ── SuperAdmin: delete any player ────────────────────────────────────────────
export const deletePlayer = async (req, res, next) => {
  try {
    const { playerId } = req.params;

    const player = await Player.findById(playerId);
    if (!player) return next(new CustomErrHandler(404, "Player not found"));

    await Player.findByIdAndDelete(playerId);

    return res.status(200).json({
      success: true,
      message: "Player deleted successfully",
      deletedId: playerId,
    });
  } catch (error) {
    console.log("deletePlayer error:", error);
    next(error);
  }
};

// ── SuperAdmin: update player career stats ────────────────────────────────────
export const updatePlayerStats = async (req, res, next) => {
  try {
    const { playerId } = req.params;
    const { careerStats } = req.body;

    const player = await Player.findById(playerId);
    if (!player) return next(new CustomErrHandler(404, "Player not found"));

    const updatedPlayer = await Player.findByIdAndUpdate(
      playerId,
      { careerStats },
      { new: true, runValidators: true },
    );

    return res.status(200).json({
      updatedPlayer,
      success: true,
      message: "Player stats updated successfully",
    });
  } catch (error) {
    console.log("updatePlayerStats error:", error);
    next(error);
  }
};
