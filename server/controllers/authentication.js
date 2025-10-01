import mongoose from "mongoose";
import User from "../models/User.js";
import Channel from "../models/Channel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createError } from "../error.js";

// User registration handler
export const signUp = async (request, response, nextHandler) => {
  try {
    const saltValue = bcrypt.genSaltSync(10);
    const encryptedPassword = bcrypt.hashSync(request.body.password, saltValue); // Encrypt user password
    const userAccount = new User({
      ...request.body,
      password: encryptedPassword,
    }); // Create user instance with encrypted password

    await userAccount.save(); // Persist user data to database

    // Create a default channel for the new user with dummy banner
    const dummyBanners = [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2025&q=80",
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    ];

    const randomBanner =
      dummyBanners[Math.floor(Math.random() * dummyBanners.length)];

    const defaultChannel = new Channel({
      userId: userAccount._id.toString(),
      name: `${userAccount.name}'s Channel`,
      description: "Welcome to my channel!",
      banner: randomBanner,
      img:
        userAccount.img ||
        "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/b367acac-2ef7-42e6-a6cc-2264a7212b61/dg9xlp3-fe6c857b-78c1-44f2-8c40-a85005444cea.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2IzNjdhY2FjLTJlZjctNDJlNi1hNmNjLTIyNjRhNzIxMmI2MVwvZGc5eGxwMy1mZTZjODU3Yi03OGMxLTQ0ZjItOGM0MC1hODUwMDU0NDRjZWEuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.8wAoDJx9cjA8LZ1N4JQJH9YfOBkZOVFY-qEwlPd3nLo",
    });

    await defaultChannel.save();

    response.status(200).send("User account created successfully");
  } catch (error) {
    nextHandler(error);
  }
};

// User login handler
export const signIn = async (request, response, nextHandler) => {
  try {
    const userAccount = await User.findOne({ name: request.body.name }); // Retrieve user from database by username
    if (!userAccount)
      return nextHandler(createError(404, "User account not found in system"));

    const passwordValid = await bcrypt.compare(
      request.body.password,
      userAccount.password
    ); // Validate password

    if (!passwordValid)
      return nextHandler(
        createError(400, "Invalid login credentials provided")
      );

    const accessToken = jwt.sign({ id: userAccount._id }, process.env.JWT); // Generate authentication token
    const { password, ...userData } = userAccount._doc;

    response
      .cookie("access_token", accessToken, {
        httpOnly: true,
      })
      .status(200)
      .json(userData);
  } catch (error) {
    nextHandler(error);
  }
};
