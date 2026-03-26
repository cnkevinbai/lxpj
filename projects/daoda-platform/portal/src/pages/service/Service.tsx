/**
 * 售后服务模块路由
 */
import { Routes, Route } from 'react-router-dom'
import ServiceDashboard from './ServiceDashboard'
import TicketList from './TicketList'
import TicketDetail from './TicketDetail'
import ContractList from './ContractList'
import PartList from './PartList'

export default function Service() {
  return (
    <Routes>
      <Route index element={<ServiceDashboard />} />
      <Route path="tickets" element={<TicketList />} />
      <Route path="tickets/:id" element={<TicketDetail />} />
      <Route path="contracts" element={<ContractList />} />
      <Route path="parts" element={<PartList />} />
    </Routes>
  )
}