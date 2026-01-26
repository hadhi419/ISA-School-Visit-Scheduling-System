import express from 'express';
import {
  fetchSubmittedVisits,
  fetchVisitDetail,
  // adeApproveSchedule,
  // adeRejectSchedule,
  // ddeApproveSchedule,
  // ddeRejectSchedule,
  approveSchedule,
  rejectSchedule,
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

router.post(
  '/dde/approve/:target_user_id',
  authorizeRoles('DDE'),
  approveSchedule
);
router.post(
  '/dde/reject/:target_user_id',
  authorizeRoles('DDE'),
  rejectSchedule
);

// ADE actions

router.post(
  '/ade/approve/:target_user_id',
  authorizeRoles('ADE'),
  approveSchedule
);
router.post(
  '/ade/reject/:target_user_id',
  authorizeRoles('ADE'),
  rejectSchedule
);

router.post(
  '/zde/approve/:target_user_id',
  authorizeRoles('ZDE'),
  approveSchedule
);
router.post(
  '/zde/reject/:target_user_id',
  authorizeRoles('ZDE'),
  rejectSchedule
);

router.get(
  '/rejections/latest/:isa_id',
  authorizeRoles('ISA'),
  getLatestRejectionForISA
);

export default router;
