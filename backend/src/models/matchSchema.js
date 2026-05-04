import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    tournamentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },
    firstTeamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    secondTeamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    overs: {
      type: Number,
      required: true,
    },

    tossWinnerTeamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: function () {
        this.status === "ongoing";
      },
    },
    decision: {
      type: String,
      enum: ["Bat", "Bowl"],
      required: function () {
        return this.status === "live";
      },
    },

    matchScheduleDate: {
      type: Date,
      required: function () {
        this.status === "scheduled";
      },
    },
    round: {
      type: String,
      enum: [
        "First round",
        "Second round",
        "Third round",
        "Forth round",
        "Fifth round",
        "Sixth round",
        "Seventh round",
        "Eighth round",
        "Quarter final",
        "Semi final",
        "Final",
      ],
    },
    status: {
      type: String,
      enum: ["scheduled", "live", "completed", "abandoned"],
      default: "scheduled",
    },
    result: {
      winnerTeamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
      },

      innings: [
        {
          teamId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
            required: true,
          },
          runs: {
            type: Number,
            default: 0,
          },
          wickets: {
            type: Number,
            default: 0,
          },
          over: {
            type: Number,
            default: 0,
          },
          playerStats: [
            {
              playerId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Player",
              },
              runs: {
                type: Number,
                default: 0,
              },
              ballsFaced: { type: Number, default: 0 },
              wickets: { type: Number, default: 0 },
              oversBowled: { type: Number, default: 0 },
              fours: { type: Number, default: 0 },
              sixes: { type: Number, default: 0 },
              notOut: { type: Boolean, default: false },
            },
          ],
        },
      ],
    },
  },
  { timestamps: true },
);

export const Match = mongoose.model("Match", matchSchema);
