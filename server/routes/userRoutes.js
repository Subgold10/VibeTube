import express from "express";
import {
  dislikeVideo,
  getUser,
  likeVideo,
  subscribeUser,
  unsubscribeUser,
} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/tokenVerification.js";

const userRouter = express.Router();

// User management endpoint definitions
userRouter.get("/find/:id", getUser); // Retrieve user profile by identifier

userRouter.put("/sub/:id", verifyToken, subscribeUser); // Subscribe to user channel

userRouter.put("/unsub/:id", verifyToken, unsubscribeUser); // Unsubscribe from user channel

userRouter.put("/like/:videoId", verifyToken, likeVideo); // Add like to video content

userRouter.put("/dislike/:videoId", verifyToken, dislikeVideo); // Add dislike to video content

export default userRouter;
