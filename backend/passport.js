import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as LocalStrategy } from "passport-local";
import passport from "passport";
import userSchema from "./models/usermodel.js";
import mongoose from "./db/conn.js";
import jwt from "jsonwebtoken";
import { hashPasswordNew } from "./controllers/userController.js";
import dotenv from "dotenv";
dotenv.config();

export const User = mongoose.model("user", userSchema);

const generateAccessToken = (user) => {
  return jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "58m",
  });
};
const generateRefreshToken = (user) => {
  return jwt.sign({ email: user.email }, process.env.REFRESH_TOKEN_SECRET, {
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
      // scope: ["profile", "email"],
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
            photo: profile.photos[0].value,
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
      scope: ["email"],
      profileFields: ["id", "emails", "name", "photos"],
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);

      try {
        const email =
          profile.emails && profile.emails.length > 0
            ? profile.emails[0].value
            : null;
        const photo =
          profile.photos && profile.photos.length > 0
            ? profile.photos[0].value
            : null;

        let user = await User.findOne({
          providerId: profile.id,
          provider: "facebook",
        });

        if (!user) {
          user = new User({
            email: email || "noemail@gmail.com",
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            provider: "facebook",
            providerId: profile.id,
            photo: photo,
            isOAuthUser: true,
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

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (data, done) => {
  try {
    console.log(data.user);
    console.log(data);
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
