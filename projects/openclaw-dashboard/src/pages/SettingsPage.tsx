/**
 * Settings Page - System Configuration
 * Features:
 * - Theme switching (Dark / Light / System)
 * - Language switching (Chinese / English)
 * - Notification settings
 * - API key configuration
 * - Save button with success notification
 * - Reset to default
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSettingsStore, Settings } from '../store/settingsStore';
import { ToastContainer, toast } from 'react-toastify';

export function SettingsPage() {
  const { settings, loading, saved, setSettings, resetToDefault, saveSettings, loadSettings } =
    useSettingsStore();
  const [activeTab, setActiveTab] = useState<'general' | 'api' | 'notifications' | 'security'>('general');
  const [showNotification, setShowNotification] = useState<'none' | 'success'>('none');

  // Save notification timer
  useEffect(() => {
    if (!saved && showNotification === 'none') {
      const timer = setTimeout(() => {
        setShowNotification('success');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [saved, showNotification]);

  const handleSave = async () => {
    await saveSettings();
    setShowNotification('success');
    toast.success('设置已保存');
  };

  const handleReset = () => {
    resetToDefault();
    toast.info('已重置为默认设置');
  };

  const handleNotificationChange = (key: keyof Settings['notifications'], value: boolean) => {
    setSettings({ notifications: { ...settings.notifications, [key]: value } as any });
  };

  const themeOptions = [
    { value: 'dark', label: '暗色主题', icon: '🌙' },
    { value: 'light', label: '亮色主题', icon: '☀️' },
    { value: 'system', label: '跟随系统', icon: '💻' },
  ];

  const languageOptions = [
    { value: 'zh-CN', label: '简体中文', icon: '🇨🇳' },
    { value: 'en-US', label: 'English', icon: '🇺🇸' },
  ];

  return (
    <div className="space-y-6 h-full">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-dark-text">系统设置</h2>
        <p className="text-dark-text-secondary">系统配置和用户偏好</p>
      </div>

      {/* Settings Tabs */}
      <div className="border-b border-dark-border">
        <nav className="flex space-x-1">
          {[
            { id: 'general', label: '常规设置' },
            { id: 'notifications', label: '通知设置' },
            { id: 'api', label: 'API 设置' },
            { id: 'security', label: '安全设置' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-dark-text-secondary hover:text-dark-text hover:border-dark-border/50 border-b-2 border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0 overflow-auto">
        {/* General Settings */}
        {activeTab === 'general' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Theme Settings */}
            <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
              <h3 className="font-medium text-dark-text mb-4 flex items-center gap-2">
                <span className="text-xl">🎨</span> 主题设置
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {themeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSettings({ theme: option.value as any })}
                    className={`p-4 rounded-lg border flex items-center justify-between transition-all ${
                      settings.theme === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-dark-border hover:border-primary/50 hover:bg-dark-hover'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{option.icon}</span>
                      <span className="text-dark-text">{option.label}</span>
                    </div>
                    {settings.theme === option.value && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Language Settings */}
            <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
              <h3 className="font-medium text-dark-text mb-4 flex items-center gap-2">
                <span className="text-xl">🌐</span> 语言设置
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {languageOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSettings({ language: option.value as any })}
                    className={`p-4 rounded-lg border flex items-center justify-between transition-all ${
                      settings.language === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-dark-border hover:border-primary/50 hover:bg-dark-hover'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{option.icon}</span>
                      <span className="text-dark-text">{option.label}</span>
                    </div>
                    {settings.language === option.value && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Other Settings */}
            <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
              <h3 className="font-medium text-dark-text mb-4 flex items-center gap-2">
                <span className="text-xl">⚙️</span> 其他设置
              </h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-3 rounded-lg bg-dark-hover hover:bg-dark-text-secondary/5 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center text-success">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-dark-text font-medium">自动保存对话历史</p>
                      <p className="text-xs text-dark-text-secondary">自动保存聊天记录到本地存储</p>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={settings.autoSave}
                      onChange={(e) => setSettings({ autoSave: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-dark-border rounded-full peer-after:content-[''] peer-after:absolute peer-after:left-[2px] peer-after:top-[2px] peer-after:w-5 peer-after:h-5 peer-after:bg-dark-text-secondary peer-after:rounded-full peer-checked:bg-primary peer-checked:peer-after:translate-x-5 transition-all"></div>
                  </div>
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg bg-dark-hover hover:bg-dark-text-secondary/5 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center text-info">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-dark-text font-medium">启用实时日志通知</p>
                      <p className="text-xs text-dark-text-secondary">实时显示系统运行日志</p>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={settings.showRealtimeLogs}
                      onChange={(e) => setSettings({ showRealtimeLogs: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-dark-border rounded-full peer-after:content-[''] peer-after:absolute peer-after:left-[2px] peer-after:top-[2px] peer-after:w-5 peer-after:h-5 peer-after:bg-dark-text-secondary peer-after:rounded-full peer-checked:bg-primary peer-checked:peer-after:translate-x-5 transition-all"></div>
                  </div>
                </label>
              </div>
            </div>
          </motion.div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
              <h3 className="font-medium text-dark-text mb-4 flex items-center gap-2">
                <span className="text-xl">🔔</span> 通知设置
              </h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 rounded-lg bg-dark-hover hover:bg-dark-text-secondary/5 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center text-warning">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-dark-text font-medium">启用通知</p>
                      <p className="text-xs text-dark-text-secondary">接收系统通知和提醒</p>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={settings.notifications.enabled}
                      onChange={(e) => handleNotificationChange('enabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-dark-border rounded-full peer-after:content-[''] peer-after:absolute peer-after:left-[2px] peer-after:top-[2px] peer-after:w-5 peer-after:h-5 peer-after:bg-dark-text-secondary peer-after:rounded-full peer-checked:bg-primary peer-checked:peer-after:translate-x-5 transition-all"></div>
                  </div>
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg bg-dark-hover hover:bg-dark-text-secondary/5 transition-colors cursor-pointer disabled opacity-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue/10 flex items-center justify-center text-blue">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-dark-text font-medium">邮件通知</p>
                      <p className="text-xs text-dark-text-secondary">通过邮件接收重要通知</p>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={settings.notifications.email && settings.notifications.enabled}
                      onChange={(e) => handleNotificationChange('email', e.target.checked)}
                      disabled={!settings.notifications.enabled}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-dark-border rounded-full peer-after:content-[''] peer-after:absolute peer-after:left-[2px] peer-after:top-[2px] peer-after:w-5 peer-after:h-5 peer-after:bg-dark-text-secondary peer-after:rounded-full peer-checked:bg-primary peer-checked:peer-after:translate-x-5 transition-all"></div>
                  </div>
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg bg-dark-hover hover:bg-dark-text-secondary/5 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple/10 flex items-center justify-center text-purple">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-dark-text font-medium">桌面通知</p>
                      <p className="text-xs text-dark-text-secondary">在桌面显示系统通知</p>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={settings.notifications.desktop && settings.notifications.enabled}
                      onChange={(e) => handleNotificationChange('desktop', e.target.checked)}
                      disabled={!settings.notifications.enabled}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-dark-border rounded-full peer-after:content-[''] peer-after:absolute peer-after:left-[2px] peer-after:top-[2px] peer-after:w-5 peer-after:h-5 peer-after:bg-dark-text-secondary peer-after:rounded-full peer-checked:bg-primary peer-checked:peer-after:translate-x-5 transition-all"></div>
                  </div>
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg bg-dark-hover hover:bg-dark-text-secondary/5 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green/10 flex items-center justify-center text-green">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-dark-text font-medium">通知声音</p>
                      <p className="text-xs text-dark-text-secondary">播放声音提示新通知</p>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={settings.notifications.sound && settings.notifications.enabled}
                      onChange={(e) => handleNotificationChange('sound', e.target.checked)}
                      disabled={!settings.notifications.enabled}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-dark-border rounded-full peer-after:content-[''] peer-after:absolute peer-after:left-[2px] peer-after:top-[2px] peer-after:w-5 peer-after:h-5 peer-after:bg-dark-text-secondary peer-after:rounded-full peer-checked:bg-primary peer-checked:peer-after:translate-x-5 transition-all"></div>
                  </div>
                </label>
              </div>
            </div>
          </motion.div>
        )}

        {/* API Settings */}
        {activeTab === 'api' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
              <h3 className="font-medium text-dark-text mb-4 flex items-center gap-2">
                <span className="text-xl">🔌</span> API 设置
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">API 端点</label>
                  <div className="relative">
                    <input
                      type="text"
                      value="http://localhost:18789/api/v1"
                      readOnly
                      className="w-full max-w-lg bg-dark-hover/50 border border-dark-border rounded-lg px-4 py-2.5 text-dark-text/70 cursor-not-allowed"
                    />
                    <div className="absolute right-3 top-2.5 text-success flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      <span className="text-xs font-medium">已连接</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">WebSocket 端点</label>
                  <div className="relative">
                    <input
                      type="text"
                      value="ws://localhost:18789/ws"
                      readOnly
                      className="w-full max-w-lg bg-dark-hover/50 border border-dark-border rounded-lg px-4 py-2.5 text-dark-text/70 cursor-not-allowed"
                    />
                    <div className="absolute right-3 top-2.5 text-success flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      <span className="text-xs font-medium">已连接</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">API 密钥</label>
                  <div className="flex gap-3">
                    <input
                      type="password"
                      value={settings.apiKey}
                      onChange={(e) => setSettings({ apiKey: e.target.value })}
                      placeholder="输入 API 密钥"
                      className="flex-1 bg-dark-hover border border-dark-border rounded-lg px-4 py-2.5 text-dark-text focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
                    />
                    <button
                      onClick={() => toast.info('API 密钥已保存')}
                      className="px-4 py-2.5 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 rounded-lg font-medium transition-colors"
                    >
                      保存
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-dark-text-secondary">
                    API 密钥用于认证 API 请求。请妥善保管您的密钥。
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
              <h3 className="font-medium text-dark-text mb-4 flex items-center gap-2">
                <span className="text-xl">🛡️</span> 安全设置
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-danger/5 border border-danger/10">
                  <div className="w-8 h-8 rounded-full bg-danger/10 flex items-center justify-center text-danger shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-dark-text mb-1">退出登录</h4>
                    <p className="text-sm text-dark-text-secondary mb-3">
                      安全退出当前会话并返回登录页面
                    </p>
                    <button
                      onClick={() => toast.success('退出登录功能开发中')}
                      className="px-4 py-2 bg-danger/10 text-danger hover:bg-danger/20 rounded-lg font-medium transition-colors text-sm"
                    >
                      退出登录
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-warning/5 border border-warning/10">
                  <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center text-warning shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-dark-text mb-1">重置为默认设置</h4>
                    <p className="text-sm text-dark-text-secondary mb-3">
                      将所有设置恢复为默认值，无法撤销
                    </p>
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 bg-warning/10 text-warning hover:bg-warning/20 rounded-lg font-medium transition-colors text-sm"
                    >
                      重置设置
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-dark-border">
        <div className="flex items-center gap-2">
          {!saved && (
            <span className="text-sm text-warning flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
              有未保存的更改
            </span>
          )}
          {saved && showNotification === 'success' && (
            <span className="text-sm text-success flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              设置已保存
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="px-5 py-2.5 text-dark-text-secondary hover:text-dark-text hover:bg-dark-hover rounded-lg font-medium transition-colors"
          >
            重置为默认
          </button>
          <button
            onClick={handleSave}
            disabled={loading || saved}
            className={`px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              loading || saved
                ? 'bg-primary/50 text-white cursor-not-allowed'
                : 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20'
            }`}
          >
            {loading ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                保存中...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                保存设置
              </>
            )}
          </button>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
        className="z-50"
      />
    </div>
  );
}

export default SettingsPage;
