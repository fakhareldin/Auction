import axios from 'axios';

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

export interface CreateOfferDto {
  listingId: string;
  amount: number;
  message?: string;
}

export interface UpdateOfferDto {
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COUNTERED' | 'WITHDRAWN';
  sellerMessage?: string;
  counterAmount?: number;
}

export const offerService = {
  // Create offer
  async createOffer(data: CreateOfferDto): Promise<any> {
    const response = await api.post('/offers', data);
    return response.data.data;
  },

  // Get offer by ID
  async getOffer(id: string): Promise<any> {
    const response = await api.get(`/offers/${id}`);
    return response.data.data;
  },

  // Get my offers as buyer
  async getMyOffersAsBuyer(page = 1, limit = 20): Promise<any> {
    const response = await api.get(`/offers/my-offers-buyer?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get my offers as seller
  async getMyOffersAsSeller(page = 1, limit = 20): Promise<any> {
    const response = await api.get(`/offers/my-offers-seller?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get listing offers (for seller)
  async getListingOffers(listingId: string): Promise<any> {
    const response = await api.get(`/offers/listing/${listingId}`);
    return response.data.data;
  },

  // Update offer (accept/reject/counter)
  async updateOffer(id: string, data: UpdateOfferDto): Promise<any> {
    const response = await api.put(`/offers/${id}`, data);
    return response.data.data;
  },

  // Withdraw offer
  async withdrawOffer(id: string): Promise<void> {
    await api.delete(`/offers/${id}`);
  },
};

export default offerService;
