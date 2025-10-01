import express from "express";
import { verifyToken } from "../middlewares/tokenVerification.js";
import {
  createNewChannel,
  getChannel,
  updateChannel,
} from "../controllers/channelController.js";
import { validateChannelCreation } from "../middlewares/validation.js";

const channelRouter = express.Router();

// Channel management endpoint definitions
channelRouter.post("/", verifyToken, validateChannelCreation, createNewChannel); // Initialize new channel

channelRouter.get("/:userId", getChannel); // Retrieve channel by user identifier

channelRouter.put("/", verifyToken, validateChannelCreation, updateChannel); // Update channel information

export default channelRouter;
