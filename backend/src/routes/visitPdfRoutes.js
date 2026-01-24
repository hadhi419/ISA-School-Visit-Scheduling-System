import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { generateVisitPdf } from '../controllers/visitPdfController.js';

const router = express.Router();

router.use(authenticate);

router.get(
  '/pdf',
  authorizeRoles('ISA', 'ZDE', 'DDE', 'ADE'),
  generateVisitPdf
);

export default router; // ✅ REQUIRED
