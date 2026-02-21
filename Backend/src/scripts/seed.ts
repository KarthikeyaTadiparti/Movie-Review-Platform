import db from "../config/db.ts";
import { movies } from "../schema/movies-schema.ts";

const movieData = [
    {
        title: "Interstellar",
        genre: "Sci-Fi",
        releaseYear: 2014,
        director: "Christopher Nolan",
        cast: "Matthew McConaughey, Anne Hathaway, Jessica Chastain",
        synopsis: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2094&auto=format&fit=crop",
        trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
        averageRating: "4.8"
    },
    {
        title: "Oppenheimer",
        genre: "Drama",
        releaseYear: 2023,
        director: "Christopher Nolan",
        cast: "Cillian Murphy, Emily Blunt, Matt Damon",
        synopsis: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
        posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&auto=format",
        trailerUrl: "https://www.youtube.com/watch?v=uYPbbksJxIg",
        averageRating: "4.9"
    },
    {
        title: "Dune: Part Two",
        genre: "Sci-Fi",
        releaseYear: 2024,
        director: "Denis Villeneuve",
        cast: "Timothée Chalamet, Zendaya, Rebecca Ferguson",
        synopsis: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
        posterUrl: "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=500&auto=format",
        trailerUrl: "https://www.youtube.com/watch?v=Way9Dexny3w",
        averageRating: "4.7"
    },
    {
        title: "Inception",
        genre: "Sci-Fi",
        releaseYear: 2010,
        director: "Christopher Nolan",
        cast: "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page",
        synopsis: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format",
        trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0",
        averageRating: "4.8"
    },
    {
        title: "The Dark Knight",
        genre: "Action",
        releaseYear: 2008,
        director: "Christopher Nolan",
        cast: "Christian Bale, Heath Ledger, Aaron Eckhart",
        synopsis: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        posterUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500&auto=format",
        trailerUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
        averageRating: "4.9"
    },
    {
        title: "Pulp Fiction",
        genre: "Thriller",
        releaseYear: 1994,
        director: "Quentin Tarantino",
        cast: "John Travolta, Uma Thurman, Samuel L. Jackson",
        synopsis: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
        posterUrl: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&auto=format",
        trailerUrl: "https://www.youtube.com/watch?v=s7EdQ4FqbhY",
        averageRating: "4.6"
    }
];

async function seed() {
    console.log("Seeding movies...");
    for (const movie of movieData) {
        await db.insert(movies).values(movie).onConflictDoNothing();
    }
    console.log("Seeding completed!");
    process.exit(0);
}

seed().catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
});
