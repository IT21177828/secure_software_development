import { application, response } from "express";
import BadWordModel from "../models/BadWordsModel.js";
import { myPromises } from "../controllers/myPromise.js";
import logger from "../logger/logger.js";
//show all list of B words

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

const store = (req, res) => {
  const name = req.body.params.name;
  const textToTranslate = req.body.params.textToTranslate;

  console.log("Logging" + name);
  console.log("Logging" + textToTranslate);

  if (!name || !textToTranslate) {
    logger.error("Name and textToTranslate must be provided.");
    return res.status(400).json({
      message: "Name and textToTranslate must be provided.",
    });
  }

  let badPhase = new BadWordModel({
    userID: name,
    badPhase: textToTranslate,
  });

  badPhase
    .save()
    .then((response) => {
      console.log("first" + response);
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

//detect B word

const checkBword = (req, res, next) => {
  const phase = req.body.params.textToTranslate;

  console.log("Checkiiiing" + req.body);

  myPromises(phase)
    .then((result) => {
      console.log(result);
      if (result.hasBadWords) {
        logger.warn("Bad word detected in the text:", phase);
        next();
      } else {
        res.send(result);
        logger.info("No bad words detected in the text:", phase);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send("error occured!");
      logger.error("Error checking bad words:", err);
    });
};
const remove = (req, res) => {
  const wordID = req.body.ID;
  BadWordModel.findByIdAndDelete(wordID)
    .then(() => {
      res.json({
        message: "Post deleted success fully!",
      });
      logger.info("Bad word deleted successfully");
    })
    .catch(() => {
      res.json({
        message: "error ocured deleting!",
      });
      logger.error("Error deleting bad word:", err);
    });
};

const getAllBWordsById = (req, res) => {
  // const id = req.body.params.id;
  const id = req.query.user || req.body.params?.id;

  if (!id) {
    logger.error("User not found Login!");
    return res.status(403).json({
      message: "User not found Login!",
    });
  }

  try {
    BadWordModel.find({ userID: id })
      .sort({ createdAt: -1 })
      .then((response) => {
        console.log("first");
        res.json({
          response,
        });
        logger.info("Bad words fetched successfully");
      })
      .catch(() => {
        console.log("Error");
        res.json({
          message: "error ocured deleting!",
        });
        logger.error("Error fetching bad words:", err);
      });
  } catch (error) {
    console.log(error);
    res.json({
      message: "error ocured deleting!",
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
