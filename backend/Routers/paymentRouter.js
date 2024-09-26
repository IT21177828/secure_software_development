import express from "express";
import { logRequestDetails } from "../middleware/loggerMiddleware.js";
import { makePayment } from "../controllers/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.post("/", logRequestDetails, makePayment);

export default paymentRouter;
