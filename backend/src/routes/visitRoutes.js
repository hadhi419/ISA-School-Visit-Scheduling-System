import express from 'express';
import {
  postMultipleVisits,
  fetchAllVisits,
  submitMonthlyVisits,
  checkMonthlyEditPermission,
  deleteVisit,
  getVisitsByIsa,
  getVisitsByLocation,
} from '../controllers/visitController.js';

import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authenticate);

// POST /api/visits
router.post('/', authorizeRoles('ISA'), postMultipleVisits);

router.post('/delete', authorizeRoles('ISA'), deleteVisit);

// GET /api/visits/month/:month/:isa_id
router.get('/month/:month/:isa_id', authorizeRoles('ISA'), fetchAllVisits);

router.get(
  '/month/:month/:isa_id/edit-permission',
  authorizeRoles('ISA'),
  checkMonthlyEditPermission
);

// POST /api/visits/submit
router.post('/submit', authorizeRoles('ISA'), submitMonthlyVisits);

// ISA monitoring route
router.get('/isa', authorizeRoles('ZDE', 'DDE', 'ADE'), getVisitsByIsa);

// Location monitoring route
router.get(
  '/location',
  authorizeRoles('ZDE', 'DDE', 'ADE'),
  getVisitsByLocation
);

export default router;
