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

export interface UserStats {
  listingsCount: number;
  favoritesCount: number;
  messagesCount: number;
}

export const userService = {
  // Get current user profile
  async getProfile() {
    const response = await api.get('/users/me');
    return response.data.data;
  },

  // Get user by ID
  async getUserById(id: string) {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  },

  // Update user profile
  async updateProfile(data: UpdateUserProfileDto) {
    const response = await api.put('/users/me', data);
    return response.data.data;
  },

  // Update avatar
  async updateAvatar(avatarUrl: string) {
    const response = await api.patch('/users/me/avatar', { avatarUrl });
    return response.data.data;
  },

  // Update password
  async updatePassword(data: UpdatePasswordDto) {
    const response = await api.patch('/users/me/password', data);
    return response.data;
  },

  // Get user statistics
  async getUserStats() {
    const response = await api.get('/users/me/stats');
    return response.data.data;
  },

  // Delete account
  async deleteAccount() {
    const response = await api.delete('/users/me');
    return response.data;
  },
};

export default userService;
