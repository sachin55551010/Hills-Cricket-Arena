import mongoose from "mongoose";

const inviteLinkSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
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
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);
// TTL index (auto delete when expiresAt < now)
inviteLinkSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export const InviteLink = mongoose.model("InviteLink", inviteLinkSchema);
