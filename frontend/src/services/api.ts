import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  user_id: number;
}

export interface AuthResponse {
  message: string;
  access_token: string;
  user: User;
}

export interface TodoResponse {
  message: string;
  todo: Todo;
}

export interface TodosResponse {
  todos: Todo[];
}

// Auth API functions
export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post<AuthResponse>('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),
  
  googleAuth: (token: string) =>
    api.post<AuthResponse>('/auth/google', { token }),
  
  getMe: () =>
    api.get<{ user: User }>('/auth/me'),
};

// Todo API functions
export const todoAPI = {
  getTodos: () =>
    api.get<TodosResponse>('/todos'),
  
  createTodo: (data: { title: string; description?: string }) =>
    api.post<TodoResponse>('/todos', data),
  
  updateTodo: (id: number, data: { title?: string; description?: string; completed?: boolean }) =>
    api.put<TodoResponse>(`/todos/${id}`, data),
  
  deleteTodo: (id: number) =>
    api.delete(`/todos/${id}`),
};
