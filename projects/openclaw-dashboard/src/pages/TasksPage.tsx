/**
 * Tasks Page - Task Management Dashboard
 * Features:
 * - Kanban board view (Pending / In Progress / Completed / Cancelled)
 * - Task creation form
 * - Task editing functionality
 * - Task deletion with confirmation
 * - Drag and drop reordering (optional)
 * - Filtering and search
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TaskBoard } from '../components/tasks/TaskBoard';
import { TaskForm } from '../components/tasks/TaskForm';
import { Task, TaskPriority, TaskStatus, useTaskStore, taskManager } from '../store/taskStore';
import { ToastContainer, toast } from 'react-toastify';

export function TasksPage() {
  const { tasks, loading, filter, setFilter, addTask, updateTask, deleteTask, moveTask, loadTasks } =
    useTaskStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Filter tasks
  const filteredTasks = taskManager.filterTasks(tasks, filter);

  // Handle task addition
  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    addTask(taskData);
    setIsFormOpen(false);
    setEditingTask(null);
    toast.success('任务创建成功');
  };

  // Handle task update
  const handleUpdateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    }
    setEditingTask(null);
    toast.success('任务更新成功');
  };

  // Handle form submit (unified)
  const handleFormSubmit = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      handleUpdateTask(taskData);
    } else {
      handleAddTask(taskData);
    }
  };

  // Handle task move (status change)
  const handleMoveTask = (taskId: string, newStatus: TaskStatus) => {
    moveTask(taskId, newStatus);
  };

  // Handle task deletion
  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    setConfirmDelete(null);
    toast.success('任务已删除');
  };

  // Handle filter change
  const handleFilterChange = (filterType: keyof typeof filter, value: string) => {
    setFilter({ [filterType]: value });
  };

  // Get task statistics
  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    inProgress: tasks.filter((t) => t.status === 'in_progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  };

  // Priority color classes
  const priorityClasses: Record<TaskPriority, string> = {
    critical: 'text-danger bg-danger/10 border-danger/20',
    high: 'text-warning bg-warning/10 border-warning/20',
    medium: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    low: 'text-dark-text-secondary bg-dark-text-secondary/10 border-dark-text-secondary/20',
  };

  const priorityIcons: Record<TaskPriority, string> = {
    critical: '🔴',
    high: '🟠',
    medium: '🟡',
    low: '⚪',
  };

  return (
    <div className="space-y-6 h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-dark-text">任务管理</h2>
          <p className="text-dark-text-secondary">查看和管理任务看板</p>
        </div>
        
        {/* Stats */}
        <div className="flex flex-wrap gap-3">
          <div className="px-4 py-2 bg-dark-card rounded-lg border border-dark-border">
            <span className="text-xs text-dark-text-secondary">总数</span>
            <span className="ml-2 text-lg font-bold text-dark-text">{stats.total}</span>
          </div>
          <div className="px-4 py-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
            <span className="text-xs text-yellow-500">待处理</span>
            <span className="ml-2 text-lg font-bold text-yellow-500">{stats.pending}</span>
          </div>
          <div className="px-4 py-2 bg-primary/10 rounded-lg border border-primary/20">
            <span className="text-xs text-primary">进行中</span>
            <span className="ml-2 text-lg font-bold text-primary">{stats.inProgress}</span>
          </div>
          <div className="px-4 py-2 bg-success/10 rounded-lg border border-success/20">
            <span className="text-xs text-success">已完成</span>
            <span className="ml-2 text-lg font-bold text-success">{stats.completed}</span>
          </div>
        </div>
      </div>

      {/* Priority Legend */}
      <div className="flex flex-wrap gap-4 text-sm text-dark-text-secondary">
        <span className="flex items-center gap-2">
          <span className="text-danger">🔴</span> <span className="text-xs">紧急</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="text-warning">🟠</span> <span className="text-xs">高</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="text-yellow-500">🟡</span> <span className="text-xs">中</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="text-dark-text-secondary">⚪</span> <span className="text-xs">低</span>
        </span>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="搜索任务..."
            value={filter.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full bg-dark-hover border border-dark-border rounded-lg pl-10 pr-4 py-2 text-dark-text focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-colors"
          />
          <svg
            className="absolute left-3 top-2.5 w-5 h-5 text-dark-text-secondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>

        {/* Filter by Priority */}
        <select
          value={filter.priority}
          onChange={(e) => handleFilterChange('priority', e.target.value)}
          className="bg-dark-hover border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
        >
          <option value="all">全部优先级</option>
          <option value="critical">紧急</option>
          <option value="high">高</option>
          <option value="medium">中</option>
          <option value="low">低</option>
        </select>

        {/* Filter by Status */}
        <select
          value={filter.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="bg-dark-hover border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
        >
          <option value="all">全部状态</option>
          <option value="pending">待处理</option>
          <option value="in_progress">进行中</option>
          <option value="completed">已完成</option>
          <option value="cancelled">已取消</option>
        </select>

        {/* Add Task Button */}
        <button
          onClick={() => {
            setEditingTask(null);
            setIsFormOpen(true);
          }}
          className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          添加任务
        </button>
      </div>

      {/* Task Board */}
      <TaskBoard
        tasks={filteredTasks}
        onEdit={(task) => {
          setEditingTask(task);
          setIsFormOpen(true);
        }}
        onDelete={(taskId) => setConfirmDelete(taskId)}
        onMove={handleMoveTask}
      />

      {/* Add/Edit Task Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-2xl"
          >
            <TaskForm
              initialData={editingTask || undefined}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingTask(null);
              }}
            />
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md bg-dark-card p-6 rounded-lg border border-dark-border"
          >
            <h3 className="text-xl font-bold text-dark-text mb-2">确认删除</h3>
            <p className="text-dark-text-secondary mb-6">
              确定要删除这个任务吗？此操作无法撤销。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2.5 bg-dark-hover hover:bg-dark-text-secondary/10 rounded-lg font-medium transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => handleDeleteTask(confirmDelete)}
                className="flex-1 px-4 py-2.5 bg-danger hover:bg-danger/90 text-white rounded-lg font-medium transition-colors"
              >
                确认删除
              </button>
            </div>
          </motion.div>
        </div>
      )}

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

export default TasksPage;
