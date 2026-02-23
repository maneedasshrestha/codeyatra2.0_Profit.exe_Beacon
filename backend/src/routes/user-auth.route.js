import express from "express";
import multer from "multer";
import {
  signup,
  login,
  confirmEmail,
  authCodeError,
  logout,
  getMe,
  completeProfile,
  updateProfile,
  uploadAvatar,
  searchUsers,
} from "../controllers/user-auth.controllers.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

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

// 9. SEARCH USERS (for starting new private chats)
router.get("/users/search", requireAuth, searchUsers);

// ✨ 6. COMPLETE PROFILE (NEW)
router.post("/complete-profile", completeProfile);

// ✨ 7. UPDATE PROFILE (NEW)
router.put("/update-profile", updateProfile);

// ✨ 8. UPLOAD AVATAR
router.post("/upload-avatar", upload.single("avatar"), uploadAvatar);

export default router;
