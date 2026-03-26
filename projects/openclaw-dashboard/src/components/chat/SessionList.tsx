/**
 * 会话列表组件 - 显示历史会话
 */

import { useState, useEffect } from 'react';
import { sessionApi, Session } from '../../services/chat-api';

interface SessionListProps {
  currentSessionId: string | null;
  sessions: Session[];  // 从父组件接收 sessions
  onSelectSession: (session: Session) => void;
  onNewSession: () => void;
}

export function SessionList({ currentSessionId, sessions, onSelectSession, onNewSession }: SessionListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // 过滤会话
  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 删除会话（通知父组件）
  const handleDelete = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    try {
      await sessionApi.deleteSession(sessionId);
      // 删除成功后通知父组件刷新（通过选择其他会话或触发更新）
      window.location.reload();  // 简单处理：刷新页面
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  // 格式化时间
  const formatTime = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return '昨天';
    } else if (days < 7) {
      return `${days}天前`;
    } else {
      return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    }
  };

  // 新会话按钮点击
  const handleNewSession = () => {
    console.log('[SessionList] handleNewSession called');
    onNewSession();
  };

  return (
    <div className="flex flex-col h-full" style={{ background: '#0F172A' }}>
      {/* 头部 */}
      <div className="p-4 border-b border-white/5">
        <button
          onClick={handleNewSession}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white font-medium transition-all cursor-pointer hover:opacity-90 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #22C55E, #16A34A)' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>新会话</span>
        </button>
      </div>

      {/* 搜索 */}
      <div className="p-3">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索会话..."
            className="input-field pl-10 text-sm"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: '#94A3B8' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* 会话列表 */}
      <div className="flex-1 overflow-y-auto px-2">
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-slate-500">
            <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-sm">暂无会话</span>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                onClick={() => onSelectSession(session)}
                className={`group flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all ${
                  currentSessionId === session.id
                    ? 'bg-cyan-500/10 border border-cyan-500/20'
                    : 'hover:bg-white/5'
                }`}
              >
                {/* 图标 */}
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                     style={{ background: 'linear-gradient(135deg, #06B6D4, #22C55E)' }}>
                  💬
                </div>

                {/* 内容 */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{session.title || '新会话'}</p>
                  <p className="text-xs text-slate-500">{formatTime(session.updatedAt)}</p>
                </div>

                {/* 删除按钮 */}
                <button
                  onClick={(e) => handleDelete(e, session.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}