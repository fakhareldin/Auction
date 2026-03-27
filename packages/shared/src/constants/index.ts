export { SAUDI_CITIES, CITIES } from './cities';
export type { CitCode } from './cities';
export * from './categories';

export const PASSWORD_MIN_LENGTH = 8;
export const MAX_IMAGES_PER_LISTING = 10;
export const MAX_IMAGE_SIZE_MB = 5;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const JWT_ACCESS_EXPIRES_IN = '15m';
export const JWT_REFRESH_EXPIRES_IN = '7d';

export const PAGINATION_DEFAULT_LIMIT = 20;
export const PAGINATION_MAX_LIMIT = 100;
