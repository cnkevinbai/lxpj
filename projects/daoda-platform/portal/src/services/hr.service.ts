/**
 * HR 人力资源服务
 * 处理员工、考勤、薪资管理相关操作
 */
import { request, PaginatedResponse } from './api'

// ==================== 类型定义 ====================

export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'RESIGNED'
export type AttendanceStatus = 'PENDING' | 'NORMAL' | 'LATE' | 'EARLY_LEAVE' | 'ABSENT' | 'LEAVE'
export type SalaryStatus = 'PENDING' | 'PAID' | 'CANCELLED'
export type EmployeeLevel = 'INTERN' | 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD' | 'MANAGER' | 'DIRECTOR'

export interface Employee {
  id: string
  name: string
  email: string
  phone: string
  department: string
  position: string
  level: EmployeeLevel | null
  status: EmployeeStatus
  hireDate: string
  salary: number | null
  avatar: string | null
  createdAt: string
}

export interface Attendance {
  id: string
  employeeId: string
  employee: Employee
  date: string
  checkIn: string | null
  checkOut: string | null
  status: AttendanceStatus
  remark: string | null
  createdAt: string
}

export interface Salary {
  id: string
  employeeId: string
  employee: Employee
  month: string
  baseSalary: number
  bonus: number
  deduction: number
  netSalary: number
  status: SalaryStatus
  paidAt: string | null
  createdAt: string
}

export interface CreateEmployeeDto {
  name: string
  email: string
  phone: string
  department: string
  position: string
  level?: EmployeeLevel
  hireDate: string
  salary?: number
  avatar?: string
}

export interface UpdateEmployeeDto {
  name?: string
  email?: string
  phone?: string
  department?: string
  position?: string
  level?: EmployeeLevel
  status?: EmployeeStatus
  hireDate?: string
  salary?: number
  avatar?: string
}

export interface EmployeeQueryParams {
  page?: number
  pageSize?: number
  keyword?: string
  department?: string
  status?: EmployeeStatus
  level?: EmployeeLevel
}

export interface AttendanceQueryParams {
  page?: number
  pageSize?: number
  employeeId?: string
  startDate?: string
  endDate?: string
  status?: AttendanceStatus
}

export interface CreateAttendanceDto {
  employeeId: string
  date: string
  checkIn?: string
  checkOut?: string
  status?: AttendanceStatus
  remark?: string
}

export interface UpdateAttendanceDto {
  checkIn?: string
  checkOut?: string
  status?: AttendanceStatus
  remark?: string
}

export interface SalaryQueryParams {
  page?: number
  pageSize?: number
  employeeId?: string
  month?: string
  status?: SalaryStatus
}

export interface CreateSalaryDto {
  employeeId: string
  month: string
  baseSalary: number
  bonus?: number
  deduction?: number
  status?: SalaryStatus
}

export interface UpdateSalaryDto {
  baseSalary?: number
  bonus?: number
  deduction?: number
  status?: SalaryStatus
  paidAt?: string
}

export interface HRStats {
  totalEmployees: number
  activeEmployees: number
  departmentStats: { department: string; count: number }[]
  attendanceExceptions: number
  pendingSalaries: number
  totalPendingSalary: number
}

// ==================== 员工服务 ====================

