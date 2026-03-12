// 通用响应类型
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
}

// 用户类型
export interface User {
  id: string
  username: string
  name: string
  role: string
  department: string
}

// 采购相关类型
export interface PurchaseOrder {
  id: string
  no: string
  supplierId: string
  supplierName: string
  items: PurchaseItem[]
  totalAmount: number
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  createdAt: string
  approvedAt?: string
  completedAt?: string
}

export interface PurchaseItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  amount: number
}

// 库存相关类型
export interface Inventory {
  id: string
  sku: string
  productName: string
  quantity: number
  unit: string
  location: string
  minStock: number
  maxStock: number
  lastUpdated: string
}

export interface InventoryIn {
  productId: string
  quantity: number
  batchNo: string
  supplierId: string
  location: string
}

export interface InventoryOut {
  productId: string
  quantity: number
  reason: string
  targetLocation?: string
}

// 生产相关类型
export interface ProductionPlan {
  id: string
  no: string
  productId: string
  productName: string
  quantity: number
  plannedStart: string
  plannedEnd: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
}

export interface ProductionTask {
  id: string
  planId: string
  workcenter: string
  quantity: number
  assignedTo?: string
  status: 'pending' | 'in_progress' | 'completed'
  startedAt?: string
  completedAt?: string
}

// 财务相关类型
export interface FinanceReceive {
  id: string
  no: string
  orderId: string
  orderNo: string
  customerId: string
  customerName: string
  amount: number
  method: 'bank' | 'cash' | 'wechat' | 'alipay'
  status: 'pending' | 'completed'
  receivedAt?: string
}

export interface FinancePay {
  id: string
  no: string
  purchaseOrderId?: string
  supplierId: string
  supplierName: string
  amount: number
  method: 'bank' | 'cash' | 'wechat' | 'alipay'
  status: 'pending' | 'completed'
  paidAt?: string
}

// 仪表盘统计
export interface DashboardStats {
  purchase: {
    total: number
    pending: number
    amount: number
  }
  inventory: {
    total: number
    warning: number
    turnover: number
  }
  finance: {
    receivable: number
    payable: number
    profit: number
  }
  production: {
    planned: number
    inProgress: number
    completed: number
  }
}
