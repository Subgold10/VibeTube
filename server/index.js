import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import channelRoutes from "./routes/channelRoutes.js";
import authRoutes from "./routes/authentication.js";
import userRoutes from "./routes/userRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();

const serverApp = express();

// Database connection setup
const initializeDatabase = async () => {
  mongoose
    .connect(process.env.MONGO)
    .then(async () => {
      console.log("Database connection established successfully ✅");
      // Initialize default administrator account
      const existingAdmin = await User.findOne({ name: "admin" });
      if (!existingAdmin) {
        const saltRounds = bcrypt.genSaltSync(10);
        // More secure admin password
        const hashedPassword = bcrypt.hashSync("Admin@Secure2024!", saltRounds);
        await User.create({
          name: "admin",
          email: "admin@example.com",
          password: hashedPassword,
          img: "",
          subscribers: 0,
          subscribedUsers: [],
        });
        console.log(
          "Administrator account initialized: admin / Admin@Secure2024!"
        );
      } else {
        console.log("Administrator account already present in database");
      }
    })
    .catch((databaseError) => {
      console.error("Database connection failed:", databaseError);
    });
};

// Cross-origin resource sharing configuration
serverApp.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Middleware for parsing cookies and JSON data
serverApp.use(cookieParser());
serverApp.use(express.json());

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);

// Serve static files from uploads directory
serverApp.use(
  "/uploads",
  express.static(path.join(currentDirectory, "uploads"))
);

// API endpoint routing
serverApp.use("/api/auth", authRoutes);
serverApp.use("/api/users", userRoutes);
serverApp.use("/api/videos", videoRoutes);
serverApp.use("/api/channels", channelRoutes);
serverApp.use("/api/comments", commentRoutes);
serverApp.use("/api/history", historyRoutes);

// Global error handling middleware
serverApp.use((error, request, response, nextHandler) => {
  const errorCode = error.status || 500;
  const errorMessage = error.message || "An unexpected error occurred.";
  response.status(errorCode).json({
    success: false,
    status: errorCode,
    message: errorMessage,
  });
});

// Start the application server
const serverPort = process.env.PORT || 7272;
serverApp.listen(serverPort, () => {
  initializeDatabase();
  console.log(`Application server running on port ${serverPort}`);
});
