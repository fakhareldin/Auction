import { Listing, ListingStatus, ListingCondition, Prisma } from '@prisma/client';
import prisma from '../config/database';
import { AppError } from '../middlewares/error.middleware';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination.util';

export interface CreateListingDto {
  title: string;
  description: string;
  price: number;
  negotiable: boolean;
  condition: ListingCondition;
  categoryId: string;
  city: string;
  district?: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateListingDto extends Partial<CreateListingDto> {
  status?: ListingStatus;
}

export interface ListingFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  condition?: ListingCondition;
  status?: ListingStatus;
  search?: string;
  userId?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'price' | 'viewCount';
  sortOrder?: 'asc' | 'desc';
}

export class ListingService {
  async createListing(userId: string, data: CreateListingDto): Promise<Listing> {
    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new AppError(404, 'Category not found', 'CATEGORY_NOT_FOUND');
    }

    const listing = await prisma.listing.create({
      data: {
        ...data,
        price: new Prisma.Decimal(data.price),
        userId,
        status: ListingStatus.ACTIVE,
      },
      include: {
        category: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            city: true,
          },
        },
        images: true,
      },
    });

    return listing;
  }

  async getListings(filters: ListingFilters) {
    const { skip, take, page, limit } = getPaginationParams({
      page: filters.page,
      limit: filters.limit,
    });

    // Build where clause
    const where: Prisma.ListingWhereInput = {
      status: filters.status || ListingStatus.ACTIVE,
    };

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.city) {
      where.city = filters.city;
    }

    if (filters.condition) {
      where.condition = filters.condition;
    }

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price.gte = new Prisma.Decimal(filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = new Prisma.Decimal(filters.maxPrice);
      }
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Build orderBy clause
    const orderBy: Prisma.ListingOrderByWithRelationInput = {};
    const sortBy = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'desc';
    orderBy[sortBy] = sortOrder;

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          category: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
              city: true,
            },
          },
          images: {
            orderBy: { order: 'asc' },
          },
        },
        skip,
        take,
        orderBy,
      }),
      prisma.listing.count({ where }),
    ]);

    return {
      listings,
      pagination: getPaginationMeta(total, page, limit),
    };
  }

  async getListingById(id: string, incrementView = false): Promise<Listing> {
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        category: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            city: true,
            phoneNumber: true,
            createdAt: true,
          },
        },
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!listing) {
      throw new AppError(404, 'Listing not found', 'LISTING_NOT_FOUND');
    }

    // Increment view count
    if (incrementView) {
      await prisma.listing.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });
    }

    return listing;
  }

  async updateListing(
    id: string,
    userId: string,
    data: UpdateListingDto
  ): Promise<Listing> {
    const listing = await prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      throw new AppError(404, 'Listing not found', 'LISTING_NOT_FOUND');
    }

    if (listing.userId !== userId) {
      throw new AppError(403, 'You can only update your own listings', 'FORBIDDEN');
    }

    const updateData: any = { ...data };
    if (data.price !== undefined) {
      updateData.price = new Prisma.Decimal(data.price);
    }

    const updatedListing = await prisma.listing.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            city: true,
          },
        },
        images: true,
      },
    });

    return updatedListing;
  }

  async deleteListing(id: string, userId: string): Promise<void> {
    const listing = await prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      throw new AppError(404, 'Listing not found', 'LISTING_NOT_FOUND');
    }

    if (listing.userId !== userId) {
      throw new AppError(403, 'You can only delete your own listings', 'FORBIDDEN');
    }

    await prisma.listing.delete({
      where: { id },
    });
  }

  async getUserListings(userId: string, page?: number, limit?: number) {
    return this.getListings({ userId, page, limit });
  }

  async uploadImages(
    listingId: string,
    userId: string,
    files: Express.Multer.File[]
  ): Promise<void> {
    // Verify listing exists and belongs to user
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { images: true },
    });

    if (!listing) {
      throw new AppError(404, 'Listing not found', 'LISTING_NOT_FOUND');
    }

    if (listing.userId !== userId) {
      throw new AppError(403, 'You can only upload images to your own listings', 'FORBIDDEN');
    }

    // Check total images limit (10 max)
    const currentImageCount = listing.images.length;
    if (currentImageCount + files.length > 10) {
      throw new AppError(
        400,
        `Cannot upload more than 10 images. Current: ${currentImageCount}`,
        'IMAGE_LIMIT_EXCEEDED'
      );
    }

    // Process and save images locally
    const uploadPromises = files.map(async (file: any, index) => {
      // File is already saved by multer, we just need to create DB record
      const filename = file.filename;
      const url = `/uploads/${filename}`;

      // Save image record to database
      await prisma.listingImage.create({
        data: {
          listingId,
          url,
          publicId: filename, // Store filename as publicId for deletion
          order: currentImageCount + index,
        },
      });
    });

    await Promise.all(uploadPromises);
  }

  async deleteImage(imageId: string, userId: string): Promise<void> {
    const image = await prisma.listingImage.findUnique({
      where: { id: imageId },
      include: { listing: true },
    });

    if (!image) {
      throw new AppError(404, 'Image not found', 'IMAGE_NOT_FOUND');
    }

    if (image.listing.userId !== userId) {
      throw new AppError(403, 'You can only delete images from your own listings', 'FORBIDDEN');
    }

    // Delete file from disk
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, '../../uploads', image.publicId);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await prisma.listingImage.delete({
      where: { id: imageId },
    });
  }
}

export default new ListingService();
