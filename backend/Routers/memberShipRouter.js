import express from "express";
import mongoose from "../db/conn.js";
import { logRequestDetails } from "../middleware/loggerMiddleware.js";
// import {placeMembership} from '../controllers/memberShipController.js';
import {
  activateMembership,
  deactivateMemberShip,
  reactivateMembership,
  getMembershipActivationDetails,
} from "../controllers/placeMembershipPlanController.js";
import userController from "../controllers/userController.js";

const membershipRouter = express.Router();

membershipRouter.post("/", logRequestDetails, activateMembership);
membershipRouter.post(
  "/deactivate/:id",
  logRequestDetails,
  deactivateMemberShip
);
membershipRouter.post(
  "/reactivate/:id",
  logRequestDetails,
  reactivateMembership
);
membershipRouter.post(
  "/getMembershipDetails",
  logRequestDetails,
  getMembershipActivationDetails
);

export default membershipRouter;
