import { Request, Response } from "express";
import bcrypt from "bcrypt";
import ExpressError from "../middlewares/errorhandler.ts";
import genJwt from "../utils/gen-jwt.ts";
import wrapAsync from "../utils/wrap-async.ts";
import { createUser, getUserByEmail } from "../services/users-services.ts";

export const handleUserSignup = wrapAsync(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        throw new ExpressError(409, "User already exists!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Assign 'admin' role only to a specific email, otherwise 'user'
    const role = email === "admin@gmail.com" ? "admin" : "user";

    const newUser = await createUser({
        name,
        email,
        password: hashedPassword,
        role: role,
    });

    if (!newUser?.id) {
        throw new ExpressError(500, "Failed to create user");
    }

    genJwt(res, newUser.id);

    return res.status(201).json({
        status: true,
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
        },
        message: "User registered successfully!",
    });
});

export const handleUserLogin = wrapAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await getUserByEmail(email);
    if (!user) throw new ExpressError(401, "User does not exist!");

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) throw new ExpressError(401, "Invalid email or password!");

    genJwt(res, user.id);

    return res.status(200).json({
        status: true,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            profilePicture: user.profilePicture,
        },
        message: "User logged in successfully!",
    });
});

export const handleUserLogout = wrapAsync(async (req: Request, res: Response) => {
    res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
    });
    return res.status(200).json({ status: true, message: "User logged out successfully!" });
});
