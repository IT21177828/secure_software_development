import express from "express";
import checkoutController from "../controllers/checkoutController.js";
import { logRequestDetails } from "../middleware/loggerMiddleware.js";
const checkoutRouter = express.Router();

checkoutRouter.post(
  "/saveCheckout",
  logRequestDetails,
  checkoutController.createCheckout
);
checkoutRouter.get("/get", logRequestDetails, checkoutController.getcheckout);

export default checkoutRouter;
