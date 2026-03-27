export enum ListingStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  SOLD = 'SOLD',
  EXPIRED = 'EXPIRED',
  REJECTED = 'REJECTED',
}

export enum ListingCondition {
  NEW = 'NEW',
  USED_LIKE_NEW = 'USED_LIKE_NEW',
  USED_GOOD = 'USED_GOOD',
  USED_FAIR = 'USED_FAIR',
}

export interface ListingImage {
  id: string;
  url: string;
  publicId: string;
  order: number;
  createdAt: Date;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  negotiable: boolean;
  condition: ListingCondition;
  status: ListingStatus;
  categoryId: string;
  userId: string;
  city: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  images?: ListingImage[];
  viewCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  expiresAt?: Date | string;
  isFeatured: boolean;
  featuredUntil?: Date | string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    city: string;
    createdAt?: Date | string;
    phoneNumber?: string;
  };
  category?: {
    id: string;
    nameAr: string;
    nameEn: string;
    slug: string;
  };
}

export interface ListingWithUser extends Listing {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    city: string;
  };
  category: {
    id: string;
    nameAr: string;
    nameEn: string;
    slug: string;
  };
}

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
  condition?: ListingCondition | string;
  status?: ListingStatus | string;
  search?: string;
  userId?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'price' | 'viewCount' | string;
  sortOrder?: 'asc' | 'desc' | string;
}

export interface ListingQuery extends ListingFilters {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'price' | 'viewCount';
  sortOrder?: 'asc' | 'desc';
}
