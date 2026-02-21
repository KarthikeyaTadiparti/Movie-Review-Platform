import { Request, Response } from "express";
import wrapAsync from "../utils/wrap-async.ts";
import * as reviewService from "../services/reviews-services.ts";
import ExpressError from "../middlewares/errorhandler.ts";

export const handleCreateReview = wrapAsync(async (req: Request, res: Response) => {
    const { id: movieId } = req.params;
    const userId = (req as any).user.id;
    const { rating, reviewText } = req.body;

    const review = await reviewService.createReview({
        userId,
        movieId: Number(movieId),
        rating,
        reviewText,
    });

    return res.status(201).json({ status: true, data: review });
});

export const handleGetMovieReviews = wrapAsync(async (req: Request, res: Response) => {
    const { id: movieId } = req.params;
    const reviews = await reviewService.getReviewsByMovieId(Number(movieId));
    return res.status(200).json({ status: true, data: reviews });
});
