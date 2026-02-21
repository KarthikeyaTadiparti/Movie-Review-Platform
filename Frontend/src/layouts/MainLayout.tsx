import { Outlet } from "react-router-dom";
import { Navbar } from "../components/shared/Navbar";

export const MainLayout = () => {
    return (
        <div className="dark min-h-screen bg-background text-foreground font-sans antialiased">
            <Navbar />
            <main className="pt-16">
                <Outlet />
            </main>
            <footer className="border-t py-12 bg-secondary/30">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-muted-foreground text-sm">
                        &copy; {new Date().getFullYear()} MovieCritic. Built for movie lovers.
                    </p>
                </div>
            </footer>
        </div>
    );
};
