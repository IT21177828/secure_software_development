import express from "express";
import SavedWordController from "../controllers/SavedWordController.js";
import { logRequestDetails } from "../middleware/loggerMiddleware.js";
const savedWordRouter = express.Router();

savedWordRouter.post(
  "/saved",
  logRequestDetails,
  SavedWordController.createSavedWord
);
savedWordRouter.get(
  "/getSavedWord",
  logRequestDetails,
  SavedWordController.getSavedWord
);
savedWordRouter.get(
  "/existSavedWord",
  logRequestDetails,
  SavedWordController.getSavedWordExist
);
savedWordRouter.delete(
  "/deleteSavedWord/:id",
  logRequestDetails,
  SavedWordController.deleteSavedWord
);
savedWordRouter.delete(
  "/delete",
  logRequestDetails,
  SavedWordController.deleteWord
);
savedWordRouter.put(
  "/updateMessage/:id",
  logRequestDetails,
  SavedWordController.updateMessage
);

export default savedWordRouter;
