export interface SystemStatusResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  version: string;
  services: ServiceStatus[];
  timestamp: number;
}

export interface ServiceStatus {
  name: string;
  status: 'running' | 'stopped' | 'error';
  pid?: number;
  uptime?: number;
  restarts?: number;
}

export interface SystemMetricsResponse {
  cpu: CpuMetrics;
  memory: MemoryMetrics;
  disk: DiskMetrics[];
  network?: NetworkMetrics;
  timestamp: number;
}

export interface CpuMetrics {
  usage: number; // percentage
  cores: number;
  load: number[]; // 1, 5, 15 minute load averages
  model?: string;
  speed?: number;
}

export interface MemoryMetrics {
  total: number; // bytes
  used: number; // bytes
  free: number; // bytes
  usage: number; // percentage
  cached?: number; // bytes
}

export interface DiskMetrics {
  mount: string;
  total: number; // bytes
  used: number; // bytes
  free: number; // bytes
  usage: number; // percentage
}

export interface NetworkMetrics {
  rxBytes: number;
  txBytes: number;
  rxSpeed?: number; // bytes per second
  txSpeed?: number; // bytes per second
}

export interface HealthCheckResponse {
  status: 'ok' | 'error';
  checks: {
    database?: 'ok' | 'error';
    websocket?: 'ok' | 'error';
    openclaw?: 'ok' | 'error';
  };
  timestamp: number;
}

export interface RestartRequest {
  service?: string;
  force?: boolean;
}

export interface RestartResponse {
  success: boolean;
  message: string;
  service?: string;
}

export interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  service: string;
  message: string;
}

export interface LogsResponse {
  logs: LogEntry[];
  total: number;
  hasMore: boolean;
}
