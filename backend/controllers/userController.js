import mongoose from "../db/conn.js";
import rateLimit from "express-rate-limit";
import userSchema from "../models/usermodel.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import logger from "../logger/logger.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
dotenv.config();

let worstPasswords = [];

const transporter = nodemailer.createTransport({
  service: "Gmail", // Use the appropriate email service
  auth: {
    user: "bpathum@gmail.com", // Replace with your email address
    pass: "pgfliawbkmllcenm", // Replace with your email password or an app-specific password
  },
});

export const userModel = mongoose.model("user", userSchema);

// Login rate limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: "Too many login attempts. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: function (req, res) {
    res.status(429).json({ message: "Too many login attempts." });
    logger.warn(`Too many login attempts: ${req.body.email}`);
  },
});

export function hashPasswordNew(password) {
  return crypto
    .pbkdf2Sync(password, "no_salt", 1000, 64, `sha512`)
    .toString(`hex`);
}

// Add new user with password strength check
export async function registerUser(req, res) {
  try {
    worstPasswords = fs
      .readFileSync(path.resolve("./worst-passwords.txt"), "utf-8")
      .split("\n")
      .map((password) => password.trim());
    console.log("Worst passwords loaded successfully");
    logger.info("Worst passwords loaded successfully");
  } catch (error) {
    console.error("Error reading worst-passwords.txt:", error);
    logger.error("Error reading worst-passwords.txt:", error);
    return res.status(500).send("Error loading worst passwords.");
  }

  const {
    firstName,
    lastName,
    email,
    passwordHash,
    gender,
    age,
    address,
    provider,
    providerId,
  } = req.body;

  if (worstPasswords.includes(passwordHash)) {
    logger.warn("User tried to use a weak password:", email);
    return res.status(400).send("The password you entered is too weak.");
  }

  let newUser = new userModel({
    firstName,
    lastName,
    email,
    passwordHash: hashPasswordNew(passwordHash),
    gender,
    age,
    address,
    provider,
    providerId,
  });

  try {
    const response = await newUser.save();
    res
      .status(201)
      .json({ message: "User added successfully", user: response });
    // Send confirmation email logic here...
    logger.info("User added successfully:", email);
  } catch (err) {
    res.status(500).send(err);
    console.log(err);
    logger.error("Error adding user:", err);
  }
}

// create an admin account
export function adminAccount(req, res) {
  let newUser = new userModel();
  newUser.firstName = "admin";
  newUser.lastName = "superadmin";
  newUser.email = "admin@gmail.com";
  newUser.passwordHash = hashPasswordNew("0000");
  newUser.gender = "---";
  newUser.age = 20;
  newUser.address = "admin";

  newUser
    .save()
    .then((response) => {
      res.send(response);
      console.log("User added successfully");
    })
    .catch((err) => {
      console.log(err);
      res.send("Something went wrong while adding user!");
    });
}

// login user

// const generateAccessToken = (user) => {
//   return jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE,
//   });
// };
// const generateRefreshToken = (user) => {
//   return jwt.sign({ email: user.email }, process.env.REFRESH_JWT_SECRET, {
//     expiresIn: "58m",
//   });
// };

// login user

