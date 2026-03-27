import { PAGINATION_DEFAULT_LIMIT, PAGINATION_MAX_LIMIT } from '@haraj/shared';

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginationResult {
  skip: number;
  take: number;
  page: number;
  limit: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export const getPaginationParams = (options: PaginationOptions): PaginationResult => {
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(
    options.limit || PAGINATION_DEFAULT_LIMIT,
    PAGINATION_MAX_LIMIT
  );

  return {
    skip: (page - 1) * limit,
    take: limit,
    page,
    limit,
  };
};

export const getPaginationMeta = (
  total: number,
  page: number,
  limit: number
): PaginationMeta => {
  return {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  };
};
