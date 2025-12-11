import express from "express";
import { postMultipleVisits, fetchAllVisits, submitMonthlyVisits } from "../controllers/visitController.js";

const router = express.Router();

// POST /api/visits
router.post("/", postMultipleVisits);

// GET /api/visits/month/:month/:isa_id
router.get("/month/:month/:isa_id", fetchAllVisits);

// POST /api/visits/submit
router.post("/submit", submitMonthlyVisits);


export default router;
