import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Dashboard stats (ADMIN and MODERATOR)
router.get(
  '/dashboard/stats',
  authorize('ADMIN', 'MODERATOR'),
  adminController.getDashboardStats
);

// User Management (ADMIN only)
router.get('/users', authorize('ADMIN'), adminController.getAllUsers);
router.patch(
  '/users/:userId/role',
  authorize('ADMIN'),
  adminController.updateUserRole
);
router.post(
  '/users/:userId/suspend',
  authorize('ADMIN', 'MODERATOR'),
  adminController.suspendUser
);
router.delete(
  '/users/:userId',
  authorize('ADMIN'),
  adminController.deleteUser
);

// Listing Management (ADMIN and MODERATOR)
router.get(
  '/listings',
  authorize('ADMIN', 'MODERATOR'),
  adminController.getAllListings
);
router.patch(
  '/listings/:listingId/status',
  authorize('ADMIN', 'MODERATOR'),
  adminController.updateListingStatus
);

// Report Management (ADMIN and MODERATOR)
router.get(
  '/reports',
  authorize('ADMIN', 'MODERATOR'),
  adminController.getAllReports
);
router.patch(
  '/reports/:reportId/status',
  authorize('ADMIN', 'MODERATOR'),
  adminController.updateReportStatus
);

export default router;
