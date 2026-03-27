import { Offer, OfferStatus, Prisma } from '@prisma/client';
import prisma from '../config/database';
import { AppError } from '../middlewares/error.middleware';

export interface CreateOfferDto {
  listingId: string;
  amount: number;
  message?: string;
}

export interface UpdateOfferDto {
  status: OfferStatus;
  sellerMessage?: string;
  counterAmount?: number;
}

export class OfferService {
  async createOffer(buyerId: string, data: CreateOfferDto): Promise<Offer> {
    // Get listing to verify it exists and get seller info
    const listing = await prisma.listing.findUnique({
      where: { id: data.listingId },
      include: { user: true },
    });

    if (!listing) {
      throw new AppError(404, 'الإعلان غير موجود', 'LISTING_NOT_FOUND');
    }

    if (listing.userId === buyerId) {
      throw new AppError(400, 'لا يمكنك تقديم عرض على إعلانك الخاص', 'CANNOT_OFFER_OWN_LISTING');
    }

    if (listing.status !== 'ACTIVE') {
      throw new AppError(400, 'هذا الإعلان غير متاح للتفاوض', 'LISTING_NOT_ACTIVE');
    }

    // Check if buyer already has a pending offer on this listing
    const existingOffer = await prisma.offer.findFirst({
      where: {
        listingId: data.listingId,
        buyerId,
        status: {
          in: [OfferStatus.PENDING, OfferStatus.COUNTERED],
        },
      },
    });

    if (existingOffer) {
      throw new AppError(
        400,
        'لديك عرض قائم على هذا الإعلان. يرجى انتظار رد البائع أو سحب العرض الحالي',
        'OFFER_ALREADY_EXISTS'
      );
    }

    // Create offer
    const offer = await prisma.offer.create({
      data: {
        listingId: data.listingId,
        buyerId,
        sellerId: listing.userId,
        amount: new Prisma.Decimal(data.amount),
        message: data.message,
        status: OfferStatus.PENDING,
      },
      include: {
        buyer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        listing: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
      },
    });

    return offer;
  }

  async getOfferById(id: string, userId: string): Promise<Offer> {
    const offer = await prisma.offer.findUnique({
      where: { id },
      include: {
        buyer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        listing: {
          select: {
            id: true,
            title: true,
            price: true,
            images: {
              take: 1,
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!offer) {
      throw new AppError(404, 'العرض غير موجود', 'OFFER_NOT_FOUND');
    }

    // Verify user has access to this offer (must be buyer or seller)
    if (offer.buyerId !== userId && offer.sellerId !== userId) {
      throw new AppError(403, 'ليس لديك صلاحية لعرض هذا العرض', 'FORBIDDEN');
    }

    return offer;
  }

  async getMyOffersAsBuyer(buyerId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [offers, total] = await Promise.all([
      prisma.offer.findMany({
        where: { buyerId },
        include: {
          listing: {
            select: {
              id: true,
              title: true,
              price: true,
              images: {
                take: 1,
                orderBy: { order: 'asc' },
              },
            },
          },
          seller: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.offer.count({ where: { buyerId } }),
    ]);

    return {
      offers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getMyOffersAsSeller(sellerId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [offers, total] = await Promise.all([
      prisma.offer.findMany({
        where: { sellerId },
        include: {
          listing: {
            select: {
              id: true,
              title: true,
              price: true,
              images: {
                take: 1,
                orderBy: { order: 'asc' },
              },
            },
          },
          buyer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.offer.count({ where: { sellerId } }),
    ]);

    return {
      offers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getListingOffers(listingId: string, userId: string) {
    // Verify user owns this listing
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new AppError(404, 'الإعلان غير موجود', 'LISTING_NOT_FOUND');
    }

    if (listing.userId !== userId) {
      throw new AppError(403, 'ليس لديك صلاحية لعرض عروض هذا الإعلان', 'FORBIDDEN');
    }

    const offers = await prisma.offer.findMany({
      where: { listingId },
      include: {
        buyer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return offers;
  }

  async updateOffer(id: string, userId: string, data: UpdateOfferDto): Promise<Offer> {
    const offer = await prisma.offer.findUnique({
      where: { id },
      include: { listing: true },
    });

    if (!offer) {
      throw new AppError(404, 'العرض غير موجود', 'OFFER_NOT_FOUND');
    }

    // Only seller can update offer
    if (offer.sellerId !== userId) {
      throw new AppError(403, 'فقط البائع يمكنه الرد على العروض', 'FORBIDDEN');
    }

    // Can only update pending or countered offers
    if (offer.status !== OfferStatus.PENDING && offer.status !== OfferStatus.COUNTERED) {
      throw new AppError(400, 'لا يمكن تحديث هذا العرض', 'CANNOT_UPDATE_OFFER');
    }

    const updateData: any = {
      status: data.status,
      sellerMessage: data.sellerMessage,
      updatedAt: new Date(),
    };

    if (data.status === OfferStatus.COUNTERED) {
      if (!data.counterAmount) {
        throw new AppError(400, 'يجب تحديد مبلغ العرض المضاد', 'COUNTER_AMOUNT_REQUIRED');
      }
      updateData.counterAmount = new Prisma.Decimal(data.counterAmount);
    }

    const updatedOffer = await prisma.offer.update({
      where: { id },
      data: updateData,
      include: {
        buyer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        listing: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
      },
    });

    // If offer is accepted, mark listing as sold
    if (data.status === OfferStatus.ACCEPTED) {
      await prisma.listing.update({
        where: { id: offer.listingId },
        data: { status: 'SOLD' },
      });

      // Reject all other offers on this listing
      await prisma.offer.updateMany({
        where: {
          listingId: offer.listingId,
          id: { not: id },
          status: {
            in: [OfferStatus.PENDING, OfferStatus.COUNTERED],
          },
        },
        data: { status: OfferStatus.REJECTED },
      });
    }

    return updatedOffer;
  }

  async withdrawOffer(id: string, userId: string): Promise<void> {
    const offer = await prisma.offer.findUnique({
      where: { id },
    });

    if (!offer) {
      throw new AppError(404, 'العرض غير موجود', 'OFFER_NOT_FOUND');
    }

    // Only buyer can withdraw their offer
    if (offer.buyerId !== userId) {
      throw new AppError(403, 'فقط المشتري يمكنه سحب العرض', 'FORBIDDEN');
    }

    // Can only withdraw pending or countered offers
    if (offer.status !== OfferStatus.PENDING && offer.status !== OfferStatus.COUNTERED) {
      throw new AppError(400, 'لا يمكن سحب هذا العرض', 'CANNOT_WITHDRAW_OFFER');
    }

    await prisma.offer.update({
      where: { id },
      data: { status: OfferStatus.WITHDRAWN },
    });
  }
}

export default new OfferService();