const generateAccessToken = (user) => {
  console.log(user.userRole);
  return jwt.sign(
    { email: user.email, role: user.userRole },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { email: user.email, role: user.userRole },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

const loginUser = (req, res) => {
  const { email, passwordHash } = req.body;

  if (!email || !passwordHash) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (typeof email !== "string" || typeof passwordHash !== "string") {
    return res.status(400).json({ message: "Invalid input type!" });
  }

  userModel
    .findOne({ email: email })
    .then((user) => {
      // check response is not null
      if (user != null) {
        // check if the user is admin
        if (
          user.email === "admin@gmail.com" &&
          user.passwordHash === hashPasswordNew("0000")
        ) {
          console.log("hii");
          const A_token = generateAccessToken(user);
          const R_token = generateRefreshToken(user);
          console.log(A_token);
          // req.session.userId = response._id;

          refreashTokens.push(R_token);

          res.status(200).json({
            message: "Auth successful, admin",
            accessToken: A_token,
            refreshToken: R_token,
            user: user,
          });
          logger.info("Admin logged in successfully:", email);
        } else {
          if (user.passwordHash == hashPasswordNew(passwordHash)) {
            const A_token = generateAccessToken(user);
            const R_token = generateRefreshToken(user);
            logger.info(`User logged in successfully: ${email}`);
            res.status(200).json({
              message: "Auth successful",
              accessToken: A_token,
              refreshToken: R_token,
              user: user,
            });
          } else {
            res.send("Incorrect password");
            logger.warn("Incorrect password:", email);
          }
        }
      } else {
        res.send("User not found");
        logger.warn("User not found:", email);
      }
    })
    .catch((err) => {
      console.log(err);
      logger.error("Error logging in user:", err);
      res.send("Something went wrong while login!");
    });
};

//get user details
const userDetails = (req, res) => {
  const email = req.user.email;
  console.log("firstHold", email);
  if (!email) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (typeof email !== "string") {
    return res.status(400).json({ message: "Invalid input type!" });
  }

  userModel
    .findOne({ email: email })
    .then((user) => {
      // check response is not null
      if (user != null) {
        //send user details
        res.status(200).json({
          message: "User Details",
          user: user,
        });
        logger.info("User details sent successfully:", email);
      } else {
        res.send("User not found");
        logger.warn("User not found:", email);
      }
    })
    .catch((err) => {
      console.log(err);
      logger.error("Error getting user details:", err);
      res.send("Something went wrong while getting user details!");
    });
};

//checking age for safe browsing
export function checkAge(req, res) {
  const { age } = req.body;

  if (age < 18) {
    res.send("You are not eligible to register");
    logger.warn("User not eligible to register:");
    // other code
  } else {
    res.send("You are eligible to register");
    logger.info("User eligible to register:");
  }
}

const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        logger.error("Token is not valid:", err);
        return res.status(403).json("Token is not valid!");
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401).json("You are not authenticated");
    logger.warn("User not authenticated:");
  }
};

let refreashTokens = [];

const refresh = (req, res) => {
  const refreshToken = req.body.token;

  if (!refreshToken) {
    logger.warn("You are not authenticated:", email);
    return res.status(403).json("You are not authenticated!");
  }

  if (!refreashTokens.includes(refreshToken)) {
    logger.warn("Refresh Token Invalied:", email);
    return res.status(403).json("Refresh Token Invalied!");
  }

  jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET, (err, user) => {
    err && console.log(err);
    if (err) {
      logger.error("Token is not valid:", err);
      return res.status(403).json("Token is not valid!");
    }
    refreashTokens = refreashTokens.filter((token) => token !== refreshToken);

    const newA_token = generateAccessToken(user);
    const newR_token = generateRefreshToken(user);

    refreashTokens.push(newR_token);
    res.status(200).json({
      accessToken: newA_token,
      refreshToken: newR_token,
    });
    logger.info("Token refreshed successfully:", email);
  });
};

const showName = (req, res) => {
  console.log("auth work");
  if (req.user.id === req.params.id || req.user.isAdmin) {
    console.log("admin or user");
  }
  res.send("hellooo");
};

const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("This is auth header:");
  console.log(authHeader);
  if (authHeader) {
    // const token = authHeader.split(" ")[1];
    const token = authHeader;

    console.log("this is the token");
    console.log(token);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json("Token is not valid!");
      }
      req.user = user;
      console.log(user);
      next();
    });
  } else {
    res.status(401).json("You are not authenticated!");
  }
};

const verifyAdmin = (req, res, next) => {
  const user = req.user; // Assume req.user is populated by your authentication middleware
  console.log(user);
  console.log(user.role);

  if (user && user.role === "admin") {
    next(); // User is admin, proceed to the next middleware/route handler
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};

let refreshTokens = [];

const refreshAccessToken = (req, res) => {
  const { token: refreshToken } = req.body;

  if (!refreshToken) return res.status(401).json("You are not authenticated!");

  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json("Refresh Token is not valid!");
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err)
      return res.status(403).json("Refresh token is not valid or expired!");

    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    const newAccessToken = userController.generateAccessToken(user);
    const newRefreshToken = userController.generateRefreshToken(user);

    refreshTokens.push(newRefreshToken);

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });
};

export default {
  verify,
  refresh,
  showName,
  loginUser,
  userDetails,
  loginLimiter,
  generateAccessToken,
  generateRefreshToken,
  verifyAdmin,
  refreshAccessToken,
  verifyAccessToken,
};
