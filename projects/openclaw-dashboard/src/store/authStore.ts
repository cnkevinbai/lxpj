import { create } from 'zustand';
import { apiClient } from '../config/api-client';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: string;
  permissions?: string[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // 模拟登录 API 调用
      // 实际应调用: POST /api/auth/login
      const response = await apiClient.post('/auth/login', { email, password });
      
      const { token, user } = response.data || response;
      
      // 存储 token
      if (token) {
        localStorage.setItem('token', token);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      // 更新状态
      set({
        user: user || {
          id: 'user-1',
          email,
          name: email.split('@')[0],
          role: 'admin',
          permissions: ['read', 'write', 'delete'],
        },
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || '登录失败，请检查您的凭证';
      set({ 
        isLoading: false, 
        error: errorMessage,
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    delete apiClient.defaults.headers.common['Authorization'];
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false,
      error: null,
    });
  },

  refreshToken: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      // 实际应调用: POST /api/auth/refresh
      const response = await apiClient.post('/auth/refresh', { token });
      
      const newToken = response.data?.token;
      
      if (newToken) {
        localStorage.setItem('token', newToken);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        set({ token: newToken });
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      get().logout();
    }
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },
}));

// 初始化认证状态
export const initializeAuth = async () => {
  const token = localStorage.getItem('token');
  
  if (token) {
    try {
      // 检查 token 是否过期
      if (isTokenExpired(token)) {
        // Token 过期，清除状态
        useAuthStore.getState().logout();
        return;
      }
      
      // 设置 token 到 API 客户端
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // 设置已认证状态
      useAuthStore.setState({
        token,
        isAuthenticated: true,
        user: {
          id: 'user-1',
          email: 'admin@openclaw.ai',
          name: 'Admin',
          role: 'admin',
          permissions: ['read', 'write', 'delete'],
        },
      });
      
      console.log('[Auth] Token validated, user authenticated');
    } catch (error) {
      console.error('[Auth] Token validation failed:', error);
      useAuthStore.getState().logout();
    }
  } else {
    // 没有 token，确保未认证状态
    useAuthStore.setState({
      isAuthenticated: false,
      user: null,
      token: null,
    });
  }
};

// 检查 token 是否过期
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000;
    return Date.now() > expiry;
  } catch {
    return true;
  }
};

// 自动刷新 token 的定时器
let tokenRefreshTimer: ReturnType<typeof setTimeout> | null = null;

export const startTokenRefreshTimer = () => {
  stopTokenRefreshTimer();
  
  const checkAndRefresh = async () => {
    const state = useAuthStore.getState();
    if (state.token && !isTokenExpired(state.token)) {
      // 计算剩余时间，在 token 过期前 5 分钟刷新
      try {
        const payload = JSON.parse(atob(state.token.split('.')[1]));
        const expiry = payload.exp * 1000;
        const timeUntilRefresh = expiry - Date.now() - 5 * 60 * 1000; // 5 分钟前刷新
        
        if (timeUntilRefresh > 0 && timeUntilRefresh < 24 * 60 * 60 * 1000) { // 最多 24 小时
          tokenRefreshTimer = setTimeout(async () => {
            await state.refreshToken();
          }, timeUntilRefresh);
        }
      } catch {
        // Token invalid, logout
        state.logout();
      }
    }
  };
  
  checkAndRefresh();
};

export const stopTokenRefreshTimer = () => {
  if (tokenRefreshTimer) {
    clearTimeout(tokenRefreshTimer);
    tokenRefreshTimer = null;
  }
};
