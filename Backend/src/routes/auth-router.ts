import { Router } from "express";
import { handleUserSignup, handleUserLogin, handleUserLogout } from "../controllers/auth-controller.ts";
import { loginValidation, signupValidation } from "../middlewares/auth.ts";

const router = Router();

// Auth Routes
router.post("/signup", signupValidation, handleUserSignup);
router.post("/login", loginValidation, handleUserLogin);
router.post("/logout", handleUserLogout);

export default router;
