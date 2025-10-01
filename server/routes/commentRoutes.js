import express from "express";
import {
  addNewComment,
  removeComment,
  getAllComments,
} from "../controllers/commentController.js";
import { verifyToken } from "../middlewares/tokenVerification.js";
import { validateComment } from "../middlewares/validation.js";

const commentRouter = express.Router();

// Comment management endpoint definitions
commentRouter.post("/", verifyToken, validateComment, addNewComment); // Create new comment entry
commentRouter.delete("/:id", verifyToken, removeComment); // Remove comment from system
commentRouter.get("/:videoId", getAllComments); // Retrieve all comments for video

export default commentRouter;
