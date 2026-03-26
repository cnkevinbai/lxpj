/**
 * Dashboard 服务
 */
import { request } from './api'

interface DashboardStats {
  onlineTerminals: number
  todayAccess: number
  alarmCount: number
  messageTotal: number
  onlineChange: number
  accessChange: number
}

/**
 * 获取 Dashboard 统计数据
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  // 模拟数据
  return {
    onlineTerminals: 1234,
    todayAccess: 56,
    alarmCount: 3,
    messageTotal: 89432,
    onlineChange: 12,
    accessChange: 8,
  }
  
  // 实际 API
  // return request.get<DashboardStats>('/dashboard/stats')
}

/**
 * 获取最新接入终端
 */
export async function getRecentTerminals(limit: number = 5) {
  return request.get('/dashboard/recent-terminals', { limit })
}

/**
 * 获取终端状态分布
 */
export async function getTerminalStatusDistribution() {
  return request.get('/dashboard/status-distribution')
}