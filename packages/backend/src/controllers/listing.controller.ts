import { Request, Response, NextFunction } from 'express';
import listingService from '../services/listing.service';

export class ListingController {
  async createListing(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        });
      }

      const listing = await listingService.createListing(req.user.id, req.body);

      res.status(201).json({
        success: true,
        data: listing,
        message: 'Listing created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getListings(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = {
        categoryId: req.query.categoryId as string,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
        city: req.query.city as string,
        condition: req.query.condition as any,
        status: req.query.status as any,
        search: req.query.search as string,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        sortBy: req.query.sortBy as any,
        sortOrder: req.query.sortOrder as any,
      };

      const result = await listingService.getListings(filters);

      res.status(200).json({
        success: true,
        data: result.listings,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async getListingById(req: Request, res: Response, next: NextFunction) {
    try {
      const listing = await listingService.getListingById(req.params.id, true);

      res.status(200).json({
        success: true,
        data: listing,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateListing(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        });
      }

      const listing = await listingService.updateListing(
        req.params.id,
        req.user.id,
        req.body
      );

      res.status(200).json({
        success: true,
        data: listing,
        message: 'Listing updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteListing(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        });
      }

      await listingService.deleteListing(req.params.id, req.user.id);

      res.status(200).json({
        success: true,
        message: 'Listing deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyListings(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        });
      }

      const page = req.query.page ? parseInt(req.query.page as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

      const result = await listingService.getUserListings(req.user.id, page, limit);

      res.status(200).json({
        success: true,
        data: result.listings,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadImages(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        });
      }

      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          error: { code: 'NO_FILES', message: 'No images provided' },
        });
      }

      await listingService.uploadImages(req.params.id, req.user.id, req.files);

      res.status(200).json({
        success: true,
        message: 'Images uploaded successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteImage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        });
      }

      await listingService.deleteImage(req.params.imageId, req.user.id);

      res.status(200).json({
        success: true,
        message: 'Image deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ListingController();
