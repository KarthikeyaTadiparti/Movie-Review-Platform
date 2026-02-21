import { Request, Response } from "express";
import wrapAsync from "../utils/wrap-async.ts";
import * as movieService from "../services/movies-services.ts";
import * as reviewService from "../services/reviews-services.ts";
import ExpressError from "../middlewares/errorhandler.ts";

export const handleGetAllMovies = wrapAsync(async (req: Request, res: Response) => {
    const { genre, search } = req.query;
    const movies = await movieService.getAllMovies({
        genre: genre as string,
        search: search as string
    });
    return res.status(200).json({ status: true, data: movies });
});

export const handleGetMovieById = wrapAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const movie = await movieService.getMovieById(Number(id));
    if (!movie) throw new ExpressError(404, "Movie not found");

    const reviews = await reviewService.getReviewsByMovieId(Number(id));

    return res.status(200).json({
        status: true,
        data: { ...movie, reviews }
    });
});

export const handleCreateMovie = wrapAsync(async (req: Request, res: Response) => {
    // Check for admin role would usually be in middleware
    const movieData = { ...req.body };

    if (req.file) {
        // Construct the URL path for the uploaded file
        // Since we serve "public" as static, the browser path starts after "public"
        movieData.posterUrl = `/uploads/posters/${req.file.filename}`;
    }

    if (movieData.releaseYear) {
        movieData.releaseYear = Number(movieData.releaseYear);
    }

    const movie = await movieService.createMovie(movieData);
    return res.status(201).json({ status: true, data: movie });
});
