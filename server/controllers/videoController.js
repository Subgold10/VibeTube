import Video from "../models/Video.js";
import { createError } from "../error.js";
import User from "../models/User.js";
import fs from "fs";
import path from "path";

// Upload video with file attachments
export const addVideo = async (request, response) => {
  try {
    console.log("Processing video upload request:", {
      files: request.files ? Object.keys(request.files) : "No files detected",
      body: request.body,
      user: request.user,
    });

    if (!request.files || !request.files.videoFile || !request.files.imgFile) {
      console.log("Required files missing:", request.files);
      return response
        .status(400)
        .json({ error: "Video and thumbnail files are required for upload." });
    }

    if (!request.body.title || !request.body.desc) {
      return response
        .status(400)
        .json({ error: "Video title and description are mandatory fields." });
    }

    const videoContent = new Video({
      userId: request.user.id,
      title: request.body.title,
      desc: request.body.desc,
      tags: request.body.tags ? request.body.tags.split(",") : [],
      videoUrl: `/uploads/${request.files.videoFile[0].filename}`,
      imgUrl: `/uploads/${request.files.imgFile[0].filename}`,
    });

    console.log("Storing video content:", videoContent);
    await videoContent.save(); // Persist to database
    response.status(201).json({
      message: "Video content uploaded successfully",
      video: videoContent,
    });
  } catch (error) {
    console.error("Video upload error:", error);
    response
      .status(500)
      .json({ error: "Upload operation failed. Please attempt again." });
  }
};

// Upload video using URL references
export const addVideos = async (request, response) => {
  try {
    const { title, desc, tags, videoUrl, imgUrl } = request.body;

    // Validate all required fields
    if (!title || !desc || !videoUrl || !imgUrl) {
      return response
        .status(400)
        .json({ error: "All fields must be provided." });
    }

    const videoContent = new Video({
      userId: request.user.id,
      title,
      desc,
      tags: Array.isArray(tags) ? tags : tags.split(","),
      videoUrl,
      imgUrl,
    });

    await videoContent.save();
    response.status(201).json({
      message: "Video content uploaded successfully",
      video: videoContent,
    });
  } catch (error) {
    console.error("Video upload error:", error);
    response
      .status(500)
      .json({ error: "Upload operation failed. Please attempt again." });
  }
};

// Modify existing video content
export const updateVideo = async (request, response, nextHandler) => {
  try {
    console.log("Update video request:", {
      videoId: request.params.id,
      userId: request.user.id,
      updateData: request.body,
    });

    const videoContent = await Video.findById(request.params.id);
    if (!videoContent) {
      console.log("Video not found:", request.params.id);
      return nextHandler(createError(404, "Video content not found."));
    }

    if (request.user.id !== videoContent.userId) {
      console.log("Unauthorized update attempt:", {
        requestUserId: request.user.id,
        videoUserId: videoContent.userId,
      });
      return nextHandler(
        createError(403, "You can only modify your own video content.")
      );
    }

    // Validate update data
    const updateData = {};
    if (
      request.body.title &&
      typeof request.body.title === "string" &&
      request.body.title.trim()
    ) {
      updateData.title = request.body.title.trim();
    }
    if (request.body.desc && typeof request.body.desc === "string") {
      updateData.desc = request.body.desc;
    }
    if (request.body.tags && Array.isArray(request.body.tags)) {
      updateData.tags = request.body.tags;
    }

    if (Object.keys(updateData).length === 0) {
      return nextHandler(createError(400, "No valid update data provided."));
    }

    const modifiedVideo = await Video.findByIdAndUpdate(
      request.params.id,
      { $set: updateData },
      { new: true }
    );

    console.log("Video updated successfully:", modifiedVideo._id);
    response.status(200).json(modifiedVideo);
  } catch (error) {
    console.error("Error updating video:", error);
    nextHandler(error);
  }
};

// Remove video content from system
export const removeVideo = async (request, response, nextHandler) => {
  try {
    const videoContent = await Video.findById(request.params.id);
    if (!videoContent)
      return nextHandler(createError(404, "Video content not found."));
    if (request.user.id === videoContent.userId) {
      // Remove video and image files if they are local
      const baseDir = path.resolve();
      const videoPath =
        videoContent.videoUrl && videoContent.videoUrl.startsWith("/uploads/")
          ? path.join(baseDir, videoContent.videoUrl)
          : null;
      const imgPath =
        videoContent.imgUrl && videoContent.imgUrl.startsWith("/uploads/")
          ? path.join(baseDir, videoContent.imgUrl)
          : null;
      if (videoPath && fs.existsSync(videoPath)) {
        try {
          fs.unlinkSync(videoPath);
        } catch (e) {
          console.error("Failed to delete video file:", e);
        }
      }
      if (imgPath && fs.existsSync(imgPath)) {
        try {
          fs.unlinkSync(imgPath);
        } catch (e) {
          console.error("Failed to delete image file:", e);
        }
      }
      await Video.findByIdAndDelete(request.params.id);
      response.status(200).json("Video content removed successfully.");
    } else {
      return nextHandler(
        createError(403, "You can only remove your own video content.")
      );
    }
  } catch (error) {
    nextHandler(error);
  }
};

// Retrieve specific video content
export const getVideo = async (request, response, nextHandler) => {
  try {
    const videoContent = await Video.findById(request.params.id);
    if (!videoContent)
      return nextHandler(createError(404, "Video content not found."));
    response.status(200).json(videoContent);
  } catch (error) {
    nextHandler(error);
  }
};

// Retrieve all videos from specific user
export const getUserVideos = async (request, response, nextHandler) => {
  try {
    const userVideos = await Video.find({ userId: request.params.userId });
    response.status(200).json(userVideos);
  } catch (error) {
    nextHandler(error);
  }
};

// Retrieve videos from subscribed channels
export const subsVideo = async (request, response, nextHandler) => {
  try {
    const userProfile = await User.findById(request.user.id);
    const subscribedChannels = userProfile.subscribedUsers;

    const videoCollection = await Promise.all(
      subscribedChannels.map((channelId) => {
        return Video.find({ userId: channelId });
      })
    );
    response.status(200).json(videoCollection.flat());
  } catch (error) {
    nextHandler(error);
  }
};

// Retrieve videos by tag criteria
export const getVideoByTag = async (request, response, nextHandler) => {
  const tagList = request.query.tags.split(",");
  try {
    const taggedVideos = await Video.find({ tags: { $in: tagList } }).limit(20);
    response.status(200).json(taggedVideos);
  } catch (error) {
    nextHandler(error);
  }
};

// Search videos by title
export const searchVideo = async (request, response, nextHandler) => {
  const searchQuery = request.query.q;
  try {
    const searchResults = await Video.find({
      title: { $regex: searchQuery, $options: "i" },
    }).limit(40);
    response.status(200).json(searchResults);
  } catch (error) {
    nextHandler(error);
  }
};

// Retrieve random video selection
export const random = async (request, response, nextHandler) => {
  try {
    const randomVideos = await Video.aggregate([{ $sample: { size: 40 } }]);
    response.status(200).json(randomVideos);
  } catch (error) {
    nextHandler(error);
  }
};

// Retrieve trending videos (most viewed in last 7 days)
export const trending = async (request, response, nextHandler) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const trendingVideos = await Video.find({
      createdAt: { $gte: sevenDaysAgo },
    })
      .sort({ views: -1, createdAt: -1 })
      .limit(40);

    response.status(200).json(trendingVideos);
  } catch (error) {
    nextHandler(error);
  }
};
