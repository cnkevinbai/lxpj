/**
 * HR 人事管理模块路由
 */
import { Routes, Route } from 'react-router-dom'
import HRHome from './HRHome'
import EmployeeList from './EmployeeList'
import EmployeeDetail from './EmployeeDetail'
import AttendanceList from './AttendanceList'
import SalaryList from './SalaryList'
import LeaveApproval from './LeaveApproval'

export default function HR() {
  return (
    <Routes>
      <Route index element={<HRHome />} />
      <Route path="employees" element={<EmployeeList />} />
      <Route path="employees/:id" element={<EmployeeDetail />} />
      <Route path="attendance" element={<AttendanceList />} />
      <Route path="leave-approval" element={<LeaveApproval />} />
      <Route path="salary" element={<SalaryList />} />
    </Routes>
  )
}