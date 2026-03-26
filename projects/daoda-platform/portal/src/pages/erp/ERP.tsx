/**
 * ERP 运营管理模块路由
 * 包含采购、库存、生产、产品、BOM、生产计划
 */
import { Routes, Route, Navigate } from 'react-router-dom'
import ERPDashboard from './ERPDashboard'
import PurchaseList from './PurchaseList'
import InventoryList from './InventoryList'
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
      <Route path="inventory" element={<InventoryList />} />
      <Route path="production" element={<ProductionList />} />
      <Route path="products" element={<ProductList />} />
      <Route path="products/:id" element={<ProductDetail />} />
      <Route path="bom" element={<BomList />} />
      <Route path="production-plans" element={<ProductionPlanList />} />
    </Routes>
  )
}