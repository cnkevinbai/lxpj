/**
 * 通知 Hook
 * 
 * @description 桌面通知和声音提示
 * @author daod-team
 */

import { useCallback, useEffect, useRef } from 'react';
import { notification } from 'antd';
import { useSettingsStore } from '@/stores';

interface UseNotificationOptions {
  enabled?: boolean;
  sound?: boolean;
}

/**
 * 通知 Hook
 */
export function useNotification(options: UseNotificationOptions = {}) {
  const { enabled = true, sound = true } = options;
  
  const settings = useSettingsStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 初始化音频
  useEffect(() => {
    if (sound) {
      audioRef.current = new Audio('/notification.mp3');
    }
    return () => {
      if (audioRef.current) {
        audioRef.current = null;
      }
    };
  }, [sound]);

  // 播放声音
  const playSound = useCallback(() => {
    if (sound && settings.notificationSound && audioRef.current) {
      audioRef.current.play().catch(() => {
        // 忽略播放失败
      });
    }
  }, [sound, settings.notificationSound]);

  // 显示通知
  const showNotification = useCallback(({
    title,
    message: msg,
    type = 'info',
    duration = 4.5,
    onClick,
  }: {
    title: string;
    message: string;
    type?: 'success' | 'info' | 'warning' | 'error';
    duration?: number;
    onClick?: () => void;
  }) => {
    if (!enabled || !settings.notificationEnabled) return;

    // Ant Design 通知
    notification[type]({
      message: title,
      description: msg,
      duration,
      onClick,
    });

    // 播放声音
    playSound();

    // 浏览器桌面通知
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: msg,
        icon: '/favicon.ico',
      });
    }
  }, [enabled, settings.notificationEnabled, playSound]);

  // 请求通知权限
  const requestPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }, []);

  // 成功通知
  const success = useCallback((title: string, message: string) => {
    showNotification({ title, message, type: 'success' });
  }, [showNotification]);

  // 警告通知
  const warning = useCallback((title: string, message: string) => {
    showNotification({ title, message, type: 'warning' });
  }, [showNotification]);

  // 错误通知
  const error = useCallback((title: string, message: string) => {
    showNotification({ title, message, type: 'error' });
  }, [showNotification]);

  // 信息通知
  const info = useCallback((title: string, message: string) => {
    showNotification({ title, message, type: 'info' });
  }, [showNotification]);

  return {
    showNotification,
    requestPermission,
    success,
    warning,
    error,
    info,
  };
}