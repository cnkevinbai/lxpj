import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Theme = 'dark' | 'light' | 'system';
export type Language = 'zh-CN' | 'en-US';

export interface Settings {
  theme: Theme;
  language: Language;
  notifications: {
    enabled: boolean;
    email: boolean;
    desktop: boolean;
    sound: boolean;
  };
  apiKey: string;
  autoSave: boolean;
  showRealtimeLogs: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  theme: 'dark',
  language: 'zh-CN',
  notifications: {
    enabled: true,
    email: true,
    desktop: true,
    sound: false,
  },
  apiKey: '',
  autoSave: true,
  showRealtimeLogs: true,
};

// API 基础 URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface SettingsState {
  settings: Settings;
  loading: boolean;
  saved: boolean;
  
  // Actions
  setSettings: (settings: Partial<Settings>) => void;
  setLoading: (loading: boolean) => void;
  setSaved: (saved: boolean) => void;
  resetToDefault: () => void;
  loadSettings: () => Promise<void>;
  saveSettings: () => Promise<void>;
  updateNotification: (key: keyof Settings['notifications'], value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,
      loading: false,
      saved: true,

      setSettings: (settings) =>
        set((state) => ({
          settings: { ...state.settings, ...settings },
          saved: false,
        })),

      setLoading: (loading) => set({ loading }),
      setSaved: (saved) => set({ saved }),

      resetToDefault: () => set({ settings: DEFAULT_SETTINGS, saved: false }),

      loadSettings: async () => {
        set({ loading: true });
        try {
          // 从后端 API 加载设置
          const response = await fetch(`${API_URL}/settings`);
          if (response.ok) {
            const data = await response.json();
            set({ 
              settings: {
                theme: data.theme || 'dark',
                language: data.language || 'zh-CN',
                notifications: {
                  enabled: data.notifications?.enabled ?? true,
                  email: data.notifications?.email ?? true,
                  desktop: true,
                  sound: data.notifications?.sound ?? false,
                },
                apiKey: '',
                autoSave: true,
                showRealtimeLogs: true,
              },
              loading: false 
            });
          } else {
            // 如果 API 失败，使用本地存储
            set({ loading: false });
          }
        } catch (error) {
          console.error('Failed to load settings:', error);
          set({ loading: false });
        }
      },

      saveSettings: async () => {
        set({ loading: true });
        try {
          // 保存到后端 API
          const { settings } = get();
          const response = await fetch(`${API_URL}/settings`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              theme: settings.theme,
              language: settings.language,
              notifications: settings.notifications,
            }),
          });
          
          if (response.ok) {
            set({ loading: false, saved: true });
          } else {
            console.error('Failed to save settings to backend');
            set({ loading: false, saved: true }); // 本地已保存
          }
        } catch (error) {
          console.error('Failed to save settings:', error);
          set({ loading: false, saved: true }); // 本地已保存
        }
      },

      updateNotification: (key, value) =>
        set((state) => ({
          settings: {
            ...state.settings,
            notifications: {
              ...state.settings.notifications,
              [key]: value,
            },
          },
          saved: false,
        })),
    }),
    {
      name: 'openclaw-settings',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);

// Theme Manager Helper
export const themeManager = {
  applyTheme: (theme: Theme) => {
    const root = window.document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('dark', 'light', 'system');
    
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(isDark ? 'dark' : 'light');
    } else {
      root.classList.add(theme);
    }
  },

  getThemeLabel: (theme: Theme): string => {
    switch (theme) {
      case 'dark':
        return '暗色主题';
      case 'light':
        return '亮色主题';
      case 'system':
        return '跟随系统';
      default:
        return theme;
    }
  },

  getLanguageLabel: (lang: Language): string => {
    switch (lang) {
      case 'zh-CN':
        return '简体中文';
      case 'en-US':
        return 'English';
      default:
        return lang;
    }
  },
};

// Initialize theme on mount
if (typeof window !== 'undefined') {
  const savedSettings = localStorage.getItem('openclaw-settings');
  if (savedSettings) {
    try {
      const { settings } = JSON.parse(savedSettings);
      if (settings?.theme) {
        themeManager.applyTheme(settings.theme);
      }
    } catch (e) {
      // Ignore parse errors
    }
  }
}
