import express from "express";
import userController from "../controllers/userController.js";

const userRouter = express.Router();

// import { registerUser,loginUser, checkAge, adminAccount } from '../controller/userController.js';

import { registerUser, checkAge } from "../controllers/userController.js";
import { logRequestDetails } from "../middleware/loggerMiddleware.js";

userRouter.post("/", logRequestDetails, registerUser);
userRouter.post(
  "/login",
  userController.loginLimiter,
  logRequestDetails,
  userController.loginUser
);
userRouter.get("/checkAge", logRequestDetails, checkAge);

userRouter.post(
  "/refresh",
  logRequestDetails,
  userController.verify,
  userController.refresh
);
userRouter.post(
  "/details",
  logRequestDetails,
  userController.verify,
  userController.userDetails
);
userRouter.post(
  "/showName",
  logRequestDetails,
  userController.verify,
  userController.showName
);

// userRouter.post('/admin', adminAccount);

export default userRouter;
