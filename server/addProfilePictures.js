import mongoose from "mongoose";
import User from "./models/User.js";
import dotenv from "dotenv";
dotenv.config();

// Replace with your Atlas connection string
const MONGO_URI =
  "mongodb+srv://yoi1:fywkDt3P0hFnNSvi@cluster0.n0r5fqd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function addProfilePictures() {
  await mongoose.connect(MONGO_URI);

  // Profile picture URLs for different users
  const profilePictures = {
    Alice:
      "https://dl.memuplay.com/new_market/img/com.vicman.newprofilepic.icon.2025-01-21-19-36-35.png",
    Bob: "https://i.pinimg.com/736x/67/b4/96/67b49639339ccdadf672c78cc77a58b9.jpg",
    Charlie:
      "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/b367acac-2ef7-42e6-a6cc-2264a7212b61/dg9xlp3-fe6c857b-78c1-44f2-8c40-a85005444cea.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2IzNjdhY2FjLTJlZjctNDJlNi1hNmNjLTIyNjRhNzIxMmI2MVwvZGc5eGxwMy1mZTZjODU3Yi03OGMxLTQ0ZjItOGM0MC1hODUwMDU0NDRjZWEuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.8wAoDJx9cjA8LZ1N4JQJH9YfOBkZOVFY-qEwlPd3nLo",
  };

  try {
    // Update users who don't have profile pictures
    for (const [name, imgUrl] of Object.entries(profilePictures)) {
      const user = await User.findOne({ name });
      if (user && !user.img) {
        await User.updateOne({ name }, { img: imgUrl });
        console.log(`Added profile picture for ${name}`);
      } else if (user && user.img) {
        console.log(`${name} already has a profile picture`);
      } else {
        console.log(`User ${name} not found`);
      }
    }

    console.log("Profile picture update completed!");
  } catch (error) {
    console.error("Error updating profile pictures:", error);
  }

  mongoose.disconnect();
}

addProfilePictures();
