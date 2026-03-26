export interface Activity {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface DashboardStats {
  activeSessions: number;
  tasksCompleted: number;
  agentsOnline: number;
  totalMessages: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
  }[];
}

export interface AgentUsage {
  agentId: string;
  count: number;
}
