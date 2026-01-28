import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { generateVisitPdf } from '../controllers/visitPdfController.js';

const router = express.Router();

router.use(authenticate);

router.post(
  '/pdf',
  generateVisitPdf,
  authorizeRoles('ISA', 'ZDE', 'DDE', 'ADE')
);

export default router; // ✅ REQUIRED
