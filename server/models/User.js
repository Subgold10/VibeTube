import mongoose from "mongoose";

// User schema setup
const UserSchema = new mongoose.Schema(
  {
    //user name
    name: {
      type: String,
      required: true,
      unique: true,
    },

    // user email address
    email: {
      type: String,
      required: true,
      unique: true,
    },

    // user password
    password: {
      type: String,
    },

    // user profile pic
    img: {
      type: String,
    },

    // subscriber count
    subscribers: {
      type: Number,
      default: 0,
    },

    subscribedUsers: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
); // automatic adds timestapms

// exporting user model
export default mongoose.model("User", UserSchema);
