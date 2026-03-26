/**
 * 设置状态管理
 * 
 * @description 用户设置、主题、偏好
 * @author daod-team
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeMode = 'light' | 'dark' | 'auto';
type Language = 'zh-CN' | 'en-US';

interface SettingsState {
  // 主题
  theme: ThemeMode;
  
  // 语言
  language: Language;
  
  // 侧边栏
  sidebarCollapsed: boolean;
  
  // 通知
  notificationEnabled: boolean;
  notificationSound: boolean;
  
  // 地图设置
  mapTileLayer: string;
  mapShowTraffic: boolean;
  mapClusterMarkers: boolean;
  
  // 表格设置
  tablePageSize: number;
  tableShowPagination: boolean;
  
  // Actions
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (language: Language) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setNotificationEnabled: (enabled: boolean) => void;
  setNotificationSound: (enabled: boolean) => void;
  setMapTileLayer: (layer: string) => void;
  setMapShowTraffic: (show: boolean) => void;
  setMapClusterMarkers: (cluster: boolean) => void;
  setTablePageSize: (size: number) => void;
  resetSettings: () => void;
}

const defaultSettings = {
  theme: 'light' as ThemeMode,
  language: 'zh-CN' as Language,
  sidebarCollapsed: false,
  notificationEnabled: true,
  notificationSound: true,
  mapTileLayer: 'openstreetmap',
  mapShowTraffic: false,
  mapClusterMarkers: true,
  tablePageSize: 20,
  tableShowPagination: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // 初始状态
      ...defaultSettings,
      
      // 设置主题
      setTheme: (theme: ThemeMode) => {
        set({ theme });
        
        // 应用主题到 DOM
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else if (theme === 'light') {
          document.documentElement.classList.remove('dark');
        } else {
          // 自动模式，跟随系统
          const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (isDark) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },
      
      // 设置语言
      setLanguage: (language: Language) => {
        set({ language });
      },
      
      // 切换侧边栏
      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },
      
      // 设置侧边栏状态
      setSidebarCollapsed: (collapsed: boolean) => {
        set({ sidebarCollapsed: collapsed });
      },
      
      // 设置通知开关
      setNotificationEnabled: (enabled: boolean) => {
        set({ notificationEnabled: enabled });
      },
      
      // 设置通知声音
      setNotificationSound: (enabled: boolean) => {
        set({ notificationSound: enabled });
      },
      
      // 设置地图图层
      setMapTileLayer: (layer: string) => {
        set({ mapTileLayer: layer });
      },
      
      // 设置显示路况
      setMapShowTraffic: (show: boolean) => {
        set({ mapShowTraffic: show });
      },
      
      // 设置标记聚类
      setMapClusterMarkers: (cluster: boolean) => {
        set({ mapClusterMarkers: cluster });
      },
      
      // 设置表格页面大小
      setTablePageSize: (size: number) => {
        set({ tablePageSize: size });
      },
      
      // 重置设置
      resetSettings: () => {
        set(defaultSettings);
      },
    }),
    {
      name: 'iov-settings-storage',
    }
  )
);