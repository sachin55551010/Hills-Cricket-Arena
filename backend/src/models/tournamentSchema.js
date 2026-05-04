import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema(
  {
    tournamentName: {
      type: String,
      required: true,
    },
    organiserName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
      trim: true,
    },
    status: {
      type: String,
      enum: [
        "Upcoming",
        "Ongoing",
        "Completed",
        "Cancelled",
        "Abandoned",
        "Postponed",
        "Inactive",
      ],
      default: "Upcoming",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },

    //*additional admins can also organise tournament
    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    TournamentLogo: {
      type: String,
      default: "",
    },
    tournamentBanner: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      required: true,
    },
    ground: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    ballType: {
      type: String,
      enum: ["Bunat", "Red Ball", "Swing Ball", "Tennis", "Leather", "Other"],
      required: true,
    },
    tournamentCategory: {
      type: String,
      enum: ["open", "panchayat", "panchayat+open", "corporate"],
      required: true,
    },
    pitchType: {
      type: String,
      enum: ["Regular", "Cement", "Matte"],
      required: true,
    },

    maxChangesAllowed: {
      type: Number,
      default: null,
    },

    additionalInfo: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

export const Tournament = mongoose.model("Tournament", tournamentSchema);