export const employeeService = {
  /**
   * 获取员工列表
   */
  getList(params: EmployeeQueryParams): Promise<PaginatedResponse<Employee>> {
    return request.get<PaginatedResponse<Employee>>('/employees', { params })
  },

  /**
   * 获取员工详情
   */
  getOne(id: string): Promise<Employee> {
    return request.get<Employee>(`/employees/${id}`)
  },

  /**
   * 创建员工
   */
  create(dto: CreateEmployeeDto): Promise<Employee> {
    return request.post<Employee>('/employees', dto)
  },

  /**
   * 更新员工
   */
  update(id: string, dto: UpdateEmployeeDto): Promise<Employee> {
    return request.put<Employee>(`/employees/${id}`, dto)
  },

  /**
   * 删除员工
   */
  delete(id: string): Promise<void> {
    return request.delete(`/employees/${id}`)
  },

  /**
   * 上传头像
   */
  uploadAvatar(id: string, file: File): Promise<{ avatar: string }> {
    const formData = new FormData()
    formData.append('avatar', file)
    return request.post<{ avatar: string }>(`/employees/${id}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  /**
   * 获取所有部门列表
   */
  getDepartments(): Promise<string[]> {
    return request.get<string[]>('/employees/departments')
  },
}

// ==================== 考勤服务 ====================

export const attendanceService = {
  /**
   * 获取考勤列表
   */
  getList(params: AttendanceQueryParams): Promise<PaginatedResponse<Attendance>> {
    return request.get<PaginatedResponse<Attendance>>('/attendances', { params })
  },

  /**
   * 获取考勤详情
   */
  getOne(id: string): Promise<Attendance> {
    return request.get<Attendance>(`/attendances/${id}`)
  },

  /**
   * 创建考勤记录
   */
  create(dto: CreateAttendanceDto): Promise<Attendance> {
    return request.post<Attendance>('/attendances', dto)
  },

  /**
   * 更新考勤记录
   */
  update(id: string, dto: UpdateAttendanceDto): Promise<Attendance> {
    return request.put<Attendance>(`/attendances/${id}`, dto)
  },

  /**
   * 删除考勤记录
   */
  delete(id: string): Promise<void> {
    return request.delete(`/attendances/${id}`)
  },

  /**
   * 批量导入考勤
   */
  import(data: CreateAttendanceDto[]): Promise<Attendance[]> {
    return request.post<Attendance[]>('/attendances/import', data)
  },

  /**
   * 获取员工月度考勤
   */
  getMonthly(employeeId: string, month: string): Promise<Attendance[]> {
    return request.get<Attendance[]>(`/attendances/employee/${employeeId}/monthly`, {
      params: { month },
    })
  },
}

// ==================== 薪资服务 ====================

export const salaryService = {
  /**
   * 获取薪资列表
   */
  getList(params: SalaryQueryParams): Promise<PaginatedResponse<Salary>> {
    return request.get<PaginatedResponse<Salary>>('/salaries', { params })
  },

  /**
   * 获取薪资详情
   */
  getOne(id: string): Promise<Salary> {
    return request.get<Salary>(`/salaries/${id}`)
  },

  /**
   * 创建薪资记录
   */
  create(dto: CreateSalaryDto): Promise<Salary> {
    return request.post<Salary>('/salaries', dto)
  },

  /**
   * 更新薪资记录
   */
  update(id: string, dto: UpdateSalaryDto): Promise<Salary> {
    return request.put<Salary>(`/salaries/${id}`, dto)
  },

  /**
   * 删除薪资记录
   */
  delete(id: string): Promise<void> {
    return request.delete(`/salaries/${id}`)
  },

  /**
   * 批量生成薪资
   */
  generate(month: string): Promise<Salary[]> {
    return request.post<Salary[]>('/salaries/generate', { month })
  },

  /**
   * 发放薪资
   */
  pay(id: string): Promise<Salary> {
    return request.post<Salary>(`/salaries/${id}/pay`)
  },

  /**
   * 导出工资条
   */
  exportPayslip(id: string): Promise<Blob> {
    return request.get(`/salaries/${id}/payslip`, {
      responseType: 'blob',
    })
  },
}

// ==================== HR 统计服务 ====================

export const hrStatsService = {
  /**
   * 获取 HR 概览统计
   */
  getOverview(): Promise<HRStats> {
    return request.get<HRStats>('/hr/stats')
  },
}

export default {
  employee: employeeService,
  attendance: attendanceService,
  salary: salaryService,
  stats: hrStatsService,
}
