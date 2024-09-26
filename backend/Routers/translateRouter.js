import express from "express";
import translatorController from "../controllers/translatorController.js";
import { logRequestDetails } from "../middleware/loggerMiddleware.js";
const translateRouter = express.Router();

translateRouter.get(
  "/languages",
  logRequestDetails,
  translatorController.language
);

translateRouter.get(
  "/translation",
  logRequestDetails,
  translatorController.translate
);

export default translateRouter;
