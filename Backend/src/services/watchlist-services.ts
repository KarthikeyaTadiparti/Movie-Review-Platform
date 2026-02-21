import db from "../config/db.ts";
import { watchlist, NewWatchlistItem } from "../schema/watchlist-schema.ts";
import { movies } from "../schema/movies-schema.ts";
import { eq, and } from "drizzle-orm";

export const getWatchlistByUserId = async (userId: number) => {
    return await db
        .select({
            id: watchlist.id,
            addedAt: watchlist.addedAt,
            movie: movies,
        })
        .from(watchlist)
        .innerJoin(movies, eq(watchlist.movieId, movies.id))
        .where(eq(watchlist.userId, userId));
};

export const addToWatchlist = async (data: NewWatchlistItem) => {
    const result = await db.insert(watchlist).values(data).returning();
    return result[0];
};

export const removeFromWatchlist = async (userId: number, movieId: number) => {
    await db
        .delete(watchlist)
        .where(and(eq(watchlist.userId, userId), eq(watchlist.movieId, movieId)));
};
