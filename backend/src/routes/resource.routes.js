import express from "express";
import multer from "multer";
import {
  uploadResource,
  getAllResources,
  getResourceById,
  toggleUpvote,
  toggleDownvote,
  deleteResource,
} from "../controllers/resource.controllers.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

const ALLOWED_MIMETYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type. Allowed: PDF, PPT, DOC, PNG, JPG"));
    }
  },
});

// POST   /api/resources            – upload a resource
// GET    /api/resources            – list / filter / search resources
// GET    /api/resources/:id        – get single resource + increment download count
// POST   /api/resources/:id/upvote – toggle upvote
// DELETE /api/resources/:id        – delete (owner only)

router.post("/", requireAuth, upload.single("file"), uploadResource);
router.get("/", getAllResources);
router.get("/:id", getResourceById);
router.post("/:id/upvote", requireAuth, toggleUpvote);
router.post("/:id/downvote", requireAuth, toggleDownvote);
router.delete("/:id", requireAuth, deleteResource);

export default router;
