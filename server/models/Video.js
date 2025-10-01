import mongoose from "mongoose";

// Video schema setup
const VideoSchema = new mongoose.Schema(
  {
    // user id who upload the video
    userId: {
      type: String,
      required: true,
    },
    // title of the video
    title: {
      type: String,
      required: true,
    },
    //description of the video
    desc: {
      type: String,
      required: true,
    },
    //thumbnail
    imgUrl: {
      type: String,
      required: true,
    },
    // viddeo url
    videoUrl: {
      type: String,
      required: true,
    },
    // number of views
    views: {
      type: Number,
      default: 0,
    },
    // tags associated with the video
    tags: {
      type: [String],
      default: [],
    },
    //  likes
    likes: {
      type: [String],
      default: [],
    },
    // dislike
    dislikes: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // automatic adds timestamp
  }
);

// exporting video model
export default mongoose.model("Video", VideoSchema);
