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
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            profileImg: profile.photos[0].value,
            isLoggedIn: true,
          });
        }
        let player = await Player.findOne({ playerId: user._id });
        if (!player) {
          player = await Player.create({
            playerName: user.name,
            playerId: user._id,
            isVarified: true,
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
