import { Team } from "../models/teamSchema.js";
import { Player } from "../models/playerSchema.js";
import { Tournament } from "../models/tournamentSchema.js";

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
