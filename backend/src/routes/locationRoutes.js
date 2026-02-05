import express from 'express';
import {
  fetchLocations,
  addLocation,
  editLocation,
} from '../controllers/locationController.js';

import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Apply JWT authentication to all routes
router.use(authenticate);

// GET /api/locations
router.get(
  '/',
  authorizeRoles('ISA', 'DDE', 'ZDE', 'ADE', 'ADMIN'),
  fetchLocations
);

router.post('/addLocation', authorizeRoles('ADMIN'), addLocation);

router.post('/edit', authorizeRoles('ADMIN'), editLocation);

export default router;
