import Feedback from "../models/FeedbackModel.js";
import user from "../models/usermodel.js";
import logger from "../logger/logger.js";
import mongoose from "mongoose";

//function to validate if a string is a valid MongoDB ObjectId or not
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Create feedback for translation
const createFeedbackForTranslation = async (req, res) => {
  try {
    const { englishWord, sinhalaWord, feedbackText, user_Id } = req.body;

    const feedback = new Feedback({
      word: englishWord,
      sword: sinhalaWord,
      feedbackText: feedbackText,
      userId: user_Id,
    });
    // Save the feedback to the database
    const savedFeedback = await feedback.save().then((resp) => {
      res.status(201).json(resp);
      logger.info("Feedback created successfully");
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
    logger.error("Error in creating feedback");
  }
};

// Get all feedback
const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find();
    res.status(200).json(feedback);
    logger.info("Feedback data fetched successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
    logger.error("Error in fetching feedback data");
  }
};

// Get feedback by ID
const getFeedbackById = async (req, res) => {
  try {
    const userId = req.query.userId;

    // Validate the ID: ensure it's either a string or a valid ObjectId
    if (!userId || typeof userId !== "string" || !isValidObjectId(userId)) {
      return res.status(403).json({
        message: "Invalid or missing user ID! Please provide a valid ID.",
      });
    }

    if (!userId) {
      logger.error("User ID is required");
      return res.status(400).json({ message: "User ID is required" });
    }

    const feedback = await Feedback.find({ userId: userId });
    if (!feedback) {
      logger.error("Feedback not found");
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.status(200).json(feedback);
    logger.info("Feedback data fetched successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
    logger.error("Error in fetching feedback data");
  }
};

// Update feedback by ID
const updateFeedbackById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID: ensure it's either a string or a valid ObjectId
    if (!id || typeof id !== "string" || !isValidObjectId(id)) {
      return res.status(403).json({
        message: "Invalid or missing user ID! Please provide a valid ID.",
      });
    }
    const { feedbackText } = req.body;
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      id,
      { feedbackText },
      { new: true }
    );
    if (!updatedFeedback) {
      logger.error("Feedback not found");
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.status(200).json(updatedFeedback);
    logger.info("Feedback updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
    logger.error("Error in updating feedback");
  }
};

// Delete feedback by ID
const deleteFeedbackById = async (req, res) => {
  try {
    const { id } = req.params;
    // Validate the ID: ensure it's either a string or a valid ObjectId
    if (!id || typeof id !== "string" || !isValidObjectId(id)) {
      return res.status(403).json({
        message: "Invalid or missing user ID! Please provide a valid ID.",
      });
    }
    const deletedFeedback = await Feedback.findByIdAndRemove(id);
    if (!deletedFeedback) {
      logger.error("Feedback not found");
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.status(200).json({ message: "Feedback deleted" });
    logger.info("Feedback deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
    logger.error("Error in deleting feedback");
  }
};

export {
  createFeedbackForTranslation,
  getAllFeedback,
  getFeedbackById,
  updateFeedbackById,
  deleteFeedbackById,
};
