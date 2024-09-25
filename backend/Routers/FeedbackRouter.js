import express from "express";
import {
  createFeedbackForTranslation,
  getAllFeedback,
  getFeedbackById,
  updateFeedbackById,
  deleteFeedbackById,
} from "../controllers/FeedbackController.js";
import userController from "../controllers/userController.js";
import { logRequestDetails } from "../middleware/loggerMiddleware.js";
const feedbackRouter = express.Router();

// Create new feedback for translation
feedbackRouter.post(
  "/translation",
  logRequestDetails,
  userController.verify,
  createFeedbackForTranslation
);

// Get all feedback
feedbackRouter.get("/", logRequestDetails, getAllFeedback);

// Get feedback by ID
feedbackRouter.get(
  "/user",
  logRequestDetails,
  userController.verify,
  getFeedbackById
);

// Update feedback by ID
feedbackRouter.put(
  "/update/:id",
  logRequestDetails,
  userController.verify,
  updateFeedbackById
);

// Delete feedback by ID
feedbackRouter.delete(
  "/delete/:id",
  logRequestDetails,
  userController.verify,
  deleteFeedbackById
);

export default feedbackRouter;
