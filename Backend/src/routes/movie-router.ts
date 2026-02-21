import { Router } from "express";
import * as movieController from "../controllers/movie-controller.ts";
import * as reviewController from "../controllers/review-controller.ts";
import { ensureAuthentication } from "../middlewares/auth.ts";
import { upload } from "../middlewares/upload.ts";

const router = Router();

// Movie Routes
router.get("/", movieController.handleGetAllMovies);
router.get("/:id", movieController.handleGetMovieById);
router.post("/", ensureAuthentication, upload.single("poster"), movieController.handleCreateMovie);

// Nested Review Routes
router.get("/:id/reviews", reviewController.handleGetMovieReviews);
router.post("/:id/reviews", ensureAuthentication, reviewController.handleCreateReview);

export default router;
