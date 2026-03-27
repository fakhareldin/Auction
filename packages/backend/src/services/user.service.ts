import prisma from '../config/database';
import { AppError } from '../middlewares/error.middleware';
import { hashPassword, comparePassword } from '../utils/bcrypt.util';

export interface UpdateUserProfileDto {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  city?: string;
  bio?: string;
}

export interface UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export const userService = {
  /**
   * Get user by ID
   */
  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        city: true,
        bio: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError(404, 'المستخدم غير موجود', 'USER_NOT_FOUND');
    }

    return user;
  },

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: UpdateUserProfileDto) {
    // Check if phone number is being updated and is already taken
    if (data.phoneNumber) {
      const existingUser = await prisma.user.findFirst({
        where: {
          phoneNumber: data.phoneNumber,
          NOT: { id: userId },
        },
      });

      if (existingUser) {
        throw new AppError(409, 'رقم الجوال مسجل بالفعل', 'PHONE_EXISTS');
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.firstName && { firstName: data.firstName }),
        ...(data.lastName && { lastName: data.lastName }),
        ...(data.phoneNumber && { phoneNumber: data.phoneNumber }),
        ...(data.city && { city: data.city }),
        ...(data.bio !== undefined && { bio: data.bio }),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        city: true,
        bio: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  },

  /**
   * Update user avatar
   */
  async updateAvatar(userId: string, avatarUrl: string) {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        city: true,
        bio: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  },

  /**
   * Update user password
   */
  async updatePassword(userId: string, data: UpdatePasswordDto) {
    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError(404, 'المستخدم غير موجود', 'USER_NOT_FOUND');
    }

    // Verify current password
    const isPasswordValid = await comparePassword(data.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new AppError(401, 'كلمة المرور الحالية غير صحيحة', 'INVALID_PASSWORD');
    }

    // Hash new password
    const hashedPassword = await hashPassword(data.newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'تم تحديث كلمة المرور بنجاح' };
  },

  /**
   * Get user statistics
   */
  async getUserStats(userId: string) {
    const [listingsCount, favoritesCount] = await Promise.all([
      prisma.listing.count({
        where: { userId },
      }),
      prisma.favorite.count({
        where: { userId },
      }),
    ]);

    return {
      listingsCount,
      favoritesCount,
      messagesCount: 0, // TODO: Implement when messages are ready
    };
  },

  /**
   * Delete user account
   */
  async deleteAccount(userId: string) {
    // Delete user and all related data (cascade)
    await prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'تم حذف الحساب بنجاح' };
  },
};
