import { Routes, Route } from 'react-router-dom'
import ProductionOrders from './ProductionOrders'
import ProductionPlan from './ProductionPlan'
import ProductionTask from './ProductionTask'
import PurchaseList from './PurchaseList'
import PurchaseCreate from './PurchaseCreate'
import PurchaseDetail from './PurchaseDetail'
import InventoryList from './InventoryList'
import InventoryIn from './InventoryIn'
import InventoryOut from './InventoryOut'
import QualityInspections from './QualityInspections'

// ERP 首页
const ERPHome = () => (
  <div style={{ padding: '24px' }}>
    <h1>ERP 企业资源计划</h1>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '24px' }}>
      <div style={{ padding: '24px', background: '#f0f2f5', borderRadius: '8px', textAlign: 'center' }}>
        <h3>🏭 生产管理</h3>
        <p>生产订单、生产计划、工序管理</p>
      </div>
      <div style={{ padding: '24px', background: '#f0f2f5', borderRadius: '8px', textAlign: 'center' }}>
        <h3>📦 采购管理</h3>
        <p>采购申请、采购订单、供应商</p>
      </div>
      <div style={{ padding: '24px', background: '#f0f2f5', borderRadius: '8px', textAlign: 'center' }}>
        <h3>📊 库存管理</h3>
        <p>入库、出库、调拨、盘点</p>
      </div>
      <div style={{ padding: '24px', background: '#f0f2f5', borderRadius: '8px', textAlign: 'center' }}>
        <h3>✅ 质量管理</h3>
        <p>IQC、IPQC、FQC、OQC</p>
      </div>
      <div style={{ padding: '24px', background: '#f0f2f5', borderRadius: '8px', textAlign: 'center' }}>
        <h3>🔧 设备管理</h3>
        <p>设备档案、保养、维修</p>
      </div>
      <div style={{ padding: '24px', background: '#f0f2f5', borderRadius: '8px', textAlign: 'center' }}>
        <h3>💰 成本管理</h3>
        <p>标准成本、实际成本、成本分析</p>
      </div>
    </div>
  </div>
)

const ERPModule = () => {
  return (
    <Routes>
      <Route index element={<ERPHome />} />
      
      {/* 生产管理 */}
      <Route path="production" element={<ProductionOrders />} />
      <Route path="production/plan" element={<ProductionPlan />} />
      <Route path="production/tasks" element={<ProductionTask />} />
      
      {/* 采购管理 */}
      <Route path="purchase" element={<PurchaseList />} />
      <Route path="purchase/create" element={<PurchaseCreate />} />
      <Route path="purchase/:id" element={<PurchaseDetail />} />
      
      {/* 库存管理 */}
      <Route path="inventory" element={<InventoryList />} />
      <Route path="inventory/in" element={<InventoryIn />} />
      <Route path="inventory/out" element={<InventoryOut />} />
      
      {/* 质量管理 */}
      <Route path="quality" element={<QualityInspections />} />
      
      {/* 其他模块（后续完善） */}
      <Route path="equipment" element={<div style={{padding:'24px'}}><h1>设备管理</h1><p>开发中...</p></div>} />
      <Route path="cost" element={<div style={{padding:'24px'}}><h1>成本管理</h1><p>开发中...</p></div>} />
      <Route path="assets" element={<div style={{padding:'24px'}}><h1>资产管理</h1><p>开发中...</p></div>} />
      <Route path="export" element={<div style={{padding:'24px'}}><h1>出口管理</h1><p>开发中...</p></div>} />
      <Route path="mrp" element={<div style={{padding:'24px'}}><h1>MRP 运算</h1><p>开发中...</p></div>} />
    </Routes>
  )
}

export default ERPModule
