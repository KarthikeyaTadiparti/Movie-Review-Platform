import { Button } from "../components/ui/button";
import { Star, Clock, Calendar, Play, Plus, ChevronRight, Loader2, Heart, X } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../lib/api";
import { useAppSelector } from "../hooks/use-redux";

export const MovieDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAppSelector((state: any) => state.auth);

    const [movie, setMovie] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [watchlistLoading, setWatchlistLoading] = useState(false);
    const [showTrailer, setShowTrailer] = useState(false);

    const getYoutubeEmbedUrl = (url: string) => {
        if (!url) return "";
        let videoId = "";
        if (url.includes("v=")) {
            videoId = url.split("v=")[1].split("&")[0];
        } else if (url.includes("youtu.be/")) {
            videoId = url.split("youtu.be/")[1].split("?")[0];
        } else if (url.includes("embed/")) {
            videoId = url.split("embed/")[1].split("?")[0];
        }
        return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
    };

    const fetchMovie = async () => {
        try {
            const response = await api.get(`/movies/${id}`);
            setMovie(response.data.data);

            if (user) {
                const watchlistRes = await api.get(`/users/${user.id}/watchlist`);
                const inList = watchlistRes.data.data.some((item: any) => item.movie.id === Number(id));
                setIsInWatchlist(inList);
            }
        } catch (error) {
            console.error("Failed to fetch movie:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovie();
    }, [id]);

    const handlePostReview = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (rating === 0) {
            setError("Please select a rating");
            return;
        }

        if (reviewText.trim().length < 5) {
            setError("Review text must be at least 5 characters long");
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            await api.post(`/movies/${id}/reviews`, {
                rating,
                reviewText
            });
            setRating(0);
            setReviewText("");
            fetchMovie(); // Refresh movie data to show new review
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to post review");
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleWatchlist = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        setWatchlistLoading(true);
        try {
            if (isInWatchlist) {
                await api.delete(`/users/watchlist/${id}`);
                setIsInWatchlist(false);
            } else {
                await api.post(`/users/watchlist/${id}`);
                setIsInWatchlist(true);
            }
        } catch (error) {
            console.error("Failed to update watchlist:", error);
        } finally {
            setWatchlistLoading(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">Loading cinematic masterpiece...</p>
        </div>
    );

    if (!movie) return <div className="p-20 text-center">Movie not found.</div>;

    return (
        <>
            <div className="flex flex-col gap-12 pb-20">
                {/* Header / Backdrop section */}
                <div className="relative h-[60vh] w-full">
                    <div className="absolute inset-0">
                        <img src={movie.posterUrl?.startsWith("http") ? movie.posterUrl : `http://localhost:3000${movie.posterUrl}`} className="w-full h-full object-cover brightness-50" />
                        <div className="absolute inset-0 bg-linear-to-t from-background to-transparent" />
                    </div>

                    <div className="relative container mx-auto px-4 h-full flex flex-col justify-end pb-12">
                        <div className="flex flex-col md:flex-row gap-8 items-end">
                            <div className="hidden md:block w-64 aspect-2/3 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 shrink-0">
                                <img src={movie.posterUrl?.startsWith("http") ? movie.posterUrl : `http://localhost:3000${movie.posterUrl}`} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col gap-4 mb-2">
                                <div className="flex items-center gap-3">
                                    <span className="bg-primary/20 text-primary text-[10px] font-bold px-3 py-1 rounded-full border border-primary/20 uppercase tracking-widest">
                                        Feature Film
                                    </span>
                                    <div className="flex items-center gap-1 text-yellow-500">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="text-sm font-bold">{movie.averageRating}</span>
                                    </div>
                                </div>
                                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
                                    {movie.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300 font-medium">
                                    <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {movie.releaseYear}</span>
                                    <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> 2h 49m</span>
                                    <span className="text-primary">{movie.genre}</span>
                                    <span>Dir: {movie.director}</span>
                                </div>
                                <div className="flex items-center gap-4 mt-4">
                                    <Button
                                        onClick={() => movie.trailerUrl && setShowTrailer(true)}
                                        disabled={!movie.trailerUrl}
                                        className="rounded-full gap-2 px-8 h-12 shadow-lg shadow-primary/25 disabled:opacity-50"
                                    >
                                        <Play className="w-4 h-4 fill-current" />
                                        Watch Trailer
                                    </Button>
                                    <Button
                                        onClick={handleToggleWatchlist}
                                        disabled={watchlistLoading}
                                        variant="secondary"
                                        className={`rounded-full gap-2 px-8 h-12 border-0 transition-all ${isInWatchlist ? 'bg-pink-600 text-white hover:bg-pink-700' : 'bg-white/10 text-white hover:bg-white/20'}`}
                                    >
                                        {watchlistLoading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : isInWatchlist ? (
                                            <Heart className="w-4 h-4 fill-current" />
                                        ) : (
                                            <Plus className="w-4 h-4" />
                                        )}
                                        {isInWatchlist ? 'In Watchlist' : 'Watchlist'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 flex flex-col gap-10">
                        <section>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                Synopsis <ChevronRight className="w-4 h-4 text-primary" />
                            </h2>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                {movie.synopsis}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                Top Cast <ChevronRight className="w-4 h-4 text-primary" />
                            </h2>
                            <div className="flex flex-wrap gap-2 text-sm">
                                {movie.cast?.split(',').map((actor: string, i: number) => (
                                    <span key={i} className="bg-secondary px-4 py-2 rounded-xl font-medium">
                                        {actor.trim()}
                                    </span>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                Reviews <ChevronRight className="w-4 h-4 text-primary" />
                            </h2>
                            <div className="flex flex-col gap-6">
                                {movie.reviews?.length > 0 ? (
                                    movie.reviews.map((review: any) => (
                                        <div key={review.id} className="bg-secondary/20 p-6 rounded-2xl border border-white/5 group hover:border-primary/20 transition-all">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-secondary shrink-0">
                                                        {review.userProfilePicture ? (
                                                            <img src={review.userProfilePicture} className="w-full h-full object-cover" alt={review.userName} />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-[10px] font-bold">
                                                                {review.userName?.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-white tracking-tight">{review.userName}</span>
                                                        <div className="flex items-center gap-1 text-yellow-500">
                                                            {Array.from({ length: 5 }).map((_, idx) => (
                                                                <Star key={idx} className={`w-2.5 h-2.5 ${idx < review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-white/20'}`} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm text-gray-200 leading-relaxed italic">"{review.reviewText}"</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-secondary/10 p-10 rounded-3xl border border-dashed flex flex-col items-center justify-center gap-3">
                                        <p className="text-muted-foreground italic text-center">No reviews yet for this movie. Be the first to share your experience!</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    <div className="flex flex-col gap-8">
                        <div className="bg-secondary/40 p-8 rounded-3xl border border-white/5 flex flex-col gap-6 shadow-2xl backdrop-blur-md sticky top-24">
                            <h3 className="font-bold text-lg">Add Your Review</h3>
                            <p className="text-sm text-muted-foreground">Share your thoughts with the community.</p>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star
                                            key={s}
                                            onClick={() => setRating(s)}
                                            className={`w-8 h-8 cursor-pointer transition-all hover:scale-110 ${s <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-white/10 hover:text-yellow-500/50'}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Review</label>
                                <textarea
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    className="w-full bg-background/50 border h-32 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                    placeholder="What did you think of the movie? (min 5 characters)"
                                />
                            </div>

                            {error && <p className="text-xs text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">{error}</p>}

                            <Button
                                onClick={handlePostReview}
                                disabled={submitting}
                                className={`w-full h-12 rounded-xl font-bold transition-all shadow-lg ${submitting ? 'opacity-70' : 'shadow-primary/20'}`}
                            >
                                {submitting ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Posting...
                                    </div>
                                ) : (
                                    'Post Review'
                                )}
                            </Button>
                            {!user && <p className="text-[10px] text-center text-muted-foreground">Note: You will be redirected to login.</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Trailer Modal */}
            {showTrailer && movie.trailerUrl && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-300 p-4 md:p-10">
                    <div className="absolute top-6 right-6 md:top-10 md:right-10 flex gap-4 z-[110]">
                        <a
                            href={movie.trailerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all flex items-center gap-2 px-6 text-sm font-bold backdrop-blur-md border border-white/10"
                        >
                            <Play className="w-4 h-4 fill-current" />
                            Watch on YouTube
                        </a>
                        <button
                            onClick={() => setShowTrailer(false)}
                            className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all backdrop-blur-md border border-white/10"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                        <iframe
                            src={getYoutubeEmbedUrl(movie.trailerUrl)}
                            title="Movie Trailer"
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-m
ia; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}
        </>
    );
};
