/**
 * System API Service - 系统运维相关 API
 */

import { get, post } from '../config/api-client';

export interface ServiceStatus {
  name: string;
  status: 'running' | 'stopped' | 'error';
  pid?: number;
  uptime?: number;
  restarts?: number;
}

export interface SystemStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  version: string;
  services: ServiceStatus[];
  timestamp: number;
}

export interface CpuMetrics {
  usage: number;
  cores: number;
  load: number[];
  model?: string;
  speed?: number;
}

export interface MemoryMetrics {
  total: number;
  used: number;
  free: number;
  usage: number;
  cached?: number;
}

export interface DiskMetrics {
  mount: string;
  total: number;
  used: number;
  free: number;
  usage: number;
}

export interface SystemMetrics {
  cpu: CpuMetrics;
  memory: MemoryMetrics;
  disk: DiskMetrics[];
  network?: {
    rxBytes: number;
    txBytes: number;
    rxSpeed?: number;
    txSpeed?: number;
  };
  timestamp: number;
}

export interface HealthCheck {
  status: 'ok' | 'error';
  checks: {
    database?: 'ok' | 'error';
    websocket?: 'ok' | 'error';
    openclaw?: 'ok' | 'error';
  };
  timestamp: number;
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

export interface RestartResponse {
  success: boolean;
  message: string;
  service?: string;
}

/**
 * 获取系统状态
 */
export const getSystemStatus = async (): Promise<SystemStatus> => {
  return get<SystemStatus>('/system/status');
};

/**
 * 健康检查
 */
export const getHealthCheck = async (): Promise<HealthCheck> => {
  return get<HealthCheck>('/system/health');
};

/**
 * 获取系统指标
 */
export const getSystemMetrics = async (): Promise<SystemMetrics> => {
  return get<SystemMetrics>('/system/metrics');
};

/**
 * 重启服务
 */
export const restartService = async (
  service?: string,
  force?: boolean,
): Promise<RestartResponse> => {
  return post<RestartResponse>('/system/restart', { service, force });
};

/**
 * 获取系统日志
 */
export const getSystemLogs = async (params?: {
  tail?: number;
  grep?: string;
  level?: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  service?: string;
}): Promise<LogsResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params?.tail) queryParams.append('tail', params.tail.toString());
  if (params?.grep) queryParams.append('grep', params.grep);
  if (params?.level) queryParams.append('level', params.level);
  if (params?.service) queryParams.append('service', params.service);

  const queryString = queryParams.toString();
  return get<LogsResponse>(`/system/logs${queryString ? `?${queryString}` : ''}`);
};

/**
 * 运行诊断
 */
export const runDiagnose = async (): Promise<any> => {
  return post<any>('/system/diagnose');
};
