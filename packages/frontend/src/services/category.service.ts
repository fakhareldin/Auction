import axios from 'axios';
import type { Category } from '@haraj/shared';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const categoryService = {
  // Get all categories
  async getAllCategories(): Promise<Category[]> {
    const response = await api.get('/categories');
    // Handle both array and object with data property
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return [];
  },

  // Get single category
  async getCategoryById(id: string): Promise<Category> {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },
};

export default categoryService;
