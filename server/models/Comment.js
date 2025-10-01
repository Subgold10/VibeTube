import mongoose from "mongoose";

// Comment schema setup
const CommentSchema = new mongoose.Schema(
  {
    // ID of the user who posted the comment
    userId: {
      type: String,
      required: true,
    },

    // ID of the video on which comment added
    videoId: {
      type: String,
      required: true,
    },

    // Comment string
    desc: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // automatic adds timestamps
  }
);

// exporting comment model
export default mongoose.model("Comment", CommentSchema);
