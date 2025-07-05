import mongoose from "mongoose";

// Channel schema setup
const ChannelSchema = new mongoose.Schema(
  {
    //  user id who owns the channel
    userId: {
      type: String,
      required: true,
      unique: true,
    },

    // Channel name
    name: {
      type: String,
      required: true,
    },

    // Channel description
    description: {
      type: String,
    },

    // Number of subscriber
    subscribers: {
      type: Number,
      default: 0,
    },

    // All videos of the channel
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],

    // Channel banner image
    banner: {
      type: String,
      default: "",
    },

    // Channel profile image
    img: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // automatic adds timestamps
  }
);

// Exporting channel model
export default mongoose.model("Channel", ChannelSchema);
