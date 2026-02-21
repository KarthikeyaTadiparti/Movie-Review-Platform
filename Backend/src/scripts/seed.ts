import "dotenv/config";
import db from "../config/db.ts";
import { movies } from "../schema/movies-schema.ts";

const jsonMovieData = [
    {
        title: "Interstellar",
        genre: "Sci-Fi",
        releaseYear: 2014,
        director: "Christopher Nolan",
        cast: "Matthew McConaughey, Anne Hathaway, Jessica Chastain",
        synopsis: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        posterUrl: "/uploads/posters/interstellar.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
        averageRating: "5.0",
    },
    {
        title: "Oppenheimer",
        genre: "Drama",
        releaseYear: 2023,
        director: "Christopher Nolan",
        cast: "Cillian Murphy, Emily Blunt, Matt Damon",
        synopsis: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
        posterUrl: "/uploads/posters/Oppenheimer.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=uYPbbksJxIg",
        averageRating: "1.0",
    },
    {
        title: "Inception",
        genre: "Sci-Fi",
        releaseYear: 2010,
        director: "Christopher Nolan",
        cast: "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page",
        synopsis: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        posterUrl: "/uploads/posters/inception.jpg\n",
        trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0",
        averageRating: "4.8",
    },
    {
        title: "Pulp Fiction",
        genre: "Thriller",
        releaseYear: 1994,
        director: "Quentin Tarantino",
        cast: "John Travolta, Uma Thurman, Samuel L. Jackson",
        synopsis: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
        posterUrl: "/uploads/posters/Pulp Fiction.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=s7EdQ4FqbhY",
        averageRating: "4.6",
    },
    {
        title: "3 idiots",
        genre: "Comdey",
        releaseYear: 2026,
        director: "Rajkumar Hirani",
        cast: "Aamir Khan",
        synopsis: "In college, Farhan and Raju form a great bond with Rancho due to his refreshing outlook. Years later, a bet gives them a chance to look for their long-lost friend whose existence seems rather elusive.",
        posterUrl: "/uploads/posters/poster-1771668232986-107588881.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=K0eDlFX9GMc",
        averageRating: "5.0",
    },
    {
        title: "Sinners",
        genre: "Horror",
        releaseYear: 2025,
        director: "Ryan Coogler",
        cast: " Michael B. Jordan",
        synopsis: "Trying to leave their troubled lives behind, twin brothers return to their hometown to start again, only to discover that an even greater evil is waiting to welcome them back.",
        posterUrl: "/uploads/posters/poster-1771671088790-228940041.jpg",
        trailerUrl: "",
        averageRating: "5.0",
    }
];

const movieData = jsonMovieData.map(m => ({
    title: m.title.trim(),
    genre: m.genre,
    releaseYear: m.releaseYear,
    director: m.director,
    cast: m.cast,
    synopsis: m.synopsis,
    posterUrl: m.posterUrl.trim(),
    trailerUrl: m.trailerUrl,
    averageRating: m.averageRating,
}));

async function seed() {
    console.log("Seeding movies...");
    for (const movie of movieData) {
        await db.insert(movies).values(movie).onConflictDoUpdate({
            target: movies.title,
            set: {
                genre: movie.genre,
                releaseYear: movie.releaseYear,
                director: movie.director,
                cast: movie.cast,
                synopsis: movie.synopsis,
                posterUrl: movie.posterUrl,
                trailerUrl: movie.trailerUrl,
                averageRating: movie.averageRating,
                updatedAt: new Date(),
            }
        });
    }
    console.log("Seeding completed!");
    process.exit(0);
}

seed().catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
});
