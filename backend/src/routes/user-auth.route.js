import express from "express";
import {
  signup,
  login,
  confirmEmail,
  authCodeError,
  logout,
  getMe,
  completeProfile, // ← ADD THIS
  updateProfile,
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

// ✨ 6. COMPLETE PROFILE (NEW)
router.post("/complete-profile", completeProfile);

// ✨ 7. UPDATE PROFILE (NEW)
router.put("/update-profile", updateProfile);

export default router;
