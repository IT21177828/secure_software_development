import express from "express";
import historyController from "../controllers/historyController.js";
import userController from "../controllers/userController.js";
import { logRequestDetails } from "../middleware/loggerMiddleware.js";
const historyRouter = express.Router();

//Broken Authentication vulnerability is fixed by adding userController.verify middleware
historyRouter.post(
  "/save",
  userController.verify,
  historyController.createHistory
);
historyRouter.get(
  "/getHistory",
  logRequestDetails,
  historyController.getHistory
);
historyRouter.delete(
  "/deleteHistory/:id",
  logRequestDetails,
  historyController.deleteHistory
);
historyRouter.delete(
  "/clearAllData",
  logRequestDetails,
  historyController.clearAllData
);

export default historyRouter;
