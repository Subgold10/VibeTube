import mongoose from "mongoose";

// History schema setup
const HistorySchema = new mongoose.Schema(
  {
    // ID of the user who watched the video
    userId: {
      type: String,
      required: true,
    },

    // ID of the video that was watched
    videoId: {
      type: String,
      required: true,
    },

    // Timestamp when the video was watched
    watchedAt: {
      type: Date,
      default: Date.now,
    },

    // Duration watched (in seconds) - optional for future use
    watchDuration: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // automatic adds timestamps
  }
);

// Create compound index to prevent duplicate entries for same user-video combination
HistorySchema.index({ userId: 1, videoId: 1 }, { unique: true });

// exporting history model
export default mongoose.model("History", HistorySchema);
