/**
 * CRM 客户管理模块路由
 */
import { Routes, Route } from 'react-router-dom'
import CRMDashboard from './CRMDashboard'
import CustomerList from './CustomerList'
import CustomerDetail from './CustomerDetail'
import LeadList from './LeadList'
import LeadDetail from './LeadDetail'
import OpportunityList from './OpportunityList'
import OpportunityDetail from './OpportunityDetail'
import OrderList from './OrderList'
import OrderDetail from './OrderDetail'
import QuotationList from './QuotationList'

export default function CRM() {
  return (
    <Routes>
      <Route index element={<CRMDashboard />} />
      <Route path="customers" element={<CustomerList />} />
      <Route path="customers/:id" element={<CustomerDetail />} />
      <Route path="leads" element={<LeadList />} />
      <Route path="leads/:id" element={<LeadDetail />} />
      <Route path="opportunities" element={<OpportunityList />} />
      <Route path="opportunities/:id" element={<OpportunityDetail />} />
      <Route path="orders" element={<OrderList />} />
      <Route path="orders/:id" element={<OrderDetail />} />
      <Route path="quotations" element={<QuotationList />} />
    </Routes>
  )
}