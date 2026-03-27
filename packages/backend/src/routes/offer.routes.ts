import { Router } from 'express';
import { z } from 'zod';
import offerController from '../controllers/offer.controller';
import { validate } from '../middlewares/validation.middleware';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Validation schemas
const createOfferSchema = z.object({
  body: z.object({
    listingId: z.string().uuid('Invalid listing ID'),
    amount: z.number().positive('Amount must be positive'),
    message: z.string().optional(),
  }),
});

const updateOfferSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED', 'COUNTERED', 'WITHDRAWN']),
    sellerMessage: z.string().optional(),
    counterAmount: z.number().positive().optional(),
  }),
});

// All routes require authentication
router.use(authenticate);

// Routes
router.post('/', validate(createOfferSchema), offerController.createOffer);

router.get('/my-offers-buyer', offerController.getMyOffersAsBuyer);

router.get('/my-offers-seller', offerController.getMyOffersAsSeller);

router.get('/listing/:listingId', offerController.getListingOffers);

router.get('/:id', offerController.getOffer);

router.put('/:id', validate(updateOfferSchema), offerController.updateOffer);

router.delete('/:id', offerController.withdrawOffer);

export default router;
