import db from "../config/db.ts";
import { reviews, NewReview } from "../schema/reviews-schema.ts";
import { movies } from "../schema/movies-schema.ts";
import { eq, avg } from "drizzle-orm";
import { updateMovieRating } from "./movies-services.ts";

import { users } from "../schema/users-schema.ts";

export const getReviewsByMovieId = async (movieId: number) => {
    return await db.select({
        id: reviews.id,
        rating: reviews.rating,
        reviewText: reviews.reviewText,
        createdAt: reviews.createdAt,
        userName: users.name,
        userProfilePicture: users.profilePicture
    })
        .from(reviews)
        .innerJoin(users, eq(reviews.userId, users.id))
        .where(eq(reviews.movieId, movieId));
};

export const createReview = async (reviewData: NewReview) => {
    const result = await db.insert(reviews).values(reviewData).returning();

    // Recalculate average rating for the movie
    const stats = await db.select({
        avgRating: avg(reviews.rating)
    }).from(reviews).where(eq(reviews.movieId, reviewData.movieId));

    if (stats[0]?.avgRating) {
        await updateMovieRating(reviewData.movieId, stats[0].avgRating.toString());
    }

    return result[0];
};

export const getReviewsByUserId = async (userId: number) => {
    return await db.select({
        id: reviews.id,
        rating: reviews.rating,
        reviewText: reviews.reviewText,
        createdAt: reviews.createdAt,
        movieId: reviews.movieId,
        movieTitle: movies.title
    })
        .from(reviews)
        .innerJoin(movies, eq(reviews.movieId, movies.id))
        .where(eq(reviews.userId, userId));
};
