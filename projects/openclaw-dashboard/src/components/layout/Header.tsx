/**
 * 未来科技感顶部导航栏 - 真实数据版
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { SearchPanel } from '../search/SearchPanel';
import { SearchResult } from '../../services/search';

// API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// 通知类型
interface Notification {
  id: string;
  type: string;
  title: string;
  message?: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

export function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);

  // 更新时间
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 加载通知
  const loadNotifications = async () => {
    try {
      const response = await fetch(`${API_URL}/notifications?limit=10`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error('[Header] 加载通知失败:', error);
    }
  };

  // 初始加载
  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // 点击外部关闭通知面板
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 全局快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === 'Escape') {
        setShowSearch(false);
        setShowNotifications(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 搜索选择处理
  const handleSearchSelect = useCallback((result: SearchResult) => {
    if (result.path) {
      window.location.href = result.path;
    }
  }, []);

  // 标记所有为已读
  const markAllAsRead = async () => {
    try {
      await fetch(`${API_URL}/notifications/read-all`, { method: 'POST' });
      loadNotifications();
    } catch (error) {
      console.error('[Header] 标记已读失败:', error);
    }
  };

  // 通知图标映射
  const notificationIcons: Record<string, string> = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  };

  return (
    <>
      <header className="h-16 bg-[#0a0a1a]/90 backdrop-blur-2xl border-b border-cyan-500/20 flex items-center justify-between px-6 relative overflow-visible">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />
        
        {/* 左侧：搜索 */}
        <div className="flex items-center gap-6 relative z-10">
          <button
            onClick={() => setShowSearch(true)}
            className="relative group flex items-center gap-3 w-72 h-10 px-4 bg-[#0a0a1a]/80 border border-cyan-500/20 rounded-xl hover:border-cyan-400/50 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4 text-cyan-400/50 group-hover:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-sm text-white/30 group-hover:text-white/50">搜索... (Ctrl+K)</span>
          </button>
        </div>

        {/* 中间：标题 */}
        <div className="absolute left-1/2 -translate-x-1/2 text-center">
          <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent tracking-wide">
            OPENCLAW DASHBOARD
          </h1>
        </div>

        {/* 右侧：操作 */}
        <div className="flex items-center gap-4 relative z-10">
          {/* 时间 */}
          <div className="text-sm font-mono text-cyan-400/80 tabular-nums">
            {currentTime.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>

          {/* 分隔线 */}
          <div className="w-px h-8 bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent" />

          {/* 通知 */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowNotifications(!showNotifications);
              }}
              className="relative w-10 h-10 rounded-xl bg-[#0a0a1a]/80 border border-cyan-500/20 flex items-center justify-center hover:border-cyan-400/50 transition-all group"
            >
              <span className="text-lg group-hover:scale-110 transition-transform">🔔</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full text-xs text-white flex items-center justify-center font-bold animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* 通知下拉面板 */}
            {showNotifications && (
              <div 
                className="absolute top-12 right-0 w-80 bg-[#0a0a1a]/95 backdrop-blur-xl border border-cyan-500/20 rounded-xl shadow-2xl overflow-hidden z-[9999]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* 头部 */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                  <span className="text-white font-medium">通知</span>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="text-xs text-cyan-400 hover:text-cyan-300"
                    >
                      全部已读
                    </button>
                  )}
                </div>

                {/* 通知列表 */}
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                      <span className="text-2xl mb-2">📭</span>
                      <span className="text-sm">暂无通知</span>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`flex items-start gap-3 px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${!notif.read ? 'bg-cyan-500/5' : ''}`}
                      >
                        <span className="text-lg">{notificationIcons[notif.type] || '🔔'}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white">{notif.title}</p>
                          {notif.message && (
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{notif.message}</p>
                          )}
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(notif.createdAt).toLocaleString('zh-CN')}
                          </p>
                        </div>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1" />
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* 底部 */}
                <div className="px-4 py-2 bg-slate-800/50 text-xs text-slate-500 text-center">
                  实时通知 · {notifications.length} 条
                </div>
              </div>
            )}
          </div>

          {/* 设置 */}
          <button 
            onClick={() => window.location.href = '/settings'}
            className="w-10 h-10 rounded-xl bg-[#0a0a1a]/80 border border-cyan-500/20 flex items-center justify-center hover:border-cyan-400/50 transition-all group"
          >
            <span className="text-lg group-hover:scale-110 transition-transform duration-300">🦞</span>
          </button>

          {/* 用户 */}
          <div className="flex items-center gap-3 pl-3 border-l border-cyan-500/20">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center text-sm">
              👤
            </div>
          </div>
        </div>
      </header>

      {/* 全局搜索面板 */}
      <SearchPanel
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        onSelect={handleSearchSelect}
      />
    </>
  );
}