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

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  sender?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

export interface Conversation {
  conversationId: string;
  otherUser: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  lastMessage: Message;
  unreadCount: number;
}

export const messageService = {
  // Send a message
  async sendMessage(receiverId: string, content: string) {
    const response = await api.post('/messages', { receiverId, content });
    return response.data.data;
  },

  // Get all conversations
  async getConversations() {
    const response = await api.get('/messages/conversations');
    return response.data.data;
  },

  // Get conversation with specific user
  async getConversation(otherUserId: string, page = 1, limit = 50) {
    const response = await api.get(`/messages/conversations/${otherUserId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Mark conversation as read
  async markAsRead(conversationId: string) {
    const response = await api.patch(`/messages/conversations/${conversationId}/read`);
    return response.data;
  },

  // Get unread count
  async getUnreadCount() {
    const response = await api.get('/messages/unread-count');
    return response.data.data;
  },

  // Delete a message
  async deleteMessage(messageId: string) {
    const response = await api.delete(`/messages/${messageId}`);
    return response.data;
  },
};

export default messageService;
