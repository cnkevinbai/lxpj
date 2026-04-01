/**
 * 考勤管理服务
 */
import { request, PaginatedResponse } from './api'

export interface AttendanceRecord {
  id: string
  employeeId: string
  employeeName: string
  department: string
  date: string
  clockIn?: string
  clockOut?: string
  status: 'normal' | 'late' | 'early' | 'absent' | 'leave' | 'overtime'
  workHours?: number
  overtimeHours?: number
  remark?: string
  createdAt: string
}

export interface AttendanceStats {
  totalDays: number
  normalDays: number
  lateDays: number
  earlyDays: number
  absentDays: number
  leaveDays: number
  overtimeDays: number
  totalWorkHours: number
  totalOvertimeHours: number
}

export const attendanceService = {
  getList(params: { page?: number; pageSize?: number; employeeId?: string; date?: string; status?: string }): Promise<PaginatedResponse<AttendanceRecord>> {
    return request.get('/attendance', { params })
  },

  getOne(id: string): Promise<AttendanceRecord> {
    return request.get(`/attendance/${id}`)
  },

  clockIn(data: { employeeId: string; location?: string }): Promise<AttendanceRecord> {
    return request.post('/attendance/clock-in', data)
  },

  clockOut(id: string, data?: { location?: string }): Promise<AttendanceRecord> {
    return request.post(`/attendance/${id}/clock-out`, data)
  },

  getStats(employeeId: string, month: string): Promise<AttendanceStats> {
    return request.get(`/attendance/stats/${employeeId}`, { params: { month } })
  },

  export(params: { month: string; department?: string }): Promise<Blob> {
    return request.get('/attendance/export', { params, responseType: 'blob' })
  },
}

export default attendanceService