import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { User, Film, Star, Clock, Trash2, Heart, Award, ChevronRight, Loader2 } from "lucide-react";
import api from "../lib/api";
import { useAppSelector } from "../hooks/use-redux";

export const Profile = () => {
    const { id } = useParams();
    const { user: currentUser } = useAppSelector((state: any) => state.auth);
    const [profileData, setProfileData] = useState<any>(null);
    const [watchlist, setWatchlist] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"watchlist" | "reviews">("watchlist");

    const fetchProfile = async () => {
        try {
            const [profileRes, watchlistRes] = await Promise.all([
                api.get(`/users/${id}`),
                api.get(`/users/${id}/watchlist`)
            ]);
            setProfileData(profileRes.data.data);
            setWatchlist(watchlistRes.data.data);
        } catch (error) {
            console.error("Failed to fetch profile info:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [id]);

    const handleRemoveFromWatchlist = async (movieId: number) => {
        try {
            await api.delete(`/users/watchlist/${movieId}`);
            setWatchlist(prev => prev.filter(item => item.movie.id !== movieId));
        } catch (error) {
            console.error("Failed to remove from watchlist:", error);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">Gathering your cinematic history...</p>
        </div>
    );

    if (!profileData) return <div className="p-20 text-center font-bold">Profile not found.</div>;

    const { user, reviews } = profileData;
    const isOwner = currentUser?.id === user.id;

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="flex flex-col gap-12">
                {/* Profile Header */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-linear-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-[3rem] blur-xl opacity-50 transition duration-1000 group-hover:duration-200" />
                    <div className="relative bg-secondary/30 border border-white/5 p-8 md:p-12 rounded-[2.5rem] backdrop-blur-md flex flex-col md:flex-row items-center gap-8 md:gap-12 overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-12 opacity-5">
                            <User className="w-64 h-64 text-white" />
                        </div>

                        <div className="relative shrink-0 flex items-center justify-center">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-linear-to-br from-primary via-purple-600 to-pink-600 p-1 shadow-2xl">
                                <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden border-4 border-background">
                                    {user.profilePicture ? (
                                        <img src={user.profilePicture} className="w-full h-full object-cover" alt={user.name} />
                                    ) : (
                                        <span className="text-5xl md:text-6xl font-black text-primary/80">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 text-center md:text-left relative z-10 w-full">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">{user.name}</h1>
                                <p className="text-muted-foreground font-medium flex items-center justify-center md:justify-start gap-2">
                                    {user.email} {isOwner && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">ME</span>}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mt-2 text-sm">
                                <div className="flex flex-col gap-1">
                                    <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest">Reviews</span>
                                    <div className="flex items-center gap-2 font-black text-xl">
                                        <Award className="w-4 h-4 text-primary" /> {reviews.length}
                                    </div>
                                </div>
                                <div className="w-px h-10 bg-white/10 hidden sm:block" />
                                <div className="flex flex-col gap-1">
                                    <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest">Watchlist</span>
                                    <div className="flex items-center gap-2 font-black text-xl">
                                        <Heart className="w-4 h-4 text-pink-500" /> {watchlist.length}
                                    </div>
                                </div>
                                <div className="w-px h-10 bg-white/10 hidden sm:block" />
                                <div className="flex items-center gap-2 text-muted-foreground pt-4 md:pt-0 italic">
                                    <Clock className="w-4 h-4" />
                                    Joined {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                                </div>
                            </div>

                            {isOwner && (
                                <div className="flex gap-3 mt-4 justify-center md:justify-start">
                                    <Button size="sm" variant="outline" className="rounded-full px-6 border-white/10 hover:bg-white/5 transition-all">Edit Profile</Button>
                                    <Button size="sm" variant="outline" className="rounded-full px-6 border-white/10 hover:bg-white/5 transition-all">Settings</Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabs & Content */}
                <div className="flex flex-col gap-8">
                    <div className="flex items-center justify-center gap-2 bg-secondary/20 p-1.5 rounded-2xl w-fit mx-auto border border-white/5 shadow-xl">
                        <button
                            onClick={() => setActiveTab("watchlist")}
                            className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "watchlist" ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-white/5 text-muted-foreground hover:text-white'}`}
                        >
                            <Heart className={`w-4 h-4 ${activeTab === "watchlist" ? 'fill-current' : ''}`} />
                            My Watchlist
                        </button>
                        <button
                            onClick={() => setActiveTab("reviews")}
                            className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "reviews" ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-white/5 text-muted-foreground hover:text-white'}`}
                        >
                            <Award className="w-4 h-4" />
                            My Reviews
                        </button>
                    </div>

                    <div className="min-h-[400px]">
                        {activeTab === "watchlist" ? (
                            watchlist.length > 0 ? (
                                <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                                    {watchlist.map((item) => (
                                        <div key={item.id} className="group relative flex flex-col gap-3">
                                            <Link to={`/movies/${item.movie.id}`} className="block relative aspect-2/3 overflow-hidden rounded-2xl bg-secondary shadow-lg transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-primary/10">
                                                <img
                                                    src={item.movie.posterUrl?.startsWith("http") ? item.movie.posterUrl : `http://localhost:3000${item.movie.posterUrl}`}
                                                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                                                    alt={item.movie.title}
                                                />
                                                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-bold text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Star className="w-2.5 h-2.5 fill-yellow-500 text-yellow-500" />
                                                    {item.movie.averageRating}
                                                </div>
                                            </Link>
                                            <div className="flex flex-col gap-1 pr-8">
                                                <h3 className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">{item.movie.title}</h3>
                                                <p className="text-[10px] text-muted-foreground uppercase font-black">{item.movie.genre}</p>
                                            </div>
                                            {isOwner && (
                                                <button
                                                    onClick={() => handleRemoveFromWatchlist(item.movie.id)}
                                                    className="absolute bottom-1 right-0 p-2 text-muted-foreground hover:text-destructive transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-6 py-20 opacity-40">
                                    <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center">
                                        <Heart className="w-10 h-10" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xl font-bold">Your Watchlist is Empty</p>
                                        <p className="text-sm mt-1">Start exploring and save movies you want to see!</p>
                                        <Link to="/movies" className="inline-block mt-4 text-primary font-bold hover:underline">Browse Movies</Link>
                                    </div>
                                </div>
                            )
                        ) : (
                            <div className="flex flex-col gap-6 max-w-4xl mx-auto">
                                {reviews.length > 0 ? (
                                    reviews.map((review: any) => (
                                        <div key={review.id} className="relative group">
                                            <div className="absolute -inset-1 bg-linear-to-r from-primary/10 to-transparent rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                                            <div className="relative bg-secondary/20 p-8 rounded-3xl border border-white/5 flex flex-col md:flex-row gap-8 backdrop-blur-sm transition-all group-hover:bg-secondary/30">
                                                <div className="w-24 aspect-2/3 rounded-xl overflow-hidden shrink-0 shadow-xl border border-white/5 hidden md:block">
                                                    {/* We'd need movie data here in an ideal join, but we have text summaries for now */}
                                                    <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary">
                                                        <Film className="w-8 h-8 opacity-50" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-4 w-full">
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                        <div className="flex flex-col gap-1">
                                                            <h4 className="text-xl font-black text-white group-hover:text-primary transition-colors line-clamp-1">{review.movieTitle}</h4>
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex items-center gap-0.5 text-yellow-500">
                                                                    {Array.from({ length: 5 }).map((_, idx) => (
                                                                        <Star key={idx} className={`w-3 h-3 ${idx < review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-white/10'}`} />
                                                                    ))}
                                                                </div>
                                                                <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                        <Link to={`/movies/${review.movieId}`} className="inline-flex items-center gap-2 group/link text-primary font-bold text-sm bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10 hover:bg-primary/10 transition-all">
                                                            View Movie <ChevronRight className="w-4 h-4" />
                                                        </Link>
                                                    </div>
                                                    <p className="text-lg leading-relaxed text-gray-200 italic">"{review.reviewText}"</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center gap-6 py-20 opacity-40">
                                        <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center">
                                            <Award className="w-10 h-10" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xl font-bold">No Reviews Yet</p>
                                            <p className="text-sm mt-1">Found a masterpiece? Share your thoughts with the community!</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
