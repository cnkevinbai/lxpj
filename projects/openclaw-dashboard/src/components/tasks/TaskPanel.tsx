/**
 * 任务状态面板 - 显示活跃任务和快速派发
 */

import { useState, useEffect } from 'react';
import { taskDispatcher, Task, TaskStatus } from '../../services/task-dispatcher';

// 任务状态颜色
const statusColors: Record<TaskStatus, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  assigned: 'bg-blue-500/20 text-blue-400',
  in_progress: 'bg-green-500/20 text-green-400',
  completed: 'bg-slate-500/20 text-slate-400',
  failed: 'bg-red-500/20 text-red-400',
};

const statusLabels: Record<TaskStatus, string> = {
  pending: '待处理',
  assigned: '已分配',
  in_progress: '进行中',
  completed: '已完成',
  failed: '失败',
};

export function TaskPanel() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    setTasks(taskDispatcher.getAllTasks());
    return taskDispatcher.onTasksChange(setTasks);
  }, []);

  const activeTasks = tasks.filter(t => t.status === 'in_progress' || t.status === 'assigned');
  const stats = taskDispatcher.getTaskStats();

  if (tasks.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-800/80 backdrop-blur border-b border-slate-700">
      {/* 标题栏 */}
      <div
        className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-slate-700/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-slate-300">📋 活跃任务</span>
          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
            {activeTasks.length}
          </span>
        </div>
        <div className="flex items-center space-x-4 text-xs text-slate-500">
          <span>总计 {stats.total}</span>
          <span className="text-green-400">完成 {stats.completed}</span>
          <span>{isExpanded ? '▼' : '▶'}</span>
        </div>
      </div>

      {/* 任务列表 */}
      {isExpanded && (
        <div className="px-4 pb-3 space-y-2">
          {activeTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
          {activeTasks.length === 0 && (
            <div className="text-center py-2 text-slate-500 text-sm">
              暂无活跃任务
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// 任务卡片
function TaskCard({ task }: { task: Task }) {
  return (
    <div className="flex items-center justify-between p-2 bg-slate-700/50 rounded-lg">
      <div className="flex items-center space-x-3">
        <span className="text-lg">{task.assignedAgent?.avatar}</span>
        <div>
          <div className="text-sm text-slate-200">{task.title}</div>
          <div className="text-xs text-slate-500">
            {task.assignedAgent?.name} · {task.keywords.slice(0, 2).join(', ')}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[task.status]}`}>
          {statusLabels[task.status]}
        </span>
        {task.windowId && (
          <span className="text-xs text-green-400" title="已创建窗口">
            🖥️
          </span>
        )}
      </div>
    </div>
  );
}