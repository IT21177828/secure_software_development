import express from "express";

import {
  createMembership,
  updateMembershipInfo,
  deleteMembership,
  viewMembership,
  viewMembershipUsingId,
} from "../controllers/memberShipController.js";
import { logRequestDetails } from "../middleware/loggerMiddleware.js";
const membershipTypeRouter = express.Router();

membershipTypeRouter.post("/", logRequestDetails, createMembership);
membershipTypeRouter.put(
  "/update/:id",
  logRequestDetails,
  updateMembershipInfo
);
membershipTypeRouter.delete("/delete/:id", logRequestDetails, deleteMembership);
membershipTypeRouter.get("/view", logRequestDetails, viewMembership);
membershipTypeRouter.get("/view/:id", logRequestDetails, viewMembershipUsingId);

export default membershipTypeRouter;
