import express from "express";
import {
  addToHistory,
  getUserHistory,
  clearHistory,
  removeFromHistory,
} from "../controllers/historyController.js";

const historyRouter = express.Router();

// Add video to history
historyRouter.post("/add", addToHistory);

// Get user's history
historyRouter.get("/user/:userId", getUserHistory);

// Clear user's history
historyRouter.delete("/user/:userId", clearHistory);

// Remove specific video from history
historyRouter.delete("/user/:userId/video/:videoId", removeFromHistory);

export default historyRouter;
