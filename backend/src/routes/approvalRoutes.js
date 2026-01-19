import express from 'express';
import {
  fetchSubmittedVisits,
  fetchVisitDetail,
  adeApproveSchedule,
  adeRejectSchedule,
  ddeApproveSchedule,
  ddeRejectSchedule,
  getLatestRejectionForISA,
} from '../controllers/approvalController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Apply JWT authentication to all routes
router.use(authenticate);

// GET /api/isa-dashboard?month=December
router.get(
  '/',
  authorizeRoles('ZDE', 'DDE', 'ADE'), // check roles
  fetchSubmittedVisits
);

router.get(
  '/visitDetail/:isa_id',
  authorizeRoles('ZDE', 'DDE', 'ADE'),
  fetchVisitDetail
);

// // ZDE actions
// router.post('/zde/approve/:isa_id', authorizeRoles('ZDE'), zdeApproveSchedule);
// router.post('/zde/reject/:isa_id', authorizeRoles('ZDE'), zdeRejectSchedule);

// DDE actions

router.post('/dde/approve/:isa_id', authorizeRoles('DDE'), ddeApproveSchedule);
router.post('/dde/reject/:isa_id', authorizeRoles('DDE'), ddeRejectSchedule);

// ADE actions

router.post('/ade/approve/:isa_id', authorizeRoles('ADE'), adeApproveSchedule);
router.post('/ade/reject/:isa_id', authorizeRoles('ADE'), adeRejectSchedule);

router.get(
  '/rejections/latest/:isa_id',
  authorizeRoles('ISA'),
  getLatestRejectionForISA
);

export default router;
