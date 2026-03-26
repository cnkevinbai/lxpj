/**
 * 任务状态监控组件 - 显示后端真实任务数据
 * 
 * 数据来源: /api/tasks
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 任务状态
type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

// 任务优先级
type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

// 任务数据
interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: string;
  createdAt: string;
  updatedAt: string;
}

// 统计数据
interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  byPriority: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

// 状态配置
const STATUS_CONFIG: Record<TaskStatus, { color: string; icon: string; label: string }> = {
  pending: { color: '#F59E0B', icon: '⏳', label: '待处理' },
  in_progress: { color: '#06B6D4', icon: '🔄', label: '进行中' },
  completed: { color: '#22C55E', icon: '✅', label: '已完成' },
  cancelled: { color: '#EF4444', icon: '❌', label: '已取消' },
};

// 优先级配置
const PRIORITY_CONFIG: Record<TaskPriority, { color: string; icon: string }> = {
  low: { color: '#22C55E', icon: '🟢' },
  medium: { color: '#F59E0B', icon: '🟡' },
  high: { color: '#EF4444', icon: '🟠' },
  critical: { color: '#DC2626', icon: '🔴' },
};

// API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export function TaskMonitor() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  // 加载任务数据
  const loadTasks = async () => {
    try {
      const [tasksRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/tasks?limit=10`),
        fetch(`${API_URL}/tasks/stats`),
      ]);

      if (tasksRes.ok && statsRes.ok) {
        const tasksData = await tasksRes.json();
        const statsData = await statsRes.json();
        setTasks(tasksData.data || []);
        setStats(statsData);
      }
    } catch (error) {
      console.error('[TaskMonitor] 加载失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 定期更新
  useEffect(() => {
    loadTasks();
    const interval = setInterval(loadTasks, 5000); // 每5秒更新
    return () => clearInterval(interval);
  }, []);

  // 完成任务
  const completeTask = async (taskId: string) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}/complete`, {
        method: 'POST',
      });
      if (response.ok) {
        loadTasks(); // 刷新数据
      }
    } catch (error) {
      console.error('[TaskMonitor] 完成任务失败:', error);
    }
  };

  // 删除任务
  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        loadTasks(); // 刷新数据
      }
    } catch (error) {
      console.error('[TaskMonitor] 删除任务失败:', error);
    }
  };

  // 如果没有数据，不显示
  if (!loading && !stats) {
    return null;
  }

  // 有任务时显示（不管状态）
  if (!loading && stats && stats.total === 0) {
    return null;
  }

  // 活跃任务数（非完成/取消）
  const activeTasks = stats ? stats.pending + stats.inProgress : 0;

  return (
    <div className="fixed bottom-20 right-4 z-40">
      {/* 折叠状态 */}
      {!isExpanded && stats && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 hover:border-cyan-500/50 transition-colors backdrop-blur-sm"
          style={{ background: 'rgba(15, 23, 42, 0.95)' }}
        >
          <span className="text-lg">📋</span>
          <span className="text-sm text-white">
            {stats.inProgress > 0 && (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                {stats.inProgress} 进行中
              </span>
            )}
            {stats.pending > 0 && ` · ${stats.pending} 待处理`}
            {activeTasks === 0 && stats.completed > 0 && ` ✅ ${stats.completed} 已完成`}
          </span>
        </motion.button>
      )}

      {/* 展开状态 */}
      <AnimatePresence>
        {isExpanded && stats && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="w-96 rounded-xl border border-white/10 shadow-2xl overflow-hidden"
            style={{ background: 'rgba(15, 23, 42, 0.98)' }}
          >
            {/* 头部 */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-lg">📋</span>
                <span className="text-white font-medium">任务监控</span>
                <span className="text-xs text-slate-500">实时数据</span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* 统计 */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 text-xs overflow-x-auto">
              <span className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-400 whitespace-nowrap">
                {stats.inProgress} 进行中
              </span>
              <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-400 whitespace-nowrap">
                {stats.pending} 待处理
              </span>
              <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 whitespace-nowrap">
                {stats.completed} 完成
              </span>
              {stats.cancelled > 0 && (
                <span className="px-2 py-1 rounded bg-red-500/20 text-red-400 whitespace-nowrap">
                  {stats.cancelled} 取消
                </span>
              )}
            </div>

            {/* 任务列表 */}
            <div className="max-h-72 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8 text-slate-400">
                  加载中...
                </div>
              ) : tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                  <span className="text-2xl mb-2">📭</span>
                  <span className="text-sm">暂无任务</span>
                </div>
              ) : (
                tasks.map((task) => {
                  const statusConfig = STATUS_CONFIG[task.status];
                  const priorityConfig = PRIORITY_CONFIG[task.priority];
                  
                  return (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                    >
                      {/* 状态图标 */}
                      <span className="text-lg">{statusConfig.icon}</span>
                      
                      {/* 任务信息 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white truncate">
                            {task.title}
                          </span>
                          <span title={task.priority}>{priorityConfig.icon}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                          <span style={{ color: statusConfig.color }}>
                            {statusConfig.label}
                          </span>
                          {task.assignee && (
                            <>
                              <span>·</span>
                              <span>{task.assignee}</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* 操作按钮 */}
                      {task.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => completeTask(task.id)}
                            className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                          >
                            完成
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="text-xs text-slate-400 hover:text-red-400 transition-colors"
                          >
                            删除
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* 数据源标识 */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                <span>PostgreSQL 实时数据</span>
              </div>
              <span>
                {new Date().toLocaleTimeString('zh-CN')}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TaskMonitor;