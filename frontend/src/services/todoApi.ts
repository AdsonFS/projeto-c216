import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

export interface Category {
  id: number;
  name: string;
  description?: string;
  color: string;
  created_at: string;
  updated_at: string;
  todos?: Todo[];
}

export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  categories: Category[];
  created_at: string;
  updated_at: string;
}

export interface CreateTodoData {
  title: string;
  description?: string;
  completed?: boolean;
  dueDate?: string;
  categoryIds?: number[];
}

export interface UpdateTodoData {
  title?: string;
  description?: string;
  completed?: boolean;
  dueDate?: string;
  categoryIds?: number[];
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  color?: string;
}

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
  categoryDistribution: { categoryName: string; count: number; color: string }[];
  dueDateDistribution: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    future: number;
    overdue: number;
  };
}

export const todoApi = {
  // Get all todos
  getAll: async (): Promise<Todo[]> => {
    const response = await api.get<Todo[]>('/todos');
    return response.data;
  },

  // Get todo by id
  getById: async (id: number): Promise<Todo> => {
    const response = await api.get<Todo>(`/todos/${id}`);
    return response.data;
  },

  // Create new todo
  create: async (data: CreateTodoData): Promise<Todo> => {
    const response = await api.post<Todo>('/todos', data);
    return response.data;
  },

  // Update todo
  update: async (id: number, data: UpdateTodoData): Promise<Todo> => {
    const response = await api.patch<Todo>(`/todos/${id}`, data);
    return response.data;
  },

  // Toggle todo completion
  toggleComplete: async (id: number): Promise<Todo> => {
    const response = await api.patch<Todo>(`/todos/${id}/toggle`);
    return response.data;
  },

  // Delete todo
  delete: async (id: number): Promise<void> => {
    await api.delete(`/todos/${id}`);
  },

  // Get todo statistics
  getStats: async (): Promise<TodoStats> => {
    const response = await api.get<TodoStats>('/todos/stats');
    return response.data;
  },
};

export const categoryApi = {
  // Get all categories
  getAll: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },

  // Get category by id
  getById: async (id: number): Promise<Category> => {
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data;
  },

  // Create new category
  create: async (data: CreateCategoryData): Promise<Category> => {
    const response = await api.post<Category>('/categories', data);
    return response.data;
  },

  // Update category
  update: async (id: number, data: UpdateCategoryData): Promise<Category> => {
    const response = await api.patch<Category>(`/categories/${id}`, data);
    return response.data;
  },

  // Delete category
  delete: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },

  // Get category statistics
  getStats: async (): Promise<{ totalCategories: number; categoriesWithTodos: number }> => {
    const response = await api.get<{ totalCategories: number; categoriesWithTodos: number }>('/categories/stats');
    return response.data;
  },
};

export default api;
