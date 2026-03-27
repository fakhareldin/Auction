import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import Joi from 'joi';
import { AppError } from '../middlewares/error.middleware';

// Validation schemas
const updateProfileSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  phoneNumber: Joi.string().pattern(/^[0-9+\s-()]+$/).optional().allow(''),
  city: Joi.string().max(100).optional(),
  bio: Joi.string().max(500).optional().allow(''),
});

const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
});

export const userController = {
  /**
   * Get current user profile
   */
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const user = await userService.getUserById(userId);

      res.json({
        success: true,
        data: user,
        message: 'تم جلب البيانات بنجاح',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get user by ID (public profile)
   */
  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);

      res.json({
        success: true,
        data: user,
        message: 'تم جلب البيانات بنجاح',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      // Validate input
      const { error, value } = updateProfileSchema.validate(req.body);
      if (error) {
        throw new AppError(400, error.details[0].message, 'VALIDATION_ERROR');
      }

      const updatedUser = await userService.updateProfile(userId, value);

      res.json({
        success: true,
        data: updatedUser,
        message: 'تم تحديث البيانات بنجاح',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update user avatar
   */
  async updateAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { avatarUrl } = req.body;

      if (!avatarUrl) {
        throw new AppError(400, 'رابط الصورة مطلوب', 'AVATAR_URL_REQUIRED');
      }

      const updatedUser = await userService.updateAvatar(userId, avatarUrl);

      res.json({
        success: true,
        data: updatedUser,
        message: 'تم تحديث الصورة الشخصية بنجاح',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update user password
   */
  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      // Validate input
      const { error, value } = updatePasswordSchema.validate(req.body);
      if (error) {
        throw new AppError(400, error.details[0].message, 'VALIDATION_ERROR');
      }

      const result = await userService.updatePassword(userId, value);

      res.json({
        success: true,
        data: result,
        message: 'تم تحديث كلمة المرور بنجاح',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get user statistics
   */
  async getUserStats(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const stats = await userService.getUserStats(userId);

      res.json({
        success: true,
        data: stats,
        message: 'تم جلب الإحصائيات بنجاح',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete user account
   */
  async deleteAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const result = await userService.deleteAccount(userId);

      res.json({
        success: true,
        data: result,
        message: 'تم حذف الحساب بنجاح',
      });
    } catch (error) {
      next(error);
    }
  },
};
