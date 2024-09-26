import BadWordModel from "../models/BadWordsModel.js";
import { myPromises } from "../controllers/myPromise.js";
import logger from "../logger/logger.js";
//show all list of B words
import mongoose from "mongoose";

//function to validate if a string is a valid MongoDB ObjectId or not
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

//show all list of Bad words
const index = (req, res, next) => {
  BadWordModel.find()
    .then((response) => {
      res.json({
        response,
      });
      logger.info("Bad words fetched successfully");
    })
    .catch((err) => {
      res.json({
        messsage: "An Error occured!",
      });
      logger.error("Error fetching bad words:", err);
    });
};

//store Bad word
const store = (req, res) => {
  const id = req.body.params.name;
  const textToTranslate = req.body.params.textToTranslate;

  if (!id || typeof id !== "string" || !isValidObjectId(id)) {
    return res.status(403).json({
      message: "Invalid or missing user ID! Please provide a valid ID.",
    });
    logger.error("Name and textToTranslate must be provided.");
  }

  let badPhase = new BadWordModel({
    userID: id,
    badPhase: textToTranslate,
  });

  badPhase
    .save()
    .then((response) => {
      res.json({
        message: "post added successfully!",
      });
      logger.info("Bad word added successfully");
    })
    .catch((err) => {
      res.json({
        message: "An error occured!",
      });
      logger.error("Error adding bad word:", err);
    });
};

//detect Bad word
const checkBword = (req, res, next) => {
  const phase = req.body.params.textToTranslate;

  if (!phase || typeof phase !== "string") {
    return res.status(403).json({
      message:
        "Invalid or missing text for identify badword! Please provide a valid text.",
    });
  }
  myPromises(phase)
    .then((result) => {
      if (result.hasBadWords) {
        logger.warn("Bad word detected in the text:", phase);
        next();
      } else{
      res.send(result);
      logger.info("No bad words detected in the text:", phase);
      } 
    })
    .catch((err) => {
      console.log(err);
      logger.error("Error checking bad words:", err);
      res.status(400).send("Error occured While checking bad word!");
    });
};

const remove = (req, res) => {
  const wordID = req.body.id;

  if (!wordID || typeof wordID !== "string" || !isValidObjectId(wordID)) {
    return res.status(403).json({
      message: "Invalid or missing user ID! Please provide a valid ID.",
    });
  }

  BadWordModel.findByIdAndDelete(wordID)
    .then((response) => {
      if (!response) {
        return res.status(404).json({
          message: "Post not found!",
        });
      }
      res.json({
        message: "Post deleted successfully!",
      });
      logger.info("Bad word deleted successfully");
    })
    .catch(() => {
      res.json({
        message: "Error ocured while deleting!",
      });
      logger.error("Error deleting bad word:", err);
    });
};

// Get all bad words by user ID After no sql injection
const getAllBWordsById = async (req, res) => {
  let id = req.query.user || req.body.params?.id;

  // Validate the ID: ensure it's either a string or a valid ObjectId
  if (!id || typeof id !== "string" || !isValidObjectId(id)) {
    return res.status(403).json({
      message: "Invalid or missing user ID! Please provide a valid ID.",
    });
    logger.error("User not found Login!");
  }

  try {
    // Perform the query securely with validated ID
    const response = await BadWordModel.find({ userID: id }).sort({
      createdAt: -1,
    });

    // If records are found, return them
    return res.status(200).json({
      response,
    });
    logger.info("Bad words fetched successfully");
  } catch (error) {
    console.error("Error fetching data:", error);

    // General error response
    return res.status(500).json({
      message: "An error occurred while fetching the data.",
      error: error.message,
    });
    logger.error("Error fetching bad words:", err);
  }
};

export default {
  index,
  store,
  checkBword,
  remove,
  getAllBWordsById,
};
