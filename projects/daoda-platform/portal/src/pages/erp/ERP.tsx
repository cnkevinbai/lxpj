/**
 * ERP 运营管理模块路由
 * 包含采购、库存、生产、产品、BOM、生产计划、供应商、库存调拨、库存盘点、质检管理
 */
import { Routes, Route, Navigate } from 'react-router-dom'
import ERPDashboard from './ERPDashboard'
import PurchaseList from './PurchaseList'
import SupplierManagement from './SupplierManagement'
import InventoryList from './InventoryList'
import InventoryWarning from './InventoryWarning'
import InventoryTransfer from './InventoryTransfer'
import InventoryCheck from './InventoryCheck'
import QualityInspection from './QualityInspection'
import ProductionList from './ProductionList'
import ProductList from './ProductList'
import ProductDetail from './ProductDetail'
import BomList from './BomList'
import ProductionPlanList from './ProductionPlanList'

export default function ERP() {
  return (
    <Routes>
      <Route index element={<ERPDashboard />} />
      <Route path="purchase" element={<PurchaseList />} />
      <Route path="suppliers" element={<SupplierManagement />} />
      <Route path="inventory" element={<InventoryList />} />
      <Route path="inventory-warning" element={<InventoryWarning />} />
      <Route path="inventory-transfer" element={<InventoryTransfer />} />
      <Route path="inventory-check" element={<InventoryCheck />} />
      <Route path="quality-inspection" element={<QualityInspection />} />
      <Route path="production" element={<ProductionList />} />
      <Route path="products" element={<ProductList />} />
      <Route path="products/:id" element={<ProductDetail />} />
      <Route path="bom" element={<BomList />} />
      <Route path="production-plans" element={<ProductionPlanList />} />
    </Routes>
  )
}