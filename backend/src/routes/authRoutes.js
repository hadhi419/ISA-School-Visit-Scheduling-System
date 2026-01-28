import express from 'express';
import {
  loginUser,
  registerUser,
  getAllUsers,
  editUser,
  changePassword,
} from '../controllers/authController.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { authenticate } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/allUsers', authenticate, authorizeRoles('ADMIN'), getAllUsers);

router.post('/editUser', authenticate, authorizeRoles('ADMIN'), editUser);

router.post(
  '/change-password',
  authenticate,
  authorizeRoles('ADMIN', 'ISA', 'DDE', 'ADE', 'ZDE'),
  changePassword
);

export default router;
