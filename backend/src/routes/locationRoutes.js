import express from 'express';
import { fetchLocations } from '../controllers/locationController.js';

import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Apply JWT authentication to all routes
router.use(authenticate);

// GET /api/locations
router.get('/', authorizeRoles('ISA', 'DDE', 'ZDE', 'ADE'), fetchLocations);

export default router;
