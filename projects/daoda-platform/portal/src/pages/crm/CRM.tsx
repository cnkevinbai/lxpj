/**
 * CRM 客户管理模块路由
 */
import { Routes, Route } from 'react-router-dom'
import CRMDashboard from './CRMDashboard'
import CustomerList from './CustomerList'
import CustomerDetail from './CustomerDetail'
import CustomerPool from './CustomerPool'
import CustomerFollowUp from './CustomerFollowUp'
import LeadList from './LeadList'
import LeadDetail from './LeadDetail'
import LeadScoring from './LeadScoring'
import OpportunityList from './OpportunityList'
import OpportunityDetail from './OpportunityDetail'
import OpportunityFunnel from './OpportunityFunnel'
import OrderList from './OrderList'
import OrderDetail from './OrderDetail'
import QuotationList from './QuotationList'
import SalesPrediction from './SalesPrediction'
import SalesPerformance from './SalesPerformance'

export default function CRM() {
  return (
    <Routes>
      <Route index element={<CRMDashboard />} />
      <Route path="customers" element={<CustomerList />} />
      <Route path="customers/:id" element={<CustomerDetail />} />
      <Route path="pool" element={<CustomerPool />} />
      <Route path="follow-ups" element={<CustomerFollowUp />} />
      <Route path="leads" element={<LeadList />} />
      <Route path="leads/:id" element={<LeadDetail />} />
      <Route path="lead-scoring" element={<LeadScoring />} />
      <Route path="opportunities" element={<OpportunityList />} />
      <Route path="opportunities/:id" element={<OpportunityDetail />} />
      <Route path="funnel" element={<OpportunityFunnel />} />
      <Route path="orders" element={<OrderList />} />
      <Route path="orders/:id" element={<OrderDetail />} />
      <Route path="quotations" element={<QuotationList />} />
      <Route path="prediction" element={<SalesPrediction />} />
      <Route path="performance" element={<SalesPerformance />} />
    </Routes>
  )
}