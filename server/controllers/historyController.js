import History from "../models/History.js";
import Video from "../models/Video.js";

// Add video to user's history
export const addToHistory = async (req, res, next) => {
  try {
    const { userId, videoId } = req.body;

    if (!userId || !videoId) {
      return res
        .status(400)
        .json({ error: "User ID and Video ID are required" });
    }

    // Check if video exists
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    // Try to add to history (will update if already exists due to unique index)
    const historyEntry = await History.findOneAndUpdate(
      { userId, videoId },
      { watchedAt: new Date() },
      { upsert: true, new: true }
    );

    res.status(200).json(historyEntry);
  } catch (error) {
    next(error);
  }
};

// Get user's video history
export const getUserHistory = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Get history entries with video details
    const history = await History.find({ userId })
      .sort({ watchedAt: -1 }) // Most recent first
      .limit(50); // Limit to last 50 videos

    // Get video details for each history entry
    const videoIds = history.map((entry) => entry.videoId);
    const videos = await Video.find({ _id: { $in: videoIds } });

    // Combine history with video data
    const historyWithVideos = history
      .map((entry) => {
        const video = videos.find((v) => v._id.toString() === entry.videoId);
        return {
          ...entry.toObject(),
          video: video || null,
        };
      })
      .filter((entry) => entry.video !== null); // Remove entries with deleted videos

    res.status(200).json(historyWithVideos);
  } catch (error) {
    next(error);
  }
};

// Clear user's history
export const clearHistory = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    await History.deleteMany({ userId });
    res.status(200).json({ message: "History cleared successfully" });
  } catch (error) {
    next(error);
  }
};

// Remove specific video from history
export const removeFromHistory = async (req, res, next) => {
  try {
    const { userId, videoId } = req.params;

    if (!userId || !videoId) {
      return res
        .status(400)
        .json({ error: "User ID and Video ID are required" });
    }

    await History.findOneAndDelete({ userId, videoId });
    res.status(200).json({ message: "Video removed from history" });
  } catch (error) {
    next(error);
  }
};
