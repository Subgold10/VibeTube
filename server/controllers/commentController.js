import Comment from "../models/Comment.js";
import { createError } from "../error.js";
import Video from "../models/Video.js";

// Create new comment entry
export const addNewComment = async (request, response, nextHandler) => {
  if (!request.user)
    return nextHandler(
      createError(401, "Authentication required to post comments.")
    );
  // Initialize comment object with frontend data
  const commentEntry = new Comment({
    ...request.body,
    videoId: String(request.body.videoId),
    userId: request.user.id,
  });
  try {
    const persistedComment = await commentEntry.save(); // Store comment in database
    response.status(200).json(persistedComment);
  } catch (error) {
    nextHandler(error);
  }
};

// Remove comment from system
export const removeComment = async (request, response, nextHandler) => {
  try {
    // Locate comment by identifier from URL
    const targetComment = await Comment.findById(request.params.id);
    if (!targetComment)
      return nextHandler(createError(404, "Comment entry not found."));
    const relatedVideo = await Video.findById(targetComment.videoId);
    if (!relatedVideo) {
      await Comment.findByIdAndDelete(request.params.id);
      return response
        .status(200)
        .json({ message: "Comment entry removed successfully." });
    }
    // Verify user permissions for comment deletion
    if (
      request.user.id === targetComment.userId ||
      request.user.id === relatedVideo.userId
    ) {
      await Comment.findByIdAndDelete(request.params.id);
      return response
        .status(200)
        .json({ message: "Comment entry deleted successfully." });
    } else {
      return nextHandler(
        createError(403, "You can only remove your own comments.")
      );
    }
  } catch (error) {
    console.error("Comment deletion error:", error);
    nextHandler(error);
  }
};

// Retrieve all comments for specific video
export const getAllComments = async (request, response, nextHandler) => {
  try {
    const videoComments = await Comment.find({
      videoId: String(request.params.videoId),
    });
    response.status(200).json(videoComments);
  } catch (error) {
    nextHandler(error);
  }
};
