import HistoryModel from "../models/historymodel.js";
import logger from "../logger/logger.js";
import mongoose from "mongoose";

//function to validate if a string is a valid MongoDB ObjectId or not
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const deleteHistory = (req, res) => {
  const id = req.params.id;

  // Validate the ID: ensure it's either a string or a valid ObjectId
  if (!id || typeof id !== "string" || !isValidObjectId(id)) {
    return res.status(403).json({
      message: "Invalid or missing user ID! Please provide a valid ID.",
    });
  }
  HistoryModel.findByIdAndDelete(id)
    .then((history) => res.json(history).
    logger.info("History deleted successfully")
  )
    .catch((err) => res.json(err),
    logger.error("History not found")
  );
};

const clearAllData = (req, res) => {
  HistoryModel.deleteMany({})
    .then(
      () => res.json({ message: "All data cleared successfully" }),
      logger.info("All data cleared successfully")
    )
    .catch(
      (err) => res.status(500).json({ error: err.message }),
      logger.error("Error in clearing all data")
    );
};

async function createHistory(req, res) {
  try {
    const name = req.body.name; // Extract 'name' from req.body directly
    const { inputLanguage, outputLanguage, textToTranslate, translatedText } =
      req.body; // Extract other properties
    // Validate the ID: ensure it's either a string or a valid ObjectId
    if (!name || typeof name !== "string" || !isValidObjectId(name)) {
      return res.status(403).json({
        message: "Invalid or missing user ID! Please provide a valid ID.",
      });
    }

    // Create a new translation document and save it to the database
    const translation = new HistoryModel({
      userID: name,
      inputLanguage,
      outputLanguage,
      textToTranslate,
      translatedText,
    });

    const savedTranslation = await translation.save();
    res.json(savedTranslation);
    logger.info("Translation stored successfully");
  } catch (error) {
    console.error("Error in createHistory:", error);
    res
      .status(500)
      .json({ error: "An error occurred while storing the translation." });
    logger.error("Error in storing translation data");
  }
}

const getHistory = async (req, res) => {
  try {
    // Extract the user ID from the query parameters
    const id = req.query.user;

    // Validate the ID: ensure it's either a string or a valid ObjectId
    if (!id || typeof id !== "string" || !isValidObjectId(id)) {
      logger.error("User ID not provided");
      return res.status(403).json({
        message: "Invalid or missing user ID! Please provide a valid ID.",
      });
    }

    // Find history records for the specified user
    const historyRecords = await HistoryModel.find({ userID: id }).sort({
      createdAt: -1,
    });

    res.json({
      response: historyRecords,
    });
    logger.info("History fetched successfully");
  } catch (error) {
    console.error("Error in getHistory:", error);
    logger.error("Error in fetching history data");
    res.status(500).json({
      error: "An error occurred while fetching the user's history.",
    });
  }
};

export default { createHistory, getHistory, deleteHistory, clearAllData };
