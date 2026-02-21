import { useState } from "react";
import { Button } from "../components/ui/button";
import { Film, Loader2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import api from "../lib/api";
import { useAppDispatch } from "../hooks/use-redux";
import { setUser } from "../redux/slices/authSlice";

export const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const response = await api.post("/auth/signup", { name, email, password });
            dispatch(setUser(response.data.user));
            navigate("/");
        } catch (err: any) {
            setError(err.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-secondary/30 p-10 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-sm">
                <div className="flex flex-col items-center gap-6 mb-10">
                    <div className="bg-primary/20 p-4 rounded-2xl border border-primary/20">
                        <Film className="w-10 h-10 text-primary" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-3xl font-black tracking-tight">Create Account</h1>
                        <p className="text-muted-foreground text-sm mt-2">Join the community of movie lovers</p>
                    </div>
                </div>

                {error && <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-xl border border-destructive/20 mb-6">{error}</div>}

                <form onSubmit={handleSignup} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Full Name</label>
                        <input
                            type="text"
                            className="bg-background border h-12 rounded-xl px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Email Address</label>
                        <input
                            type="email"
                            className="bg-background border h-12 rounded-xl px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Password</label>
                        <input
                            type="password"
                            className="bg-background border h-12 rounded-xl px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="h-12 rounded-xl font-bold mt-2 shadow-lg shadow-primary/20"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Joining...
                            </div>
                        ) : (
                            "Sign Up"
                        )}
                    </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground mt-8">
                    Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
};
