import { Router } from "express";
import authRouter from "./auth-router.ts";
import movieRouter from "./movie-router.ts";
import userRouter from "./user-router.ts";

const router = Router();

// Modularized Routes
router.use("/auth", authRouter);
router.use("/movies", movieRouter);
router.use("/users", userRouter);

export default router;
