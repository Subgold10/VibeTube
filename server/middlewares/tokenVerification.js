import jwt from "jsonwebtoken";
import { createError } from "../error.js";

// Authentication token validation middleware
export const verifyToken = (request, response, nextHandler) => {
  console.log("Processing authentication for:", request.method, request.path);
  console.log("Request cookies:", request.cookies);

  const accessToken = request.cookies?.access_token;

  if (!accessToken) {
    console.log("Authentication token not provided");
    return nextHandler(createError(401, "User authentication required."));
  }

  // Validate token using JWT secret configuration
  jwt.verify(
    accessToken,
    process.env.JWT,
    (verificationError, decodedUserData) => {
      if (verificationError) {
        console.log("Token validation failed:", verificationError.message);
        return nextHandler(
          createError(403, "Token is invalid or has expired.")
        );
      }

      console.log("Token validation successful, user data:", decodedUserData);
      request.user = decodedUserData;
      nextHandler();
    }
  );
};
