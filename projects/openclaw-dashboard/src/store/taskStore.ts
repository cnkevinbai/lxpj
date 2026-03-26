import { create } from 'zustand';

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignee: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFilter {
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
  search: string;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  filter: TaskFilter;
  
  // Actions
  setTasks: (tasks: Task[]) => void;
  setLoading: (loading: boolean) => void;
  setFilter: (filter: Partial<TaskFilter>) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (id: string, newStatus: TaskStatus) => Promise<void>;
  loadTasks: () => Promise<void>;
}

// API 基础 URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  loading: false,
  filter: {
    status: 'all',
    priority: 'all',
    search: '',
  },

  setTasks: (tasks) => set({ tasks }),
  setLoading: (loading) => set({ loading }),
  setFilter: (filter) => set((state) => ({
    filter: { ...state.filter, ...filter },
  })),

  addTask: async (taskData) => {
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      
      if (!response.ok) throw new Error('Failed to create task');
      
      const newTask = await response.json();
      set((state) => ({ tasks: [...state.tasks, newTask] }));
    } catch (error) {
      console.error('Failed to add task:', error);
      // 回退到本地创建
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      set((state) => ({ tasks: [...state.tasks, newTask] }));
    }
  },

  updateTask: async (id, updates) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) throw new Error('Failed to update task');
      
      const updatedTask = await response.json();
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? updatedTask : task
        ),
      }));
    } catch (error) {
      console.error('Failed to update task:', error);
      // 回退到本地更新
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id
            ? { ...task, ...updates, updatedAt: new Date().toISOString() }
            : task
        ),
      }));
    }
  },

  deleteTask: async (id) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete task');
      
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
      }));
    } catch (error) {
      console.error('Failed to delete task:', error);
      // 回退到本地删除
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
      }));
    }
  },

  moveTask: async (id, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) throw new Error('Failed to move task');
      
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id
            ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
            : task
        ),
      }));
    } catch (error) {
      console.error('Failed to move task:', error);
      // 回退到本地移动
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id
            ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
            : task
        ),
      }));
    }
  },

  loadTasks: async () => {
    set({ loading: true });
    try {
      const response = await fetch(`${API_URL}/tasks`);
      
      if (!response.ok) throw new Error('Failed to load tasks');
      
      const result = await response.json();
      set({ tasks: result.data || [], loading: false });
    } catch (error) {
      console.error('Failed to load tasks:', error);
      set({ loading: false, tasks: [] });
    }
  },
}));

// Task Manager Helper Functions
export const taskManager = {
  filterTasks: (tasks: Task[], filter: TaskFilter): Task[] => {
    return tasks.filter((task) => {
      // Status filter
      if (filter.status !== 'all' && task.status !== filter.status) {
        return false;
      }
      // Priority filter
      if (filter.priority !== 'all' && task.priority !== filter.priority) {
        return false;
      }
      // Search filter
      if (filter.search) {
        const searchTerm = filter.search.toLowerCase();
        return (
          task.title.toLowerCase().includes(searchTerm) ||
          task.description?.toLowerCase().includes(searchTerm) ||
          task.assignee.toLowerCase().includes(searchTerm)
        );
      }
      return true;
    });
  },

  getPriorityColor: (priority: TaskPriority) => {
    switch (priority) {
      case 'critical':
        return 'danger';
      case 'high':
        return 'warning';
      case 'medium':
        return 'yellow-500';
      default:
        return 'dark-text-secondary';
    }
  },

  getPriorityIcon: (priority: TaskPriority) => {
    switch (priority) {
      case 'critical':
        return '🔴';
      case 'high':
        return '🟠';
      case 'medium':
        return '🟡';
      default:
        return '🟢';
    }
  },

  getPriorityLabel: (priority: TaskPriority) => {
    switch (priority) {
      case 'critical':
        return '紧急';
      case 'high':
        return '高';
      case 'medium':
        return '中';
      default:
        return '低';
    }
  },

  getStatusColor: (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'primary';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  },

  getStatusIcon: (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'in_progress':
        return '🔄';
      case 'cancelled':
        return '❌';
      default:
        return '⏳';
    }
  },

  getStatusLabel: (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'in_progress':
        return '进行中';
      case 'cancelled':
        return '已取消';
      default:
        return '待处理';
    }
  },
};