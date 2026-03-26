// ERP 类型定义
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

export interface PurchaseOrder {
  id?: string
  orderNumber?: string
  supplierId?: string
  supplierName?: string
  amount?: number
  totalAmount?: number
  status?: string
  createdAt?: string
  no?: string
  items?: { productId: string; productName: string; quantity: number; unitPrice: number; amount: number }[]
}

export interface ProductionOrder {
  id?: string
  orderNumber?: string
  productName?: string
  quantity?: number
  status?: string
}

export interface ProductionPlan {
  id?: string
  orderNumber?: string
  planNumber?: string
  productId?: string
  productName?: string
  quantity?: number
  startDate?: string
  endDate?: string
  status?: string
  no?: string
  plannedStart?: string
  plannedEnd?: string
}

export interface ProductionTask {
  id?: string
  orderNumber?: string
  taskNumber?: string
  planId?: string
  productName?: string
  quantity?: number
  status?: string
  assignee?: string
  workcenter?: string
  startedAt?: string
  completedAt?: string
  assignedTo?: string
}

export interface Delivery {
  id?: string
  deliveryNumber?: string
  customerName?: string
  address?: string
  status?: string
  estimatedDate?: string
}

export interface CreditRecord {
  id?: string
  customerId?: string
  customerName?: string
  creditLimit?: number
  used?: number
  available?: number
  status?: string
  lastUpdated?: string
}
