import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/use-redux";
import { Button } from "../components/ui/button";
import { Loader2, Clapperboard, CheckCircle2, AlertCircle, Upload, X, Image as ImageIcon } from "lucide-react";
import api from "../lib/api";

export const Admin = () => {
    const { user } = useAppSelector((state: any) => state.auth);
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        genre: "",
        releaseYear: new Date().getFullYear(),
        director: "",
        cast: "",
        synopsis: "",
        trailerUrl: ""
    });

    const [posterFile, setPosterFile] = useState<File | null>(null);

    useEffect(() => {
        if (!user || user.role !== "admin") {
            navigate("/");
        }
    }, [user, navigate]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPosterFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearFile = () => {
        setPosterFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!posterFile) {
            setErrorMsg("Please upload a movie poster.");
            return;
        }

        setLoading(true);
        setSuccessMsg("");
        setErrorMsg("");

        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("genre", formData.genre);
            data.append("releaseYear", formData.releaseYear.toString());
            data.append("director", formData.director);
            data.append("cast", formData.cast);
            data.append("synopsis", formData.synopsis);
            data.append("trailerUrl", formData.trailerUrl);
            data.append("poster", posterFile); // 'poster' matches field name in upload.single("poster")

            await api.post("/movies", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setSuccessMsg(`"${formData.title}" has been released to the library!`);
            setFormData({
                title: "",
                genre: "",
                releaseYear: new Date().getFullYear(),
                director: "",
                cast: "",
                synopsis: "",
                trailerUrl: ""
            });
            setPosterFile(null);
            setPreviewUrl(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error: any) {
            setErrorMsg(error.response?.data?.message || "Failed to add movie. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "releaseYear" ? parseInt(value) : value
        }));
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-2 text-center md:text-left">
                    <h1 className="text-4xl font-black tracking-tight flex items-center justify-center md:justify-start gap-4">
                        <Clapperboard className="w-10 h-10 text-primary" />
                        Movie Master Admin
                    </h1>
                    <p className="text-muted-foreground italic">Add your hand-picked selection to our cinematic universe.</p>
                </div>

                {successMsg && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-6 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
                        <CheckCircle2 className="w-6 h-6 shrink-0" />
                        <span className="font-bold">{successMsg}</span>
                    </div>
                )}

                {errorMsg && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive p-6 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
                        <AlertCircle className="w-6 h-6 shrink-0" />
                        <span className="font-bold">{errorMsg}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Image Upload Area */}
                        <div className="lg:col-span-1 flex flex-col gap-4">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Movie Poster</label>
                            <div
                                className={`relative aspect-2/3 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-4 group overflow-hidden ${previewUrl ? 'border-primary/50 bg-primary/5' : 'border-white/10 bg-secondary/20 hover:border-primary/30 hover:bg-secondary/30 cursor-pointer'}`}
                                onClick={() => !posterFile && fileInputRef.current?.click()}
                            >
                                {previewUrl ? (
                                    <>
                                        <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="rounded-full"
                                                onClick={(e) => { e.stopPropagation(); clearFile(); }}
                                            >
                                                <X className="w-5 h-5" />
                                            </Button>
                                            <span className="text-xs font-bold text-white uppercase tracking-tighter">Remove Image</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                            <Upload className="w-8 h-8" />
                                        </div>
                                        <div className="text-center px-4">
                                            <p className="font-bold text-sm">Tap to Upload</p>
                                            <p className="text-[10px] text-muted-foreground mt-1">PNG, JPG, HEIC up to 5MB</p>
                                        </div>
                                    </>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>

                        {/* Details Area */}
                        <div className="lg:col-span-2 bg-secondary/20 border border-white/5 p-8 md:p-10 rounded-[2.5rem] flex flex-col gap-6 backdrop-blur-md shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <ImageIcon className="w-32 h-32" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Title</label>
                                    <input
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        className="bg-background/50 border h-12 rounded-2xl px-5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="Epic Movie Title"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Genre</label>
                                    <input
                                        name="genre"
                                        value={formData.genre}
                                        onChange={handleChange}
                                        required
                                        className="bg-background/50 border h-12 rounded-2xl px-5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="Action, Thriller..."
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Year</label>
                                    <input
                                        type="number"
                                        name="releaseYear"
                                        value={formData.releaseYear}
                                        onChange={handleChange}
                                        required
                                        className="bg-background/50 border h-12 rounded-2xl px-5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Director</label>
                                    <input
                                        name="director"
                                        value={formData.director}
                                        onChange={handleChange}
                                        required
                                        className="bg-background/50 border h-12 rounded-2xl px-5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="Director Name"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 relative z-10">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Top Cast</label>
                                <input
                                    name="cast"
                                    value={formData.cast}
                                    onChange={handleChange}
                                    required
                                    className="bg-background/50 border h-12 rounded-2xl px-5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="Lead Actors (comma separated)"
                                />
                            </div>

                            <div className="flex flex-col gap-2 relative z-10">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Synopsis</label>
                                <textarea
                                    name="synopsis"
                                    value={formData.synopsis}
                                    onChange={handleChange}
                                    required
                                    className="bg-background/50 border h-32 rounded-3xl p-5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                    placeholder="Enter movie description..."
                                />
                            </div>

                            <div className="flex flex-col gap-2 relative z-10">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Trailer URL (Optional)</label>
                                <input
                                    name="trailerUrl"
                                    value={formData.trailerUrl}
                                    onChange={handleChange}
                                    className="bg-background/50 border h-12 rounded-2xl px-5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="YouTube Link"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="h-16 rounded-3xl font-black text-lg mt-4 shadow-2xl shadow-primary/20 hover:brightness-125 transition-all"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-3">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Finalizing Release...
                                    </div>
                                ) : (
                                    "Release to Theater"
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
