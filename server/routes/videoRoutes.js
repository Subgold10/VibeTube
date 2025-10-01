import express from "express";
import {
  addVideo,
  addVideos,
  updateVideo,
  removeVideo,
  getVideo,
  getUserVideos,
  subsVideo,
  getVideoByTag,
  searchVideo,
  random,
  trending,
} from "../controllers/videoController.js";
import { verifyToken } from "../middlewares/tokenVerification.js";
import { uploadFiles, handleMulterError } from "../middlewares/multerConfig.js";
import {
  validateVideoUpload,
  validateVideoUpdate,
  validateSearchQuery,
} from "../middlewares/validation.js";

const videoRouter = express.Router();

// Video content management endpoint definitions
videoRouter.post(
  "/",
  verifyToken,
  uploadFiles,
  handleMulterError,
  validateVideoUpload,
  addVideo
); // Upload video with files
videoRouter.post("/add", verifyToken, validateVideoUpload, addVideos); // Upload video using URL references
videoRouter.put("/:id", verifyToken, validateVideoUpdate, updateVideo); // Modify existing video content
videoRouter.delete("/:id", verifyToken, removeVideo); // Remove video from system
videoRouter.get("/find/:id", getVideo); // Retrieve video by identifier
videoRouter.get("/user/:userId", getUserVideos); // Retrieve all videos from specific user
videoRouter.get("/sub", verifyToken, subsVideo); // Retrieve videos from subscribed channels
videoRouter.get("/tags", getVideoByTag); // Retrieve videos by tag criteria
videoRouter.get("/search", validateSearchQuery, searchVideo); // Search videos by title content
videoRouter.get("/random", random); // Retrieve random video selection
videoRouter.get("/trend", trending); // Retrieve trending videos

export default videoRouter;
