/**
 * Task Form Component
 * Form for creating and editing tasks
 */

import React, { useState, useEffect } from 'react';
import { Task, TaskPriority, TaskStatus, taskManager } from '../../store/taskStore';
import { motion } from 'framer-motion';

interface TaskFormProps {
  initialData?: Task;
  onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel?: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as TaskPriority,
    status: 'pending' as TaskStatus,
    assignee: '',
    dueDate: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description || '',
        priority: initialData.priority,
        status: initialData.status,
        assignee: initialData.assignee,
        dueDate: initialData.dueDate || '',
      });
    }
  }, [initialData]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = '任务标题不能为空';
    }
    
    if (formData.title.length > 100) {
      newErrors.title = '任务标题不能超过100个字符';
    }
    
    if (!formData.assignee.trim()) {
      newErrors.assignee = '负责人不能为空';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const priorityOptions: { value: TaskPriority; label: string; color: string }[] = [
    { value: 'critical', label: '紧急 (🔴)', color: 'danger' },
    { value: 'high', label: '高 (🟠)', color: 'warning' },
    { value: 'medium', label: '中 (🟡)', color: 'yellow-500' },
    { value: 'low', label: '低 (⚪)', color: 'dark-text-secondary' },
  ];

  const statusOptions: { value: TaskStatus; label: string }[] = [
    { value: 'pending', label: '待处理' },
    { value: 'in_progress', label: '进行中' },
    { value: 'completed', label: '已完成' },
    { value: 'cancelled', label: '已取消' },
  ];

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      onSubmit={handleSubmit}
      className="bg-dark-card p-6 rounded-lg border border-dark-border"
    >
      <h3 className="text-lg font-medium text-dark-text mb-6">
        {initialData ? '编辑任务' : '创建新任务'}
      </h3>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-dark-text mb-2">
            任务标题 <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="请输入任务标题"
            className={`w-full bg-dark-hover border rounded-lg px-4 py-2.5 text-dark-text transition-colors ${
              errors.title ? 'border-danger' : 'border-dark-border focus:border-primary'
            } focus:ring-2 focus:ring-primary/10 outline-none`}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-danger">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-dark-text mb-2">
            任务描述
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="请输入任务描述（可选）"
            rows={3}
            className="w-full bg-dark-hover border border-dark-border rounded-lg px-4 py-2.5 text-dark-text transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none resize-none"
          />
        </div>

        {/* Priority and Assignee Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">
              优先级 <span className="text-danger">*</span>
            </label>
            <select
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
              className="w-full bg-dark-hover border border-dark-border rounded-lg px-4 py-2.5 text-dark-text transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none appearance-none"
            >
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Assignee */}
          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">
              负责人 <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={formData.assignee}
              onChange={(e) => handleChange('assignee', e.target.value)}
              placeholder="请输入负责人"
              className={`w-full bg-dark-hover border rounded-lg px-4 py-2.5 text-dark-text transition-colors ${
                errors.assignee ? 'border-danger' : 'border-dark-border focus:border-primary'
              } focus:ring-2 focus:ring-primary/10 outline-none`}
            />
            {errors.assignee && (
              <p className="mt-1 text-xs text-danger">{errors.assignee}</p>
            )}
          </div>
        </div>

        {/* Status and Due Date Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">
              状态
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full bg-dark-hover border border-dark-border rounded-lg px-4 py-2.5 text-dark-text transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none appearance-none"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">
              截止日期
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              className="w-full bg-dark-hover border border-dark-border rounded-lg px-4 py-2.5 text-dark-text transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 text-dark-text hover:text-dark-text-secondary font-medium transition-colors"
          >
            取消
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors shadow-lg shadow-primary/20"
        >
          {initialData ? '保存修改' : '创建任务'}
        </button>
      </div>
    </motion.form>
  );
};
