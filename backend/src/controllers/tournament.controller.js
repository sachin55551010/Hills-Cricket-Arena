import { Player } from "../models/playerSchema.js";
import { Tournament } from "../models/tournamentSchema.js";
import { CustomErrHandler } from "../utils/CustomErrHandler.js";
import { io } from "../utils/socket.js";
import mongoose from "mongoose";
import { updateTournamentService } from "../services/updateTournamentStatus.service.js";

//function to create new tournament
export const addTournament = async (req, res, next) => {
  try {
    const {
      tournamentName,
      organiserName,
      phone,
      city,
      ground,
      startDate,
      endDate,
      ballType,
      tournamentCategory,
      additionalInfo,
      maxChangesAllowed,
      pitchType,
    } = req.body;

    if (
      !tournamentName?.trim() ||
      !phone?.trim() ||
      !city?.trim() ||
      !ballType?.trim() ||
      !tournamentCategory?.trim() ||
      !pitchType?.trim() ||
      !ground?.trim()
    )
      return next(new CustomErrHandler(400, "All fields are required"));

    if (startDate && endDate) {
      if (startDate > endDate)
        return next(
          new CustomErrHandler(400, "Start Date must be before end end"),
        );
    }

    const isTournamentExists = await Tournament.findOne({
      tournamentName,
      ground,
    });

    if (isTournamentExists)
      return next(
        new CustomErrHandler(
          400,
          `Tournament "${tournamentName}" already exists at ground "${ground} pleaase change the name of Tournament and try again"`,
        ),
      );

    let parsedMaxChanges = null;

    if (
      maxChangesAllowed !== undefined &&
      maxChangesAllowed !== null &&
      String(maxChangesAllowed).trim() !== ""
    ) {
      const num = Number(maxChangesAllowed);

      if (Number.isNaN(num) || num < 1 || num > 6) {
        return next(
          new CustomErrHandler(400, "Max changes must be between 1 and 6"),
        );
      }

      parsedMaxChanges = num;
    }

    const tournament = await Tournament.create({
      tournamentName,
      organiserName,
      phone,
      createdBy: req.user.id,
      city,
      ground,
      ballType,
      tournamentCategory,
      pitchType,
      additionalInfo: additionalInfo || "",
      startDate: startDate || null,
      endDate: endDate || null,
      maxChangesAllowed: parsedMaxChanges,
    });

    if (req.body.role !== "organiser") {
      await Player.findByIdAndUpdate(
        req.user.id,
        { role: "organiser" },
        { new: true },
      );
    }

    io.emit("newTournament", tournament);

    return res.status(201).json({
      tournament,
      message: "Tournament created successfully",
      success: true,
    });
  } catch (error) {
    console.error("Create tournament error : ", error);
    next(error);
  }
};

//function to get the tournaments related with specific organiser
export const getMyTournaments = async (req, res, next) => {
  try {
    const playerId = req.user.id;

    if (!playerId) return next(new CustomErrHandler(404, "No User found"));

    const myTournaments = await Tournament.find({ createdBy: playerId });

    res.json({ myTournaments, success: true });
  } catch (error) {
    console.log("Get tournament error : ", error);
    next(error);
  }
};

//function to get tournament using tournament id
export const getTournamentInfo = async (req, res, next) => {
  try {
    const { tournamentId } = req.params;
    if (!tournamentId || !mongoose.Types.ObjectId.isValid(tournamentId))
      return next(new CustomErrHandler(400, "id not found"));
    const myTournament = await Tournament.findById(tournamentId).populate(
      "createdBy",
      "playerName profilePicture number",
    );
    if (!myTournament)
      return next(new CustomErrHandler(400, "no tournament found"));
    const totalTournaments = await Tournament.countDocuments({
      createdBy: myTournament.createdBy,
    });

    return res
      .status(200)
      .json({ myTournament, totalTournaments, success: true });
  } catch (error) {
    console.log("Get tournament info error : ", error);
    next(error);
  }
};

// function to update tournament info using tournament id
export const updateTournamentInfo = async (req, res, next) => {
  try {
    const { tournamentId } = req.params;
    const updatedFields = req.body;

    if (!tournamentId)
      return next(new CustomErrHandler(404, "No tournament found!"));
    if (!updatedFields)
      return next(
        new CustomErrHandler(404, "Please fill all the required fields!"),
      );
    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) {
      return next(new CustomErrHandler(404, "Tournament not found"));
    }

    //  OWNERSHIP CHECK
    if (!tournament.createdBy.equals(req.user.id)) {
      return next(new CustomErrHandler(403, "Access denied"));
    }

    if (
      tournament.status === "Ongoing" ||
      tournament.status === "Completed" ||
      tournament.status === "Cancelled"
    )
      return next(
        new CustomErrHandler(403, "Sorry you cannot update this tournament"),
      );

    const updatedTournament = await Tournament.findByIdAndUpdate(
      tournamentId,
      updatedFields,
      { new: true },
    );

    io.emit("updatedTournament", updatedTournament);
    return res.status(201).json({
      updatedTournament,
      success: true,
      message: "Tournament information updated successfully",
    });
  } catch (error) {
    console.log("update tournament Info error : ", error);
    next(error);
  }
};

//  function to delete tournament using tournament id
export const deleteTournament = async (req, res, next) => {
  try {
    const { tournamentId } = req.params;

    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) {
      return next(new CustomErrHandler(404, "Tournament not found"));
    }

    //  OWNERSHIP CHECK
    if (!tournament.createdBy.equals(req.user.id)) {
      return next(new CustomErrHandler(403, "Access denied"));
    }
    const deletedTournament = await Tournament.findOneAndDelete({
      _id: tournamentId,
      status: { $in: ["Upcoming", "Cancelled"] },
    });

    if (!deletedTournament)
      return next(
        new CustomErrHandler(
          400,
          "You cannot delete ongoing or completed tournament! contact app developer for more help",
        ),
      );

    io.emit("deleteTournament", tournamentId);

    return res.status(201).json({
      deletedTournament,
      success: true,
      message: "Tournament deleted successfully",
    });
  } catch (error) {
    console.log("tournament delete error : ", error);
    next(error);
  }
};

// get all tournaments using tournament category
export const getAllTournaments = async (req, res, next) => {
  try {
    updateTournamentService();

    const { tournamentCategory } = req.params;
    const { search, value, status } = req.query;

    const filter = {
      tournamentCategory,
    };

    const allowedFields = ["organiserName", "tournamentName", "ground", "city"];

    // ✅ search filter
    if (search && allowedFields.includes(value)) {
      filter[value] = {
        $regex: search,
        $options: "i",
      };
    }

    // ✅ status filter
    if (status && status !== "") {
      filter.status = status;
    }

    /**
     * pagination logic inpliment later
     // convert page and limit to number
    // const pageNumber = parseInt(page);
    // const limitNumber = parseInt(limit);
    // const skip = (pageNumber - 1) * limitNumber;
    // console.log(filter);
     */

    const allTournaments = await Tournament.find(filter).sort({
      createdAt: -1,
    });

    /**
       const totalDocuments = await Tournament.countDocuments();
    const hasMore = skip + allTournaments.length < totalDocuments;
    console.log("hasMore", hasMore);
       */

    res.status(200).json({ allTournaments, success: true });
  } catch (error) {
    console.log("get all tournaments error : ", error);
    next(error);
  }
};
