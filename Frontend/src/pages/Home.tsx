import { Button } from "../components/ui/button";
import { Play, Info, Star, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../lib/api";

export const Home = () => {
    const [movies, setMovies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await api.get("/movies");
                setMovies(response.data.data);
            } catch (error) {
                console.error("Failed to fetch movies:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, []);

    const featuredMovie = movies[0] || {
        title: "Interstellar",
        synopsis: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        averageRating: 4.8,
        posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2094&auto=format&fit=crop"
    };

    // Trending movies could be used for a separate section if needed

    return (
        <div className="flex flex-col gap-12 pb-20">
            {/* Hero Section */}
            <section className="relative h-[80vh] w-full overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={featuredMovie.posterUrl?.startsWith("http") ? featuredMovie.posterUrl : `http://localhost:3000${featuredMovie.posterUrl}`}
                        className="w-full h-full object-cover brightness-50"
                        alt="Hero"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />
                </div>

                <div className="relative container mx-auto px-4 h-full flex flex-col justify-center gap-6 max-w-2xl">
                    <div className="flex items-center gap-2 text-primary font-semibold tracking-wider text-sm uppercase">
                        <Star className="w-4 h-4 fill-primary" />
                        <span>Highly Recommended</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white">
                        {featuredMovie.title}
                    </h1>
                    <p className="text-lg text-gray-300 leading-relaxed">
                        {featuredMovie.synopsis}
                    </p>
                    <div className="flex items-center gap-4 pt-4">
                        {movies[0] ? (
                            <>
                                <Link to={`/movies/${movies[0].id}`}>
                                    <Button size="lg" className="gap-2 h-12 px-8 font-semibold rounded-full shadow-lg shadow-primary/25">
                                        <Play className="w-5 h-5 fill-current" />
                                        Rate & Review
                                    </Button>
                                </Link>
                                <Link to={`/movies/${movies[0].id}`}>
                                    <Button size="lg" variant="secondary" className="gap-2 h-12 px-8 font-semibold rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border-0">
                                        <Info className="w-5 h-5" />
                                        More Details
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <Button size="lg" disabled className="gap-2 h-12 px-8 font-semibold rounded-full opacity-50">
                                <Play className="w-5 h-5 fill-current" />
                                Rate & Review
                            </Button>
                        )}
                    </div>
                </div>
            </section>

            {/* Trending Section */}
            <section className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="text-primary w-6 h-6" />
                        <h2 className="text-2xl font-bold tracking-tight">Trending Now</h2>
                    </div>
                    <Link to="/movies" className="text-sm font-medium text-primary hover:underline underline-offset-4">
                        View all movies
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex flex-col gap-3 animate-pulse">
                                <div className="relative aspect-2/3 overflow-hidden rounded-2xl bg-secondary/50" />
                                <div className="flex flex-col gap-2">
                                    <div className="h-4 bg-secondary/50 rounded-lg w-3/4" />
                                    <div className="h-3 bg-secondary/50 rounded-lg w-1/2" />
                                </div>
                            </div>
                        ))
                    ) : (
                        movies.map((movie) => (
                            <Link to={`/movies/${movie.id}`} key={movie.id} className="group cursor-pointer flex flex-col gap-3">
                                <div className="relative aspect-2/3 overflow-hidden rounded-2xl bg-secondary shadow-lg transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-primary/10">
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
                    )}
                </div>
            </section>
        </div>
    );
};
