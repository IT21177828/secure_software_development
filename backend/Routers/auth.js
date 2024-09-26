import { Router } from "express";
import passport from "passport";

const router = Router();
const CLIENT_URL = "http://localhost:3000";

// Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// Google authentication callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login/failed",
  }),
  (req, res) => {
    const userId = req.user.user._id;
    res.redirect(`http://localhost:3000/dashboard/${userId}`);
  }
);

// Facebook login
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email", "profile"] })
);
// Facebook authentication callback
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login/failed",
  }),
  (req, res) => {
    const userId = req.user.user._id;
    res.redirect(`http://localhost:3000/dashboard/${userId}`);
  }
);

// GitHub login
router.get(
  "/github",
  passport.authenticate("github", { scope: ["email", "profile"] })
);

// GitHub authentication callback
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login/failed",
  }),
  (req, res) => {
    const userId = req.user.user._id;
    res.redirect(`http://localhost:3000/dashboard/${userId}`);
  }
);

// Local login callback
router.post(
  "/local/callback",
  passport.authenticate("local", {
    failureRedirect: "/login/failed",
  }),
  (req, res) => {
    console.log("camecallback")
    const userId = req.user._id;
    res.send(req.user);
  }
);

router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successful",
      user: req.user,
      // cookies: req.cookies
    });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

// Logout Route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Logout failed." });
    }
    res.clearCookie("connect.sid"); // Clear session cookie
    res.redirect(CLIENT_URL);
  });
});

export default router;
