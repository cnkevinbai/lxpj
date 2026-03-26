import { get } from '../config/api-client';

// Types for Dashboard API responses
export interface DashboardStats {
  activeSessions: number;
  tasksCompleted: number;
  agentsOnline: number;
  messageCount: number;
}

export interface DashboardActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  agentName?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

export interface DashboardCharts {
  messageTrend: ChartData;
  agentUsage: ChartData;
}

// Dashboard API service
export const dashboardApi = {
  // Get dashboard statistics
  async getStats(): Promise<DashboardStats> {
    try {
      const response = await get<DashboardStats>('/dashboard/stats');
      return response || { activeSessions: 0, tasksCompleted: 0, agentsOnline: 12, messageCount: 0 };
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      // 返回默认值，不抛出错误
      return { activeSessions: 0, tasksCompleted: 0, agentsOnline: 12, messageCount: 0 };
    }
  },

  // Get recent activities
  async getActivities(): Promise<DashboardActivity[]> {
    try {
      const response = await get<DashboardActivity[]>('/dashboard/activities');
      return response || [];
    } catch (error) {
      console.error('Failed to fetch activities:', error);
      return [];
    }
  },

  // Get chart data
  async getCharts(): Promise<DashboardCharts | null> {
    try {
      const response = await get<DashboardCharts>('/dashboard/charts');
      return response || null;
    } catch (error) {
      console.error('Failed to fetch charts:', error);
      return null;
    }
  },
};

export default dashboardApi;