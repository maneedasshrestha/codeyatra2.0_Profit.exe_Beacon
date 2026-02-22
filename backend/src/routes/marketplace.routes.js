import { Router } from "express";
import { createListing, getAllListings, getListingById, upload } from "../controllers/marketplace.controllers.js";

const router = Router();

router.post("/", upload.single("image"), createListing);
router.get("/", getAllListings);
router.get("/:id", getListingById);

export default router;
