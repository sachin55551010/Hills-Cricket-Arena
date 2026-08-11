import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    playerName: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    number: {
      type: String,
      unique: true,
      sparse: true,
      match: [/^\d{10}$/, "Mobile number must be exactly 10 digits"],
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    playingRole: {
      type: String,
      enum: [
        "top order batsman",
        "middle order batsman",
        "opening batsman",
        "bowler",
        "all rounder",
        "wicket keeper batter",
        "lower order batsman",
        "none",
      ],
    },
    battingStyle: {
      type: String,
      enum: ["right handed bat", "left handed bat"],
    },
    bowlingStyle: {
      type: String,
      enum: [
        "right arm fast",
        "right arm fast medium",
        "right arm medium",
        "right arm orthodox",
        "right arm chinaman",
        "right arm off break",
        "right arm leg break",
        "right arm slow",
        "left arm fast",
        "left arm fast medium",
        "left arm medium",
        "left arm orthodox",
        "left arm chinaman",
        "left arm off break",
        "left arm leg break",
        "left arm slow",
        "none",
      ],
    },

    //* option link to logged in user
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    isVarified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "organiser", "superadmin"],
      default: "user",
    },

    careerStats: {
      matches: {
        type: Number,
        default: 0,
      },
      batting: {
        innings: { type: Number, default: 0 },
        runs: { type: Number, default: 0 },
        ballsFaced: { type: Number, default: 0 },
        notOuts: { type: Number, default: 0 },
        ducks: { type: Number, default: 0 },
        fours: { type: Number, default: 0 },
        sixes: { type: Number, default: 0 },
        thirties: { type: Number, default: 0 },
        fifties: { type: Number, default: 0 },
        hundreds: { type: Number, default: 0 },
        highestScore: { type: Number, default: 0 },

        // Optional derived stats
        average: { type: Number, default: 0 },
        strikeRate: { type: Number, default: 0 },
      },

      bowling: {
        innings: { type: Number, default: 0 },
        balls: { type: Number, default: 0 },
        runsConceded: { type: Number, default: 0 },
        wickets: { type: Number, default: 0 },
        threes: { type: Number, default: 0 },
        fours: { type: Number, default: 0 },
        five: { type: Number, default: 0 },
        bestBowling: { type: Number, default: 0 },

        // Optional derived stats
        average: { type: Number, default: 0 }, // runsConceded / wickets
        economy: { type: Number, default: 0 }, // runsConceded / oversBowled
        strikeRate: { type: Number, default: 0 }, // ballsPerWicket
      },
    },
  },
  { timestamps: true }
);

export const Player = mongoose.model("Player", playerSchema);
