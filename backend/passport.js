import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as LocalStrategy } from "passport-local";
import passport from "passport";
import userSchema from "./models/usermodel.js";
import mongoose from "./db/conn.js";
import jwt from "jsonwebtoken";
import { hashPasswordNew } from "./controllers/userController.js";

export const User = mongoose.model("user", userSchema);

const generateAccessToken = (user) => {
  return jwt.sign({ email: user.email }, "secret_key", {
    expiresIn: "58m",
  });
};
const generateRefreshToken = (user) => {
  return jwt.sign({ email: user.email }, "refresh_secret_key", {
    expiresIn: "58m",
  });
};

// Local Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const userDetails = await User.findOne({ email });

        console.log(email);
        console.log(password);
        console.log(userDetails.passwordHash);

        if (!userDetails) {
          return done(null, false, { message: "Incorrect email." });
        }

        const isMatch = userDetails.passwordHash === hashPasswordNew(password); // Ensure you have this method implemented

        if (!isMatch) {
          return done(null, false, { message: "Incorrect password." });
        }
        console.log("pass");

        const A_token = generateAccessToken(userDetails);
        const R_token = generateRefreshToken(userDetails);

        const user = {
          user: userDetails,
          accessToken: A_token,
          refreshToken: R_token,
        };
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          providerId: profile.id,
          provider: "google",
        });
        console.log({ profile: profile });
        if (!user) {
          user = new User({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile?.emails[0].value,
            provider: "google",
            providerId: profile.id,
          });
          await user.save();
        }

        const A_token = generateAccessToken(user);
        const R_token = generateRefreshToken(user);

        const userDetails = {
          user: user,
          accessToken: A_token,
          refreshToken: R_token,
        };

        return done(null, userDetails);
      } catch (err) {
        return done(err);
      }
    }
  )
);

console.log(process.env.FACEBOOK_CLIENT_ID);
// Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "/auth/facebook/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          providerId: profile.id,
          provider: "facebook",
        });
        if (!user) {
          user = new User({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            provider: "facebook",
            providerId: profile.id,
            isOAuthUser: true,
          });
          await user.save();
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (data, done) => {
  try {
    console.log(data.user);
    const id = data.user._id;
    const userDetail = await User.findById(id);
    const user = {
      user: userDetail,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
