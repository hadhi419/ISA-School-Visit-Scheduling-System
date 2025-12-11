import express from "express";
import { fetchSubmittedVisits, fetchVisitDetail, zdeApproveSchedule, zdeRejectSchedule } from "../controllers/approvalController.js";

const router = express.Router();

// GET /api/isa-dashboard?month=December
router.get("/", fetchSubmittedVisits);
router.get("/visitDetail/:isa_id", fetchVisitDetail);
router.patch("/zde/approve/:isa_id", zdeApproveSchedule);
router.patch("/zde/reject/:isa_id", zdeRejectSchedule);



export default router;
