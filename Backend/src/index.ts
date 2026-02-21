import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import apiRoutes from "./routes/api-routes.ts";
import { errorHandler, handle404Error } from "./middlewares/errorhandler.ts";

const app = express();

app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

// API Routes
app.use("/api", apiRoutes);

// Test route
app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Movie Review API 🎬" });
});

// Error handling
app.use(handle404Error);
app.use(errorHandler as any);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
