/**
 * 通知提供者 - 全局通知管理
 * 
 * 支持：
 * - Toast 通知
 * - 实时推送通知
 * - WebSocket 事件通知
 */

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  createdAt: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (type: NotificationType, title: string, message?: string, duration?: number) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  // 便捷方法
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
  maxNotifications?: number;
}

export function NotificationProvider({
  children,
  maxNotifications = 5,
}: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (type: NotificationType, title: string, message?: string, duration: number = 5000) => {
      const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const notification: Notification = {
        id,
        type,
        title,
        message,
        duration,
        createdAt: new Date(),
      };

      setNotifications((prev) => {
        const updated = [notification, ...prev];
        return updated.slice(0, maxNotifications);
      });

      // 自动移除
      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }
    },
    [maxNotifications]
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // 便捷方法
  const success = useCallback(
    (title: string, message?: string) => addNotification('success', title, message),
    [addNotification]
  );

  const error = useCallback(
    (title: string, message?: string) => addNotification('error', title, message, 8000),
    [addNotification]
  );

  const warning = useCallback(
    (title: string, message?: string) => addNotification('warning', title, message, 6000),
    [addNotification]
  );

  const info = useCallback(
    (title: string, message?: string) => addNotification('info', title, message),
    [addNotification]
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearNotifications,
        success,
        error,
        warning,
        info,
      }}
    >
      {children}
      {/* 渲染通知组件 */}
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
    </NotificationContext.Provider>
  );
}

// 通知容器组件
function NotificationContainer({
  notifications,
  onRemove,
}: {
  notifications: Notification[];
  onRemove: (id: string) => void;
}) {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

// 单个通知组件
function NotificationItem({
  notification,
  onRemove,
}: {
  notification: Notification;
  onRemove: (id: string) => void;
}) {
  const icons: Record<NotificationType, string> = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  const colors: Record<NotificationType, string> = {
    success: 'bg-green-500/20 border-green-500/50',
    error: 'bg-red-500/20 border-red-500/50',
    warning: 'bg-yellow-500/20 border-yellow-500/50',
    info: 'bg-blue-500/20 border-blue-500/50',
  };

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm
        animate-slide-in-right max-w-sm shadow-lg
        ${colors[notification.type]}
      `}
      style={{ background: 'rgba(15, 23, 42, 0.95)' }}
    >
      <span className="text-lg">{icons[notification.type]}</span>
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium">{notification.title}</p>
        {notification.message && (
          <p className="text-slate-400 text-sm mt-1">{notification.message}</p>
        )}
      </div>
      <button
        onClick={() => onRemove(notification.id)}
        className="text-slate-400 hover:text-white transition-colors"
      >
        ✕
      </button>
    </div>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}

export default NotificationProvider;