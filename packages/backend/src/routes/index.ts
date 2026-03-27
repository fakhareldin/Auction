import { Router } from 'express';
import authRoutes from './auth.routes';
import listingRoutes from './listing.routes';
import categoryRoutes from './category.routes';
import offerRoutes from './offer.routes';
import userRoutes from './user.routes';
import messageRoutes from './message.routes';
import adminRoutes from './admin.routes';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/listings', listingRoutes);
router.use('/categories', categoryRoutes);
router.use('/offers', offerRoutes);
router.use('/users', userRoutes);
router.use('/messages', messageRoutes);
router.use('/admin', adminRoutes);

export default router;
