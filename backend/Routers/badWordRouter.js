import express from "express";
import BadWords from "bad-words";
import badWordController from "../controllers/badWordController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import userController from "../controllers/userController.js";
import { logRequestDetails } from "../middleware/loggerMiddleware.js";
const badWordRouter = express.Router();
const filter = new BadWords({ placeHolder: "X" });
filter.addWords("hank");

badWordRouter.get("/", logRequestDetails, (req, res) => {
  res.send("<h1>hey bad<h1>");
  console.log(filter.clean("Don't be a hank hell"));
});


badWordRouter.get("/all", logRequestDetails, userController.verifyAccessToken, userController.verifyAdmin, badWordController.index);
badWordRouter.get(
  "/badpost",
  logRequestDetails,
  badWordController.getAllBWordsById
);
badWordRouter.post(
  "/word",
  logRequestDetails,
  badWordController.checkBword,
  badWordController.store
);
badWordRouter.delete("/a", logRequestDetails, badWordController.remove);


export default badWordRouter;
