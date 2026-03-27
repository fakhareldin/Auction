import { Router } from 'express';
import { z } from 'zod';
import listingController from '../controllers/listing.controller';
import { validate } from '../middlewares/validation.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { createListingLimiter } from '../middlewares/rate-limit.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

// Validation schemas
const createListingSchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    price: z.number().positive('Price must be positive'),
    negotiable: z.boolean().default(true),
    condition: z.enum(['NEW', 'USED_LIKE_NEW', 'USED_GOOD', 'USED_FAIR']),
    categoryId: z.string().uuid('Invalid category ID'),
    city: z.string().min(2, 'City is required'),
    district: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  }),
});

const updateListingSchema = z.object({
  body: z.object({
    title: z.string().min(5).optional(),
    description: z.string().min(20).optional(),
    price: z.number().positive().optional(),
    negotiable: z.boolean().optional(),
    condition: z.enum(['NEW', 'USED_LIKE_NEW', 'USED_GOOD', 'USED_FAIR']).optional(),
    categoryId: z.string().uuid().optional(),
    city: z.string().min(2).optional(),
    district: z.string().optional(),
    status: z.enum(['DRAFT', 'ACTIVE', 'SOLD', 'EXPIRED', 'REJECTED']).optional(),
  }),
});

// Routes
router.get('/', listingController.getListings);

router.get('/my-listings', authenticate, listingController.getMyListings);

router.get('/:id', listingController.getListingById);

router.post(
  '/',
  authenticate,
  createListingLimiter,
  validate(createListingSchema),
  listingController.createListing
);

router.put(
  '/:id',
  authenticate,
  validate(updateListingSchema),
  listingController.updateListing
);

router.delete('/:id', authenticate, listingController.deleteListing);

// Image routes
router.post(
  '/:id/images',
  authenticate,
  upload.array('images', 10),
  listingController.uploadImages
);

router.delete('/images/:imageId', authenticate, listingController.deleteImage);

export default router;
