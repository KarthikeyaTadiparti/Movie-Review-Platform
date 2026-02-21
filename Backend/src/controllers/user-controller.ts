import { Request, Response } from "express";
import wrapAsync from "../utils/wrap-async.ts";
import * as userService from "../services/users-services.ts";
import * as watchlistService from "../services/watchlist-services.ts";
import * as reviewService from "../services/reviews-services.ts";
import ExpressError from "../middlewares/errorhandler.ts";

export const handleGetUserProfile = wrapAsync(async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    const user = await userService.getUserById(userId);
    if (!user) throw new ExpressError(404, "User not found");

    const reviews = await reviewService.getReviewsByUserId(userId);

    return res.status(200).json({
        status: true,
        data: {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture,
                createdAt: user.createdAt,
            },
            reviews,
        },
    });
});

export const handleUpdateProfile = wrapAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const updatedUser = await userService.updateUser(userId, req.body);
    return res.status(200).json({ status: true, data: updatedUser });
});

export const handleGetWatchlist = wrapAsync(async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    const list = await watchlistService.getWatchlistByUserId(userId);
    return res.status(200).json({ status: true, data: list });
});

export const handleAddToWatchlist = wrapAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { id: movieId } = req.params;
    const item = await watchlistService.addToWatchlist({
        userId,
        movieId: Number(movieId),
    });
    return res.status(201).json({ status: true, data: item });
});

export const handleRemoveFromWatchlist = wrapAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { movieId } = req.params;
    await watchlistService.removeFromWatchlist(userId, Number(movieId));
    return res.status(200).json({ status: true, message: "Removed from watchlist" });
});
