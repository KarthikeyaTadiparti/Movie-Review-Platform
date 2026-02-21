import db from "../config/db.ts";
import { movies, NewMovie } from "../schema/movies-schema.ts";
import { and, eq, ilike, or, SQL } from "drizzle-orm";

export const getAllMovies = async (filter?: { genre?: string; search?: string }) => {
    let conditions: SQL[] = [];

    if (filter?.genre && filter.genre !== "All") {
        conditions.push(eq(movies.genre, filter.genre));
    }

    if (filter?.search) {
        conditions.push(
            or(
                ilike(movies.title, `%${filter.search}%`),
                ilike(movies.director, `%${filter.search}%`),
                ilike(movies.cast, `%${filter.search}%`)
            ) as SQL
        );
    }

    let query = db.select().from(movies);

    if (conditions.length > 0) {
        return await query.where(and(...conditions));
    }

    return await query;
};

export const getMovieById = async (id: number) => {
    const result = await db.select().from(movies).where(eq(movies.id, id));
    return result[0];
};

export const createMovie = async (movieData: NewMovie) => {
    const result = await db.insert(movies).values(movieData).returning();
    return result[0];
};

export const updateMovieRating = async (movieId: number, avgRating: string) => {
    await db.update(movies).set({ averageRating: avgRating }).where(eq(movies.id, movieId));
};
