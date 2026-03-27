import { Request, Response, NextFunction } from 'express';
import { adminService } from '../services/admin.service';
import Joi from 'joi';
import { AppError } from '../middlewares/error.middleware';
import { UserRole } from '@prisma/client';

// Validation schemas
const updateRoleSchema = Joi.object({
  role: Joi.string().valid('USER', 'MODERATOR', 'ADMIN').required(),
});

const suspendUserSchema = Joi.object({
  reason: Joi.string().min(5).max(500).required(),
});

const updateListingStatusSchema = Joi.object({
  status: Joi.string().valid('ACTIVE', 'REJECTED').required(),
  reason: Joi.string().optional(),
});

const updateReportStatusSchema = Joi.object({
  status: Joi.string().valid('PENDING', 'REVIEWED', 'RESOLVED').required(),
});

export const adminController = {
  /**
   * Get all users
   */
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const role = req.query.role as UserRole | undefined;
      const search = req.query.search as string | undefined;

      const result = await adminService.getAllUsers({ page, limit, role, search });

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update user role
   */
  async updateUserRole(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = req.user!.id;
      const { userId } = req.params;

      const { error, value } = updateRoleSchema.validate(req.body);
      if (error) {
        throw new AppError(400, error.details[0].message, 'VALIDATION_ERROR');
      }

      const user = await adminService.updateUserRole(adminId, userId, value.role);

      res.json({
        success: true,
        data: user,
        message: 'تم تحديث دور المستخدم بنجاح',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Suspend user
   */
  async suspendUser(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = req.user!.id;
      const { userId } = req.params;

      const { error, value } = suspendUserSchema.validate(req.body);
      if (error) {
        throw new AppError(400, error.details[0].message, 'VALIDATION_ERROR');
      }

      const result = await adminService.suspendUser(adminId, userId, value.reason);

      res.json({
        success: true,
        data: result,
        message: 'تم تعليق المستخدم بنجاح',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete user
   */
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = req.user!.id;
      const { userId } = req.params;

      const result = await adminService.deleteUser(adminId, userId);

      res.json({
        success: true,
        data: result,
        message: 'تم حذف المستخدم بنجاح',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await adminService.getDashboardStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all listings
   */
  async getAllListings(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const status = req.query.status as string | undefined;

      const result = await adminService.getAllListings({ page, limit, status });

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update listing status
   */
  async updateListingStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = req.user!.id;
      const { listingId } = req.params;

      const { error, value } = updateListingStatusSchema.validate(req.body);
      if (error) {
        throw new AppError(400, error.details[0].message, 'VALIDATION_ERROR');
      }

      const listing = await adminService.updateListingStatus(
        adminId,
        listingId,
        value.status,
        value.reason
      );

      res.json({
        success: true,
        data: listing,
        message: 'تم تحديث حالة الإعلان بنجاح',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all reports
   */
  async getAllReports(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const status = req.query.status as string | undefined;

      const result = await adminService.getAllReports({ page, limit, status });

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update report status
   */
  async updateReportStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = req.user!.id;
      const { reportId } = req.params;

      const { error, value } = updateReportStatusSchema.validate(req.body);
      if (error) {
        throw new AppError(400, error.details[0].message, 'VALIDATION_ERROR');
      }

      const report = await adminService.updateReportStatus(
        adminId,
        reportId,
        value.status
      );

      res.json({
        success: true,
        data: report,
        message: 'تم تحديث حالة البلاغ بنجاح',
      });
    } catch (error) {
      next(error);
    }
  },
};
