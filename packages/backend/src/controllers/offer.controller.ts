import { Request, Response, NextFunction } from 'express';
import offerService from '../services/offer.service';

export class OfferController {
  async createOffer(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        });
      }

      const offer = await offerService.createOffer(req.user.id, req.body);

      res.status(201).json({
        success: true,
        data: offer,
        message: 'تم إرسال العرض بنجاح',
      });
    } catch (error) {
      next(error);
    }
  }

  async getOffer(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        });
      }

      const offer = await offerService.getOfferById(req.params.id, req.user.id);

      res.status(200).json({
        success: true,
        data: offer,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyOffersAsBuyer(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        });
      }

      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

      const result = await offerService.getMyOffersAsBuyer(req.user.id, page, limit);

      res.status(200).json({
        success: true,
        data: result.offers,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyOffersAsSeller(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        });
      }

      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

      const result = await offerService.getMyOffersAsSeller(req.user.id, page, limit);

      res.status(200).json({
        success: true,
        data: result.offers,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async getListingOffers(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        });
      }

      const offers = await offerService.getListingOffers(req.params.listingId, req.user.id);

      res.status(200).json({
        success: true,
        data: offers,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateOffer(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        });
      }

      const offer = await offerService.updateOffer(req.params.id, req.user.id, req.body);

      res.status(200).json({
        success: true,
        data: offer,
        message: 'تم تحديث العرض بنجاح',
      });
    } catch (error) {
      next(error);
    }
  }

  async withdrawOffer(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        });
      }

      await offerService.withdrawOffer(req.params.id, req.user.id);

      res.status(200).json({
        success: true,
        message: 'تم سحب العرض بنجاح',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new OfferController();
