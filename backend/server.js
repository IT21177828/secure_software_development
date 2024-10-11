import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session"; // Switch to express-session
import passport from "passport";
import Stripe from "stripe";
import { logRequestDetails } from "./middleware/loggerMiddleware.js";
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

const allowedOrigins = ["http://localhost:3000", "http://example.com"];

const corsOptions = (req, callback) => {
  let corsOptions;
  const origin = req.header("Origin");
  console.log({ origin: origin });
  if (allowedOrigins.includes(origin)) {
    corsOptions = { origin: origin, credentials: true }; // Reflect the request origin in the CORS response
  } else {
    corsOptions = { origin: false }; // Disable CORS for this request
  }
  callback(null, corsOptions); // Pass the corsOptions object to the middleware
};

// Apply the CORS middleware dynamically based on the origin
app.use(cors(corsOptions));

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

// Body parser for JSON data
app.use(express.json());

// Serve static files (if needed)
app.use(express.static("public"));

// Apply the logging middleware globally
app.use(logRequestDetails);

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
