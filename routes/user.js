import express from "express";
import { getmyprofile, login, logout, regsiter } from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", regsiter);
router.post("/login", login);
router.get("/me", isAuthenticated, getmyprofile);
router.get("/logout", isAuthenticated, logout);

export default router;
