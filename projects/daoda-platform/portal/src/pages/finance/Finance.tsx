/**
 * 财务管理模块路由
 * 包含财务概览、应收管理、应付管理、发票管理
 */
import { Routes, Route } from 'react-router-dom'
import FinanceDashboard from './FinanceDashboard'
import FinanceOverview from './FinanceOverview'
import ReceivableList from './ReceivableList'
import PayableList from './PayableList'
import InvoiceList from './InvoiceList'

export default function Finance() {
  return (
    <Routes>
      <Route index element={<FinanceDashboard />} />
      <Route path="overview" element={<FinanceOverview />} />
      <Route path="receivables" element={<ReceivableList />} />
      <Route path="payables" element={<PayableList />} />
      <Route path="invoices" element={<InvoiceList />} />
    </Routes>
  )
}