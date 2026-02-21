import { Router } from "express";
import * as userController from "../controllers/user-controller.ts";
import { ensureAuthentication } from "../middlewares/auth.ts";

const router = Router();

// Profile Routes
router.get("/:id", userController.handleGetUserProfile);
router.put("/profile", ensureAuthentication, userController.handleUpdateProfile);

// Watchlist Routes
router.get("/:id/watchlist", userController.handleGetWatchlist);
router.post("/watchlist/:id", ensureAuthentication, userController.handleAddToWatchlist);
router.delete("/watchlist/:movieId", ensureAuthentication, userController.handleRemoveFromWatchlist);

export default router;
