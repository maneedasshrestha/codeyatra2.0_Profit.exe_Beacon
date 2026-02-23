import { Router } from "express";
import { createListing, getAllListings, getListingById } from "../controllers/marketplace.controllers.js";

const router = Router();

router.post("/", createListing);
router.get("/", getAllListings);
router.get("/:id", getListingById);

export default router;
