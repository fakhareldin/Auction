import axios from 'axios';
import type {
  Listing,
  CreateListingDto,
  UpdateListingDto,
  ListingFilters,
  PaginatedResponse,
} from '@haraj/shared';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const listingService = {
  // Get all listings with filters
  async getListings(filters?: ListingFilters): Promise<PaginatedResponse<Listing>> {
    const params = new URLSearchParams();

    if (filters) {
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.categoryId) params.append('categoryId', filters.categoryId);
      if (filters.city) params.append('city', filters.city);
      if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
      if (filters.condition) params.append('condition', filters.condition);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    }

    const response = await api.get(`/listings?${params.toString()}`);
    return response.data;
  },

  // Get single listing
  async getListingById(id: string): Promise<Listing> {
    const response = await api.get(`/listings/${id}`);
    return response.data.data;
  },

  // Create listing
  async createListing(data: CreateListingDto): Promise<Listing> {
    const response = await api.post('/listings', data);
    return response.data.data;
  },

  // Update listing
  async updateListing(id: string, data: UpdateListingDto): Promise<Listing> {
    const response = await api.put(`/listings/${id}`, data);
    return response.data.data;
  },

  // Delete listing
  async deleteListing(id: string): Promise<void> {
    await api.delete(`/listings/${id}`);
  },

  // Get my listings
  async getMyListings(page = 1, limit = 20): Promise<PaginatedResponse<Listing>> {
    const response = await api.get(`/listings/my-listings?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Upload images
  async uploadImages(listingId: string, files: File[]): Promise<void> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    await api.post(`/listings/${listingId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete image
  async deleteImage(imageId: string): Promise<void> {
    await api.delete(`/listings/images/${imageId}`);
  },
};

export default listingService;
