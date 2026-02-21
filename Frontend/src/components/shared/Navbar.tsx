import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { LogOut, Film, Plus, User } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../hooks/use-redux";
import { logout } from "../../redux/slices/authSlice";
import api from "../../lib/api";

export const Navbar = () => {
    const { user } = useAppSelector((state: any) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");
            dispatch(logout());
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            dispatch(logout());
            navigate("/login");
        }
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-10">
                    <Link to="/" className="flex items-center gap-2 group">
                        <Film className="w-8 h-8 text-primary group-hover:rotate-12 transition-transform" />
                        <span className="text-xl font-bold tracking-tighter">MOVIE<span className="text-primary">CRITIC</span></span>
                    </Link>
                </div>

                <div className="flex items-center gap-8">
                    {/* Navigation Links on the right */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/movies" className="text-sm font-medium hover:text-primary transition-colors">Browse</Link>
                        {user?.role === "admin" && (
                            <Link to="/admin" className="text-sm font-bold text-primary flex items-center gap-2 hover:brightness-125 transition-all">
                                <Plus className="w-4 h-4" />
                                Add Movie
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-3">
                                <Link to={`/profile/${user.id}`}>
                                    <Button variant="ghost" size="icon" className="rounded-full bg-secondary/50 hover:bg-primary/10">
                                        <User className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Button
                                    onClick={handleLogout}
                                    variant="ghost"
                                    size="sm"
                                    className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login">
                                    <Button variant="ghost" size="sm" className="font-bold">Sign In</Button>
                                </Link>
                                <Link to="/signup">
                                    <Button size="sm" className="font-bold shadow-lg shadow-primary/20 rounded-full px-6">Join</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
