import express from "express";
import {
  signup,
  login,
  confirmEmail,
  authCodeError,
  logout,
  getMe,
} from "../controllers/user-auth.controllers.js";

const router = express.Router();

// 1. SIGN UP
router.post("/signup", signup);

// 2. LOGIN
router.post("/login", login);

// 3. EMAIL VERIFICATION
router.get("/confirm", confirmEmail);

// Auth code error
router.get("/auth-code-error", authCodeError);

// 4. LOGOUT
router.post("/logout", logout);

// 5. GET CURRENT USER
router.get("/me", getMe);

export default router;
