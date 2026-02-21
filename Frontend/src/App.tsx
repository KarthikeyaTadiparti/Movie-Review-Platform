import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { Home } from "./pages/Home";
import { MovieDetail } from "./pages/MovieDetail";
import { MoviesList } from "./pages/MoviesList";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Admin } from "./pages/Admin";
import { Profile } from "./pages/Profile";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="movies" element={<MoviesList />} />
                    <Route path="movies/:id" element={<MovieDetail />} />
                    <Route path="profile/:id" element={<Profile />} />
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<Signup />} />
                    <Route path="admin" element={<Admin />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
