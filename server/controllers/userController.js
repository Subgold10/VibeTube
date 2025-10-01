import User from "../models/User.js";
import Video from "../models/Video.js";

// Retrieve user profile information
export const getUser = async (request, response, nextHandler) => {
  try {
    const userProfile = await User.findById(request.params.id); // Fetch user data from database by identifier
    if (!userProfile) {
      return response.status(404).json({ message: "User not found" });
    }
    response.status(200).json(userProfile);
  } catch (error) {
    nextHandler(error);
  }
};

// Subscribe to a user's channel
export const subscribeUser = async (request, response, nextHandler) => {
  try {
    await User.findByIdAndUpdate(request.user.id, {
      $push: { subscribedUsers: request.params.id },
    });
    await User.findByIdAndUpdate(request.params.id, {
      $inc: { subscribers: 1 },
    });
    response.status(200).json("Successfully subscribed to channel!");
  } catch (error) {
    nextHandler(error);
  }
};

// Unsubscribe from a user's channel
export const unsubscribeUser = async (request, response, nextHandler) => {
  try {
    await User.findByIdAndUpdate(request.user.id, {
      $pull: { subscribedUsers: request.params.id }, // Remove user from subscription list
    });
    await User.findByIdAndUpdate(request.params.id, {
      $inc: { subscribers: -1 }, // Reduce subscriber count
    });
    response.status(200).json("Successfully unsubscribed from channel.");
  } catch (error) {
    nextHandler(error);
  }
};

// Add like to video content
export const likeVideo = async (request, response, nextHandler) => {
  const currentUserId = request.user.id; // Current authenticated user identifier
  const targetVideoId = request.params.videoId;
  console.log("Processing like request:", { currentUserId, targetVideoId });

  try {
    const modifiedVideo = await Video.findByIdAndUpdate(
      targetVideoId,
      {
        $addToSet: { likes: currentUserId }, // Include user in likes collection
        $pull: { dislikes: currentUserId }, // Remove user from dislikes collection
      },
      { new: true }
    );
    console.log("Video like operation completed:", modifiedVideo._id);
    response.status(200).json(modifiedVideo);
  } catch (error) {
    console.log("Error during like operation:", error);
    nextHandler(error);
  }
};

// Add dislike to video content
export const dislikeVideo = async (request, response, nextHandler) => {
  const currentUserId = request.user.id; // Current authenticated user identifier
  const targetVideoId = request.params.videoId;
  try {
    const modifiedVideo = await Video.findByIdAndUpdate(
      targetVideoId,
      {
        $addToSet: { dislikes: currentUserId }, // Include user in dislikes collection
        $pull: { likes: currentUserId }, // Remove user from likes collection
      },
      { new: true }
    );
    response.status(200).json(modifiedVideo);
  } catch (error) {
    nextHandler(error);
  }
};
