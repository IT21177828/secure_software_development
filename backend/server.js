import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session"; // Switch to express-session
import passport from "passport";
import Stripe from "stripe";

import userRouter from "./Routers/userRouter.js";
import membershipRouter from "./Routers/memberShipRouter.js";
import membershipTypeRouter from "./Routers/membershipTypeRouter.js";
import badWordRouter from "./Routers/badWordRouter.js";
import translateRouter from "./Routers/translateRouter.js";
import feedbackRouter from "./Routers/FeedbackRouter.js";
import paymentRouter from "./Routers/paymentRouter.js";
import historyRouter from "./Routers/historyRouter.js";
import savedwordRouter from "./Routers/SavedWordRouter.js";
import authRoute from "./Routers/auth.js";
import checkoutRouter from "./Routers/checkoutRouter.js";
import "./passport.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// Initialize Stripe with secret key from environment variables
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// Replace cookie-session with express-session
app.use(
  session({
    secret: process.env.SESSION_KEY || "your_secret_key_here", // Use a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
    },
  })
);

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session()); // Persistent login sessions

// Enable CORS to allow frontend (React) requests
app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend URL
    methods: "GET,POST,PUT,DELETE",
    credentials: true, // Allow cookies and authorization headers
  })
);

// Body parser for JSON data
app.use(express.json());

// Serve static files (if needed)
app.use(express.static("public"));

// API Routes
app.use("/auth", authRoute);
app.use("/membership", membershipRouter);
app.use("/membershipType", membershipTypeRouter);
app.use("/user", userRouter);
app.use("/bad", badWordRouter);
app.use("/translate", translateRouter);
app.use("/feedback", feedbackRouter);
app.use("/payment", paymentRouter);
app.use("/history", historyRouter);
app.use("/savedWord", savedwordRouter);
app.use("/checkout", checkoutRouter);

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
