import { Router } from "express";
import { User } from "../models/User.js";

export const authRouter = Router();

// Intentionally vulnerable classroom endpoint.
// Students must discover and fix its validation, security, and error-handling problems.
authRouter.post("/register", async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
});
