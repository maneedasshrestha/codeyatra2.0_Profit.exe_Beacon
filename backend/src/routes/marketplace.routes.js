import { Router } from "express";
import { createListing, getAllListings, getListingById, deleteListing, upload } from "../controllers/marketplace.controllers.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", requireAuth, upload.single("image"), createListing);
router.get("/", getAllListings);
router.get("/:id", getListingById);
router.delete("/:id", requireAuth, deleteListing);

export default router;
