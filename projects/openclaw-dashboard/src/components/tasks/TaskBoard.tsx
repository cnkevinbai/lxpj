/**
 * Task Board Component
 * Kanban board showing tasks in different columns
 */

import React from 'react';
import { Task, TaskStatus, taskManager } from '../../store/taskStore';
import { TaskCard } from './TaskCard';
import { motion } from 'framer-motion';

interface TaskBoardProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onMove: (taskId: string, status: TaskStatus) => void;
}

const statusColumns: { status: TaskStatus; label: string; color: string }[] = [
  { status: 'pending', label: '待处理', color: 'border-dark-border' },
  { status: 'in_progress', label: '进行中', color: 'border-primary' },
  { status: 'completed', label: '已完成', color: 'border-success' },
  { status: 'cancelled', label: '已取消', color: 'border-dark-text-disabled' },
];

export const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, onEdit, onDelete, onMove }) => {
  const getStatusTasks = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <motion.div
      layout
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full"
    >
      {statusColumns.map((column) => (
        <motion.div
          layout
          key={column.status}
          className="flex flex-col bg-dark-card/50 rounded-lg border border-dark-border/50 backdrop-blur-sm"
        >
          {/* Column Header */}
          <div
            className={`px-4 py-3 border-b ${
              column.status === 'completed'
                ? 'border-success'
                : column.status === 'cancelled'
                ? 'border-dark-text-disabled'
                : column.status === 'in_progress'
                ? 'border-primary'
                : 'border-dark-border'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-dark-text capitalize">
                  {column.label}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-dark-hover/50 text-dark-text-secondary">
                  {getStatusTasks(column.status).length}
                </span>
              </div>
              {column.status === 'pending' && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary">
                  可添加
                </span>
              )}
            </div>
          </div>

          {/* Tasks Container */}
          <div className="p-3 space-y-3 flex-1 overflow-y-auto min-h-[200px]">
            {getStatusTasks(column.status).map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onMove={onMove}
              />
            ))}

            {getStatusTasks(column.status).length === 0 && (
              <div className="text-center py-8 text-dark-text-secondary">
                <div className="text-4xl mb-2 opacity-20">
                  {column.status === 'pending' && '✅'}
                  {column.status === 'in_progress' && '🔄'}
                  {column.status === 'completed' && '🎉'}
                  {column.status === 'cancelled' && '❌'}
                </div>
                <p className="text-sm">暂无任务</p>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
