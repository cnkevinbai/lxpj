/**
 * 任务窗口栏 - 多窗口管理
 * 
 * 功能：
 * - 显示所有任务窗口
 * - 手动创建新窗口
 * - 窗口切换、最小化、关闭
 * - 窗口预览
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { windowService, TaskWindow } from '../../services/window-manager';

// Agent 配置
const AGENTS = [
  { id: 'main', name: '渔晓白', avatar: '🦞', color: '#06B6D4' },
  { id: 'architect', name: 'Morgan', avatar: '🏛️', color: '#8B5CF6' },
  { id: 'backend-dev', name: 'Ryan', avatar: '💻', color: '#10B981' },
  { id: 'frontend-dev', name: 'Chloe', avatar: '🎨', color: '#F59E0B' },
  { id: 'database-engineer', name: 'Diana', avatar: '🗄️', color: '#EC4899' },
  { id: 'devops-engineer', name: 'Sam', avatar: '🚀', color: '#EF4444' },
  { id: 'test-engineer', name: 'Taylor', avatar: '🧪', color: '#14B8A6' },
  { id: 'code-reviewer', name: 'Blake', avatar: '👁️', color: '#F97316' },
];

export function TaskBar() {
  const [windows, setWindows] = useState<TaskWindow[]>([]);
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  // 加载窗口列表
  useEffect(() => {
    const updateWindows = () => {
      setWindows(windowService.getAllWindows());
    };

    updateWindows();
    const interval = setInterval(updateWindows, 1000);
    return () => clearInterval(interval);
  }, []);

  // 创建新窗口
  const handleCreateWindow = useCallback((agentId: string) => {
    const agent = AGENTS.find(a => a.id === agentId);
    if (!agent) return;

    try {
      const windowId = windowService.openTaskWindow({
        agentId,
        title: `${agent.name} - 新任务`,
      });

      console.log(`[TaskBar] 创建窗口: ${windowId}`);
      setShowCreateMenu(false);
      
      // 更新窗口列表
      setWindows(windowService.getAllWindows());
    } catch (error: any) {
      console.error('[TaskBar] 创建窗口失败:', error);
      
      // 显示提示：浏览器可能拦截了弹出窗口
      alert('窗口创建失败！请检查浏览器是否拦截了弹出窗口，或点击地址栏右侧允许弹出窗口。');
    }
  }, []);

  // 激活窗口
  const handleActivateWindow = useCallback((windowId: string) => {
    windowService.focusWindow(windowId);
  }, []);

  // 关闭窗口
  const handleCloseWindow = useCallback((windowId: string) => {
    windowService.closeTaskWindow(windowId);
    setWindows(windowService.getAllWindows());
  }, []);

  return (
    <div className="h-12 bg-slate-800/80 border-b border-slate-700 flex items-center px-4 space-x-2">
      {/* 窗口列表 */}
      <AnimatePresence>
        {windows.map((win) => {
          const agent = AGENTS.find(a => a.id === win.agentId);
          const isActive = win.status === 'active';
          const isPinned = win.pinned;
          return (
            <motion.button
              key={win.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => handleActivateWindow(win.id)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-cyan-500/20 border border-cyan-500/50'
                  : 'bg-slate-700/50 hover:bg-slate-700 border border-transparent'
              }`}
            >
              <span className="text-lg">{agent?.avatar || '🤖'}</span>
              <span className="text-sm text-slate-300 max-w-[100px] truncate">
                {win.title}
              </span>
              {isPinned && <span className="text-xs">📌</span>}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseWindow(win.id);
                }}
                className="text-slate-400 hover:text-red-400 transition-colors"
              >
                ✕
              </button>
            </motion.button>
          );
        })}
      </AnimatePresence>

      {/* 创建窗口按钮 */}
      <div className="relative">
        <button
          onClick={() => setShowCreateMenu(!showCreateMenu)}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <span className="text-lg">+</span>
          <span className="text-sm">新建任务窗口</span>
        </button>

        {/* 创建菜单 */}
        <AnimatePresence>
          {showCreateMenu && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 mt-2 w-64 bg-slate-800 rounded-xl border border-slate-700 shadow-2xl overflow-hidden z-50"
            >
              <div className="p-2 border-b border-slate-700">
                <p className="text-xs text-slate-400">选择代理创建任务窗口</p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {AGENTS.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => handleCreateWindow(agent.id)}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-slate-700/50 transition-colors"
                  >
                    <span className="text-2xl">{agent.avatar}</span>
                    <div className="flex-1 text-left">
                      <p className="text-sm text-white">{agent.name}</p>
                      <p className="text-xs text-slate-400">
                        点击创建独立窗口
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 点击外部关闭菜单 */}
      {showCreateMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowCreateMenu(false)}
        />
      )}
    </div>
  );
}

export default TaskBar;