/**
 * 认证状态管理
 * 
 * @description 用户登录状态、Token 管理
 * @author daod-team
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoginRequest, LoginResponse } from '@/types';
import { authApi } from '@/services/auth';

interface AuthState {
  // 状态
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  
  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  refreshAccessToken: () => Promise<void>;
  setUser: (user: User) => void;
  setToken: (token: string, refreshToken?: string) => void;
  
  // Getters
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      loading: false,
      
      // 登录
      login: async (credentials: LoginRequest) => {
        set({ loading: true });
        try {
          const response: LoginResponse = await authApi.login(credentials.email, credentials.password);
          set({
            user: response.user,
            token: response.token,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            loading: false,
          });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },
      
      // 登出
      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },
      
      // 更新用户信息
      updateUser: (userData: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...userData } });
        }
      },
      
      // 刷新 Token
      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          throw new Error('No refresh token');
        }
        
        try {
          const response = await authApi.refreshToken(refreshToken);
          set({
            token: response.token,
            refreshToken: response.refreshToken,
          });
        } catch (error) {
          // 刷新失败，清空状态
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
          });
          throw error;
        }
      },
      
      // 设置用户
      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },
      
      // 设置 Token
      setToken: (token: string, refreshToken?: string) => {
        set({ 
          token,
          ...(refreshToken && { refreshToken }),
        });
      },
      
      // 检查权限
      hasPermission: (permission: string): boolean => {
        const { user } = get();
        if (!user) return false;
        
        // 超级管理员拥有所有权限
        if (user.role === 'admin' || user.role === 'super_admin') {
          return true;
        }
        
        const permissions = user.permissions || [];
        return permissions.includes('ALL') || permissions.includes(permission);
      },
      
      // 检查角色
      hasRole: (role: string): boolean => {
        const { user } = get();
        if (!user) return false;
        return user.role === role;
      },
    }),
    {
      name: 'iov-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);