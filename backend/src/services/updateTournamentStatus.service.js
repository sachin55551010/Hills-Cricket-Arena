import { Tournament } from "../models/tournamentSchema.js";
import { Match } from "../models/matchSchema.js";

export const updateTournamentService = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    //  Upcoming -> Ongoing
    await Tournament.updateMany(
      {
        startDate: { $lte: today },
        endDate: { $gte: today },
        status: "Upcoming",
      },
      { $set: { status: "Ongoing" } },
    );

    //  Get tournaments where at least one match is played
    const playedTournamentIds = await Match.distinct("tournamentId", {
      status: { $in: ["live", "completed", "abandoned"] },
    });

    //  Expired + NO matches → Inactive
    await Tournament.updateMany(
      {
        endDate: { $lt: today },
        _id: { $nin: playedTournamentIds },
      },
      { $set: { status: "Inactive" } },
    );

    //  Expired + HAS matches → Ongoing
    await Tournament.updateMany(
      {
        endDate: { $lt: today },
        _id: { $in: playedTournamentIds },
      },
      { $set: { status: "Ongoing" } },
    );
  } catch (error) {
    console.log("updateTournamentService error:", error);
  }
};
