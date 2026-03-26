/**
 * Task Card Component
 * Displays individual task information with priority badge and status
 */

import React from 'react';
import { Task, taskManager } from '../../store/taskStore';
import { motion } from 'framer-motion';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onMove: (taskId: string, status: Task['status']) => void;
  canDrag?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onMove,
  canDrag = true,
}) => {
  const priorityColor = taskManager.getPriorityColor(task.priority);
  const priorityIcon = taskManager.getPriorityIcon(task.priority);
  const statusColor = taskManager.getStatusColor(task.status);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(task);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Task['status'];
    onMove(task.id, newStatus);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="bg-dark-card p-4 rounded-lg border border-dark-border hover:border-primary/50 transition-all duration-200 group cursor-grab active:cursor-grabbing"
      style={{
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Priority Badge */}
      <div className="flex items-start justify-between mb-3">
        <span
          className={`text-xs px-2.5 py-1 rounded font-medium ${
            priorityColor === 'danger'
              ? 'text-danger bg-danger/10 border border-danger/20'
              : priorityColor === 'warning'
              ? 'text-warning bg-warning/10 border border-warning/20'
              : priorityColor === 'yellow-500'
              ? 'text-yellow-500 bg-yellow-500/10 border border-yellow-500/20'
              : 'text-dark-text-secondary bg-dark-text-secondary/10'
          }`}
        >
          {priorityIcon} {taskManager.getPriorityLabel(task.priority)}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleEdit}
            className="p-1.5 hover:bg-primary/10 rounded text-primary transition-colors"
            title="编辑任务"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 hover:bg-danger/10 rounded text-danger transition-colors"
            title="删除任务"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Task Title */}
      <h4 className="text-sm font-medium text-dark-text mb-2 line-clamp-2">
        {task.title}
      </h4>

      {/* Task Description (if exists) */}
      {task.description && (
        <p className="text-xs text-dark-text-secondary mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Task Details */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-dark-border/50">
        {/* Assignee */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium bg-primary/10 text-primary">
            {task.assignee ? task.assignee.charAt(0).toUpperCase() : '?'}
          </div>
          <span className="text-xs text-dark-text-secondary">{task.assignee || '未分配'}</span>
        </div>

        {/* Status Select */}
        <select
          value={task.status}
          onChange={handleStatusChange}
          className={`text-xs px-2 py-1 rounded border ${
            statusColor.includes('success')
              ? 'bg-success/5 border-success/20'
              : statusColor.includes('danger')
              ? 'bg-danger/5 border-danger/20'
              : statusColor.includes('primary')
              ? 'bg-primary/5 border-primary/20'
              : 'bg-dark-hover border-dark-border'
          }`}
        >
          <option value="pending">待处理</option>
          <option value="in_progress">进行中</option>
          <option value="completed">已完成</option>
          <option value="cancelled">已取消</option>
        </select>
      </div>

      {/* Due Date */}
      {task.dueDate && (
        <div className="mt-2 text-xs text-dark-text-secondary">
          <span className="opacity-75">截止日期:</span> {task.dueDate}
        </div>
      )}
    </motion.div>
  );
};
