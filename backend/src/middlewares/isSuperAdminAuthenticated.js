import { Player } from "../models/playerSchema.js";
import { CustomErrHandler } from "../utils/CustomErrHandler.js";

// Must be placed AFTER isAuthenticated middleware in the route chain.
// req.user.id = Player._id (the JWT stores the Player._id, not User._id)
export const isSuperAdminAuthenticated = async (req, res, next) => {
  try {
    const { id } = req.user; // Player._id from JWT

    // 1. Fetch the Player and populate the linked User (playerId) to read email
    const player = await Player.findById(id).populate("playerId");
    if (!player) {
      return next(new CustomErrHandler(401, "Player not found. Please login again."));
    }

    // 2. Check that the linked user's email matches ADMIN_EMAIL_ID in .env
    const userEmail = player?.playerId?.email;
    if (userEmail !== process.env.ADMIN_EMAIL_ID) {
      return next(
        new CustomErrHandler(403, "Access denied. You are not the Super Admin.")
      );
    }

    // 3. Confirm the player's role array contains "superadmin"
    //    (A player can simultaneously hold roles like ["organiser", "superadmin"])
    if (!player.role.includes("superadmin")) {
      return next(
        new CustomErrHandler(403, "Access denied. Super Admin role not assigned.")
      );
    }

    // 4. Attach player (with populated user) to req for downstream handlers
    req.adminPlayer = player;
    req.adminUser = player.playerId; // the populated User doc

    next();
  } catch (error) {
    console.error("isSuperAdminAuthenticated Error:", error);
    next(error);
  }
};
