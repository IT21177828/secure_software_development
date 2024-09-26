import SavedWordModel from "../models/SavedWordModel.js";
import logger from "../logger/logger.js";
import mongoose from "mongoose";
// const getSavedWord = (req, res) => {
//   SavedWordModel.find()
//     .then((word) => res.json(word))
//     .catch((err) => res.json(err));
// };

//function to validate if a string is a valid MongoDB ObjectId or not
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const deleteSavedWord = (req, res) => {
  try {
    const id = req.params.id;
    // Validate the ID: ensure it's either a string or a valid ObjectId
    if (!id || typeof id !== "string" || !isValidObjectId(id)) {
      return res.status(403).json({
        message: "Invalid or missing user ID! Please provide a valid ID.",
      });
    }
    SavedWordModel.findByIdAndDelete(id)
      .then((word) => {
        res.json(word);
        logger.info("Word deleted successfully");
      })
      .catch((err) => {
        res.json({ error: "Something went wrong while deleting word" });
        logger.error("Error in deleting word");
      });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong while deleting word" });
    logger.error("Error in deleting word");
  }
};

// const clearAllData = (req, res) => {
//     HistoryModel.deleteMany({})
//       .then(() => res.json({ message: "All data cleared successfully" }))
//       .catch(err => res.status(500).json({ error: err.message }));
// };

const createSavedWord = async (req, res) => {
  try {
    const name = req.body.name;
    const { inputLanguage, outputLanguage, textToTranslate, translatedText } =
      req.body;

    // Create a new translation document and save it to the database
    const translation = new SavedWordModel({
      userID: name,
      inputLanguage,
      outputLanguage,
      textToTranslate,
      translatedText,
      message: "Add Note Here",
    });

    const savedTranslation = await translation.save();
    res.json(savedTranslation);
    logger.info("Translation stored successfully");
  } catch (error) {
    console.error(error);
    logger.error("Error in createHistory");
    res
      .status(500)
      .json({ error: "An error occurred while storing the translation." });
  }
};

const deleteWord = async (req, res) => {
  try {
    const { textToTranslate } = req.query; // Get textToTranslate from query parameters

    // Find data based on textToTranslate
    const deletedData = await SavedWordModel.deleteMany({
      textToTranslate: { $regex: new RegExp(textToTranslate, "i") },
    });

    if (deletedData.deletedCount > 0) {
      console.log("Existing data deleted successfully");
      res.status(200).json({ message: "Data deleted successfully" });
      logger.info("Existing data deleted successfully");
    } else {
      console.log("Data with textToTranslate not found");
      res.status(404).json({ message: "Data not found" });
      logger.error("Data with textToTranslate not found");
    }
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({ error: "Internal server error" });
    logger.error("Error in deleting data");
  }
};

const getSavedWordExist = async (req, res) => {
  try {
    const { textToTranslate } = req.body;

    if (!textToTranslate || typeof textToTranslate !== "string") {
      return res
        .status(400)
        .json({ error: "Missing or invalid 'textToTranslate' parameter." });
    }

    const word = await SavedWordModel.findOne({
      textToTranslate: { $regex: new RegExp(`^${textToTranslate}$`, "i") },
    });

    if (word) {
      // Word exists in the database
      res.json({ exists: true });
      logger.info("Word exists in the database");
    } else {
      // Word does not exist in the database
      res.json({ exists: false });
      logger.info("Word does not exist in the database");
    }
  } catch (err) {
    console.error("Error checking data:", err);
    res.status(500).json({ error: "Internal server error" });
    logger.error("Error in checking data");
  }
};

const updateMessage = async (req, res) => {
  try {
    // Extract data from the request body
    const { message } = req.body;
    const id = req.params.id;

    // Validate the ID: ensure it's either a string or a valid ObjectId
    if (!id || typeof id !== "string" || !isValidObjectId(id)) {
      return res.status(403).json({
        message: "Invalid or missing user ID! Please provide a valid ID.",
      });
    }

    // Check if an 'id' parameter and 'message' are provided
    if (!message || typeof message !== "string") {
      return res
        .status(400)
        .json({ error: "Missing OR invalid 'message' parameter." });
      logger.error("Missing 'message' parameter");
    }

    // Find the translation record by ID and update the 'message' field
    const updatedTranslation = await SavedWordModel.findByIdAndUpdate(
      id,
      { message },
      { new: true } // This option returns the updated document
    );

    if (!updatedTranslation) {
      logger.error("Translation not found");
      return res.status(404).json({ error: "Translation not found." });
    }

    res.json(updatedTranslation);
    logger.info("Message updated successfully");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the message." });
    logger.error("Error in updating message");
  }
};
const getSavedWord = async (req, res) => {
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
    const savedRecords = await SavedWordModel.find({ userID: id }).sort({
      createdAt: -1,
    });

    res.json({
      response: savedRecords,
    });
    logger.info("User's history fetched successfully");
  } catch (error) {
    console.error("Error in getHistory:", error);
    res.status(500).json({
      error: "An error occurred while fetching the user's history.",
    });
    logger.error("Error in fetching user's history");
  }
};

export default {
  createSavedWord,
  getSavedWord,
  deleteSavedWord,
  deleteWord,
  getSavedWordExist,
  updateMessage,
};
