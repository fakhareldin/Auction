import prisma from '../config/database';
import { AppError } from '../middlewares/error.middleware';
import { UserRole } from '@prisma/client';

export const adminService = {
  /**
   * Get all users with pagination and filters
   */
  async getAllUsers(filters: {
    page?: number;
    limit?: number;
    role?: UserRole;
    search?: string;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.role) {
      where.role = filters.role;
    }

    if (filters.search) {
      where.OR = [
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          city: true,
          role: true,
          createdAt: true,
          lastLoginAt: true,
          _count: {
            select: {
              listings: true,
              sentMessages: true,
              favorites: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return {
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Update user role (USER -> MODERATOR -> ADMIN)
   */
  async updateUserRole(adminId: string, userId: string, newRole: UserRole) {
    // Check admin permissions
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true },
    });

    if (!admin || admin.role !== 'ADMIN') {
      throw new AppError(403, 'فقط المديرون يمكنهم تغيير الأدوار', 'FORBIDDEN');
    }

    // Cannot change your own role
    if (adminId === userId) {
      throw new AppError(400, 'لا يمكنك تغيير دورك الخاص', 'CANNOT_CHANGE_OWN_ROLE');
    }

    // Update user role
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    return user;
  },

  /**
   * Ban/suspend user
   */
  async suspendUser(adminId: string, userId: string, reason: string) {
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true },
    });

    if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'MODERATOR')) {
      throw new AppError(403, 'ليس لديك صلاحية لتعليق المستخدمين', 'FORBIDDEN');
    }

    if (adminId === userId) {
      throw new AppError(400, 'لا يمكنك تعليق نفسك', 'CANNOT_SUSPEND_SELF');
    }

    // In a real app, you'd have a 'suspended' field in User model
    // For now, we'll log it as a report
    await prisma.report.create({
      data: {
        listingId: '', // We need to modify schema or create UserReport model
        userId: adminId,
        reason: `تعليق المستخدم: ${reason}`,
        status: 'RESOLVED',
      },
    });

    return { message: `تم تعليق المستخدم: ${reason}` };
  },

  /**
   * Delete user account (hard delete)
   */
  async deleteUser(adminId: string, userId: string) {
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true },
    });

    if (!admin || admin.role !== 'ADMIN') {
      throw new AppError(403, 'فقط المديرون يمكنهم حذف المستخدمين', 'FORBIDDEN');
    }

    if (adminId === userId) {
      throw new AppError(400, 'لا يمكنك حذف حسابك الخاص', 'CANNOT_DELETE_SELF');
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'تم حذف المستخدم بنجاح' };
  },

  /**
   * Get dashboard statistics
   */
  async getDashboardStats() {
    const [
      totalUsers,
      totalListings,
      activeListings,
      totalMessages,
      totalOffers,
      usersByRole,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.listing.count(),
      prisma.listing.count({ where: { status: 'ACTIVE' } }),
      prisma.message.count(),
      prisma.offer.count(),
      prisma.user.groupBy({
        by: ['role'],
        _count: true,
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      totalUsers,
      totalListings,
      activeListings,
      totalMessages,
      totalOffers,
      usersByRole: usersByRole.reduce((acc, curr) => {
        acc[curr.role] = curr._count;
        return acc;
      }, {} as Record<string, number>),
      recentUsers,
    };
  },

  /**
   * Get all listings (for moderation)
   */
  async getAllListings(filters: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters.status) {
      where.status = filters.status;
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          category: {
            select: {
              id: true,
              nameAr: true,
            },
          },
          images: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.listing.count({ where }),
    ]);

    return {
      data: listings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Update listing status (approve/reject)
   */
  async updateListingStatus(
    adminId: string,
    listingId: string,
    status: 'ACTIVE' | 'REJECTED',
    reason?: string
  ) {
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true },
    });

    if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'MODERATOR')) {
      throw new AppError(403, 'ليس لديك صلاحية لتعديل حالة الإعلانات', 'FORBIDDEN');
    }

    const listing = await prisma.listing.update({
      where: { id: listingId },
      data: { status },
    });

    // If rejected, notify user (in real app, send notification/email)
    if (status === 'REJECTED' && reason) {
      console.log(`Listing ${listingId} rejected: ${reason}`);
    }

    return listing;
  },

  /**
   * Get all reports
   */
  async getAllReports(filters: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters.status) {
      where.status = filters.status;
    }

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          listing: {
            select: {
              id: true,
              title: true,
              status: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.report.count({ where }),
    ]);

    return {
      data: reports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Update report status
   */
  async updateReportStatus(
    adminId: string,
    reportId: string,
    status: string
  ) {
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true },
    });

    if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'MODERATOR')) {
      throw new AppError(403, 'ليس لديك صلاحية لتعديل حالة البلاغات', 'FORBIDDEN');
    }

    const report = await prisma.report.update({
      where: { id: reportId },
      data: { status },
    });

    return report;
  },
};
