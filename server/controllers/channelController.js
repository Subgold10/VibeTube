import Channel from "../models/Channel.js";
import { createError } from "../error.js";

// Initialize new channel for user
export const createNewChannel = async (request, response, nextHandler) => {
  try {
    const currentChannel = await Channel.findOne({ userId: request.user.id });
    if (currentChannel) {
      return nextHandler(
        createError(400, "Channel already exists for this user!")
      );
    }

    // Initialize channel object with request parameters
    const channelInstance = new Channel({
      userId: request.user.id,
      name: request.body.name,
      description: request.body.description,
      banner: request.body.banner || "",
      img: request.body.img || "",
    });

    const persistedChannel = await channelInstance.save(); // Persist channel data to database
    return response.status(200).json(persistedChannel);
  } catch (error) {
    nextHandler(error);
  }
};

// Retrieve channel information
export const getChannel = async (request, response, nextHandler) => {
  try {
    const channelInfo = await Channel.findOne({
      userId: request.params.userId,
    });
    if (!channelInfo)
      return nextHandler(createError(404, "Channel information not found!"));
    response.status(200).json(channelInfo);
  } catch (error) {
    nextHandler(error);
  }
};

// Update channel information
export const updateChannel = async (request, response, nextHandler) => {
  try {
    const channelInfo = await Channel.findOneAndUpdate(
      { userId: request.user.id },
      {
        name: request.body.name,
        description: request.body.description,
        banner: request.body.banner,
        img: request.body.img,
      },
      { new: true }
    );

    if (!channelInfo)
      return nextHandler(createError(404, "Channel not found!"));

    response.status(200).json(channelInfo);
  } catch (error) {
    nextHandler(error);
  }
};
