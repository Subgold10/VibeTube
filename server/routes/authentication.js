import express from "express";
import { signUp, signIn } from "../controllers/authentication.js";
import { validateUserRegistration } from "../middlewares/validation.js";

const authRouter = express.Router();

// Authentication endpoint definitions
authRouter.post("/signup", validateUserRegistration, signUp); // Create new user account

authRouter.post("/signin", signIn); // Authenticate existing user

export default authRouter;
