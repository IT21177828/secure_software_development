import { Router } from "express";
import passport from "passport";
import { logRequestDetails } from "../middleware/loggerMiddleware.js";
const router = Router();

const CLIENT_URL = "http://localhost:3000";

router.get("/login/success", logRequestDetails, (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successful",
      user: req.user,
      // cookies: req.cookies
    });
  }
});

router.get("/login/failed", logRequestDetails, (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

router.get("/logout", logRequestDetails, (req, res) => {
  req.logout();
  res.redirect(CLIENT_URL);
});

router.get(
  "/google",
  logRequestDetails,
  passport.authenticate("google", { scope: ["profile"] })
);

router.get(
  "/google/callback",
  logRequestDetails,
  passport.authenticate("google", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

router.get(
  "/github",
  logRequestDetails,
  passport.authenticate("github", { scope: ["profile"] })
);

router.get(
  "/github/callback",
  logRequestDetails,
  passport.authenticate("github", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

router.get(
  "/facebook",
  logRequestDetails,
  passport.authenticate("facebook", { scope: ["profile"] })
);

router.get(
  "/facebook/callback",
  logRequestDetails,
  passport.authenticate("facebook", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

export default router;
