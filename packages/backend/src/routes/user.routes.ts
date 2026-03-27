import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get current user profile
router.get('/me', userController.getProfile);

// Update current user profile
router.put('/me', userController.updateProfile);

// Update avatar
router.patch('/me/avatar', userController.updateAvatar);

// Update password
router.patch('/me/password', userController.updatePassword);

// Get user statistics
router.get('/me/stats', userController.getUserStats);

// Delete account
router.delete('/me', userController.deleteAccount);

// Get user by ID (public profile)
router.get('/:id', userController.getUserById);

export default router;
