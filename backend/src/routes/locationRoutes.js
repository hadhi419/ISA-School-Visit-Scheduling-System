import express from "express";
import { fetchLocations } from "../controllers/locationController.js";

const router = express.Router();

// GET /api/locations
router.get("/", fetchLocations);

export default router;
