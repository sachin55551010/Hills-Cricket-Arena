import passport from "passport";
import { User } from "../models/userSchema.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Player } from "../models/playerSchema.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CLIENT_URL,
    },

    async (accessToken, refreshToken, profile, cb) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          // New user — create User document
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            profileImg: profile.photos[0].value,
            isLoggedIn: true,
          });
        } else {
          // Returning user — mark as logged in
          await User.findByIdAndUpdate(user._id, { isLoggedIn: true });
        }

        let player = await Player.findOne({ playerId: user._id });
        if (!player) {
          // New player — explicitly set role as array so it's never undefined
          player = await Player.create({
            playerName: user.name,
            playerId: user._id,
            isVarified: true,
            role: ["user"],
          });
        }

        return cb(null, player);
      } catch (error) {
        console.log("google OAuth error : ", error);
        return cb(error, null);
      }
    },
  ),
);
