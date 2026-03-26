/**
 * UI Store - 管理 UI 状态
 * 
 * 处理全局 UI 状态：主题、侧边栏、打字状态、通知等
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 通知类型
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  createdAt: Date;
}

// UI 状态
interface UIState {
  // 主题
  theme: 'dark' | 'light' | 'system';
  
  // 侧边栏
  sidebarCollapsed: boolean;
  sidebarWidth: number;
  
  // 打字状态
  isTyping: boolean;
  typingAgentId: string | null;
  
  // 通知
  notifications: Notification[];
  maxNotifications: number;
  
  // 模态框
  activeModal: string | null;
  modalData: any;
  
  // 全局加载
  globalLoading: boolean;
  globalLoadingText: string;
  
  // 面包屑
  breadcrumbs: Array<{ label: string; path?: string }>;
  
  // 搜索
  searchOpen: boolean;
  searchQuery: string;
  
  // Actions
  setTheme: (theme: UIState['theme']) => void;
  toggleSidebar: () => void;
  setSidebarWidth: (width: number) => void;
  setIsTyping: (isTyping: boolean, agentId?: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  openModal: (modalId: string, data?: any) => void;
  closeModal: () => void;
  setGlobalLoading: (loading: boolean, text?: string) => void;
  setBreadcrumbs: (breadcrumbs: UIState['breadcrumbs']) => void;
  setSearchOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  
  // 便捷通知方法
  notifySuccess: (title: string, message?: string) => void;
  notifyError: (title: string, message?: string) => void;
  notifyWarning: (title: string, message?: string) => void;
  notifyInfo: (title: string, message?: string) => void;
}

// 生成唯一 ID
function generateId(): string {
  return `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      sidebarCollapsed: false,
      sidebarWidth: 280,
      isTyping: false,
      typingAgentId: null,
      notifications: [],
      maxNotifications: 5,
      activeModal: null,
      modalData: null,
      globalLoading: false,
      globalLoadingText: '',
      breadcrumbs: [],
      searchOpen: false,
      searchQuery: '',

      setTheme: (theme) => {
        set({ theme });
        // 应用主题到 DOM
        const root = document.documentElement;
        if (theme === 'dark') {
          root.classList.add('dark');
          root.classList.remove('light');
        } else if (theme === 'light') {
          root.classList.add('light');
          root.classList.remove('dark');
        }
        console.log(`[UIStore] 主题切换为: ${theme}`);
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },

      setSidebarWidth: (width) => {
        set({ sidebarWidth: Math.max(200, Math.min(400, width)) });
      },

      setIsTyping: (isTyping, agentId) => {
        set({ 
          isTyping, 
          typingAgentId: agentId || null 
        });
      },

      addNotification: (notification) => {
        const newNotif: Notification = {
          ...notification,
          id: generateId(),
          createdAt: new Date(),
        };

        set((state) => {
          const notifications = [newNotif, ...state.notifications];
          // 限制最大数量
          if (notifications.length > state.maxNotifications) {
            notifications.pop();
          }
          return { notifications };
        });

        // 自动移除
        const duration = notification.duration || 5000;
        if (duration > 0) {
          setTimeout(() => {
            get().removeNotification(newNotif.id);
          }, duration);
        }
      },

      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id),
        }));
      },

      clearNotifications: () => {
        set({ notifications: [] });
      },

      openModal: (modalId, data) => {
        set({ activeModal: modalId, modalData: data || null });
      },

      closeModal: () => {
        set({ activeModal: null, modalData: null });
      },

      setGlobalLoading: (loading, text) => {
        set({ 
          globalLoading: loading, 
          globalLoadingText: text || '' 
        });
      },

      setBreadcrumbs: (breadcrumbs) => {
        set({ breadcrumbs });
      },

      setSearchOpen: (open) => {
        set({ searchOpen: open });
        if (!open) {
          set({ searchQuery: '' });
        }
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },

      // 便捷方法
      notifySuccess: (title, message) => {
        get().addNotification({ type: 'success', title, message });
      },

      notifyError: (title, message) => {
        get().addNotification({ type: 'error', title, message, duration: 8000 });
      },

      notifyWarning: (title, message) => {
        get().addNotification({ type: 'warning', title, message, duration: 6000 });
      },

      notifyInfo: (title, message) => {
        get().addNotification({ type: 'info', title, message });
      },
    }),
    {
      name: 'ui-store',
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        sidebarWidth: state.sidebarWidth,
      }),
    }
  )
);

export default useUIStore;