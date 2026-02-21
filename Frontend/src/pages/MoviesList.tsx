import { Button } from "../components/ui/button";
import { Star, Search, SlidersHorizontal, Film, Plus } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import api from "../lib/api";
import { useAppSelector } from "../hooks/use-redux";

export const MoviesList = () => {
    const { user } = useAppSelector((state: any) => state.auth);
    const [searchParams, setSearchParams] = useSearchParams();

    const [movies, setMovies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
    const [selectedGenre, setSelectedGenre] = useState(searchParams.get("genre") || "All");

    const genres = ["All", "Action", "Drama", "Sci-Fi", "Comedy", "Thriller", "Horror"];

    const fetchMovies = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedGenre !== "All") params.append("genre", selectedGenre);
            if (searchQuery) params.append("search", searchQuery);

            const response = await api.get(`/movies?${params.toString()}`);
            setMovies(response.data.data);
        } catch (error) {
            console.error("Failed to fetch movies:", error);
        } finally {
            setLoading(false);
        }
    }, [selectedGenre, searchQuery]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchMovies();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [fetchMovies]);

    const handleGenreChange = (genre: string) => {
        setSelectedGenre(genre);
        const newParams = new URLSearchParams(searchParams);
        if (genre === "All") {
            newParams.delete("genre");
        } else {
            newParams.set("genre", genre);
        }
        setSearchParams(newParams);
    };

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        const newParams = new URLSearchParams(searchParams);
        if (!query) {
            newParams.delete("search");
        } else {
            newParams.set("search", query);
        }
        setSearchParams(newParams);
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col gap-10">
                {/* Search & Filter Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight mb-2">Explore Library</h1>
                        <p className="text-muted-foreground">Browse thousands of movies and hidden gems.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <input
                                className="bg-secondary/50 border h-11 pl-10 pr-4 rounded-xl w-64 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="Search by title, director..."
                                value={searchQuery}
                                onChange={(e) => handleSearchChange(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl">
                            <SlidersHorizontal className="h-4 w-4" />
                        </Button>
                        {user?.role === "admin" && (
                            <Link to="/admin">
                                <Button className="h-11 rounded-xl gap-2 font-bold px-6">
                                    <Plus className="w-4 h-4" />
                                    Add Movie
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Genre Pills */}
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {genres.map(g => (
                        <button
                            key={g}
                            onClick={() => handleGenreChange(g)}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap border ${selectedGenre === g
                                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25"
                                : "bg-background hover:bg-secondary cursor-pointer"
                                }`}
                        >
                            {g}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 min-h-[400px]">
                    {loading ? (
                        Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="flex flex-col gap-3 animate-pulse">
                                <div className="relative aspect-2/3 overflow-hidden rounded-2xl bg-secondary/50" />
                                <div className="flex flex-col gap-2">
                                    <div className="h-4 bg-secondary/50 rounded-lg w-3/4" />
                                    <div className="h-3 bg-secondary/50 rounded-lg w-1/2" />
                                </div>
                            </div>
                        ))
                    ) : movies.length > 0 ? (
                        movies.map((movie) => (
                            <Link to={`/movies/${movie.id}`} key={movie.id} className="group flex flex-col gap-3">
                                <div className="relative aspect-2/3 overflow-hidden rounded-2xl bg-secondary shadow-md transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-primary/10">
                                    <img
                                        src={movie.posterUrl?.startsWith("http") ? movie.posterUrl : `http://localhost:3000${movie.posterUrl}`}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        alt={movie.title}
                                    />
                                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-bold text-white border border-white/10">
                                        <Star className="w-2.5 h-2.5 fill-yellow-500 text-yellow-500" />
                                        {movie.averageRating}
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">{movie.title}</h3>
                                    <p className="text-xs text-muted-foreground">{movie.genre}</p>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4 opacity-50">
                            <Film className="w-12 h-12" />
                            <p className="text-xl font-medium">No movies found in the library.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
