import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider, theme } from 'antd'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import PurchaseList from './pages/purchase/PurchaseList'
import PurchaseCreate from './pages/purchase/PurchaseCreate'
import PurchaseDetail from './pages/purchase/PurchaseDetail'
import InventoryList from './pages/inventory/InventoryList'
import InventoryIn from './pages/inventory/InventoryIn'
import InventoryOut from './pages/inventory/InventoryOut'
import ProductionPlan from './pages/production/ProductionPlan'
import ProductionTask from './pages/production/ProductionTask'
import FinanceOverview from './pages/finance/FinanceOverview'
import FinanceReceive from './pages/finance/FinanceReceive'
import FinancePay from './pages/finance/FinancePay'

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 6,
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* 采购管理 */}
            <Route path="purchase" element={<PurchaseList />} />
            <Route path="purchase/create" element={<PurchaseCreate />} />
            <Route path="purchase/:id" element={<PurchaseDetail />} />
            
            {/* 库存管理 */}
            <Route path="inventory" element={<InventoryList />} />
            <Route path="inventory/in" element={<InventoryIn />} />
            <Route path="inventory/out" element={<InventoryOut />} />
            
            {/* 生产管理 */}
            <Route path="production/plan" element={<ProductionPlan />} />
            <Route path="production/task" element={<ProductionTask />} />
            
            {/* 财务管理 */}
            <Route path="finance" element={<FinanceOverview />} />
            <Route path="finance/receive" element={<FinanceReceive />} />
            <Route path="finance/pay" element={<FinancePay />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
