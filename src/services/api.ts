import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

class APIService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          window.location.href = '/';
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }
}

export const apiService = new APIService();

export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    apiService.post('/auth/login', credentials),
  register: (userData: any) => apiService.post('/auth/register', userData),
  logout: () => apiService.post('/auth/logout'),
  getProfile: () => apiService.get('/auth/profile'),
};

export const alumniAPI = {
  getAll: (params?: any) => apiService.get('/alumni', { params }),
  getById: (id: string) => apiService.get(`/alumni/${id}`),
  search: (query: string) => apiService.get('/alumni/search', { params: { q: query } }),
  updateProfile: (id: string, data: any) => apiService.put(`/alumni/${id}`, data),
};

export const mentorshipAPI = {
  getAll: (params?: any) => apiService.get('/mentorship', { params }),
  getById: (id: string) => apiService.get(`/mentorship/${id}`),
  request: (mentorId: string, data: any) => apiService.post('/mentorship/request', { mentorId, ...data }),
  getMySessions: () => apiService.get('/mentorship/my-sessions'),
};

export const eventAPI = {
  getAll: (params?: any) => apiService.get('/events', { params }),
  getById: (id: string) => apiService.get(`/events/${id}`),
  register: (eventId: string) => apiService.post(`/events/${eventId}/register`),
  getMyEvents: () => apiService.get('/events/my-events'),
};

export const forumAPI = {
  getCategories: () => apiService.get('/forum/categories'),
  getPosts: (params?: any) => apiService.get('/forum/posts', { params }),
  getPostById: (id: string) => apiService.get(`/forum/posts/${id}`),
  createPost: (data: any) => apiService.post('/forum/posts', data),
  replyToPost: (postId: string, content: string) =>
    apiService.post(`/forum/posts/${postId}/replies`, { content }),
};

export const chatAPI = {
  getConversations: () => apiService.get('/chat/conversations'),
  getMessages: (conversationId: string) =>
    apiService.get(`/chat/conversations/${conversationId}/messages`),
  sendMessage: (conversationId: string, content: string) =>
    apiService.post(`/chat/conversations/${conversationId}/messages`, { content }),
  createConversation: (participantIds: string[]) =>
    apiService.post('/chat/conversations', { participantIds }),
};

export const aiAPI = {
  chat: (messages: any[], options?: any) =>
    apiService.post('/ai/chat', { messages, options }),

  chatStream: async (messages: any[], onChunk: (chunk: string) => void, options?: any) => {
    const response = await fetch(`${API_BASE_URL}/ai/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: JSON.stringify({ messages, options }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) return;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') return;
          try {
            const parsed = JSON.parse(data);
            if (parsed.chunk) {
              onChunk(parsed.chunk);
            }
          } catch (e) {}
        }
      }
    }
  },

  getAlumniRecommendations: (userProfile: any, alumni: any[]) =>
    apiService.post('/ai/recommendations/alumni', { userProfile, alumni }),

  getMentorSuggestions: (studentProfile: any, mentors: any[]) =>
    apiService.post('/ai/recommendations/mentors', { studentProfile, mentors }),

  getEventRecommendations: (userProfile: any, events: any[]) =>
    apiService.post('/ai/recommendations/events', { userProfile, events }),

  getCareerAdvice: (query: string, userContext?: any) =>
    apiService.post('/ai/career-advice', { query, userContext }),

  getInterviewPrep: (jobRole: string, experience: string) =>
    apiService.post('/ai/interview-prep', { jobRole, experience }),

  getNetworkingIcebreakers: (user1Profile: any, user2Profile: any) =>
    apiService.post('/ai/networking/icebreakers', { user1Profile, user2Profile }),

  analyzeProfile: (profileData: any) =>
    apiService.post('/ai/profile/analyze', { profileData }),

  smartSearch: (query: string, context?: any) =>
    apiService.post('/ai/search/smart', { query, context }),
};

export const notificationAPI = {
  getAll: (params?: any) => apiService.get('/notifications', { params }),
  markAsRead: (id: string) => apiService.put(`/notifications/${id}/read`),
  markAllAsRead: () => apiService.put('/notifications/mark-all-read'),
  getUnreadCount: () => apiService.get('/notifications/unread-count'),
};

export const searchAPI = {
  global: (query: string, filters?: any) =>
    apiService.get('/search', { params: { q: query, ...filters } }),
  alumni: (query: string) => apiService.get('/search/alumni', { params: { q: query } }),
  events: (query: string) => apiService.get('/search/events', { params: { q: query } }),
};

export default apiService;
