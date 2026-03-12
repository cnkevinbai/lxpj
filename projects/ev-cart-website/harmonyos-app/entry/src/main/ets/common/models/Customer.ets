// 客户数据模型
export interface Customer {
  id: string
  customerCode: string
  customerName: string
  contactPerson: string
  contactPhone: string
  contactEmail: string
  province: string
  city: string
  level: 'A' | 'B' | 'C'
  status: 'active' | 'inactive' | 'potential'
  totalOrders: number
  totalAmount: number
  createdAt: string
}

// 订单数据模型
export interface Order {
  id: string
  orderCode: string
  customerName: string
  orderDate: string
  totalAmount: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  paymentStatus: 'unpaid' | 'paid'
}

// 库存数据模型
export interface Inventory {
  id: string
  productCode: string
  productName: string
  category: string
  quantity: number
  safeStock: number
  unit: string
  warehouseName: string
  status: 'normal' | 'low' | 'out'
}

// 财务数据模型
export interface FinanceStats {
  totalRevenue: number
  totalExpense: number
  totalProfit: number
  avgMargin: number
}

// 用户数据模型
export interface User {
  id: string
  username: string
  realName: string
  role: Role
}

export interface Role {
  roleCode: string
  roleName: string
}

// 登录结果
export interface LoginResult {
  access_token: string
  user: User
}

// 仪表盘统计
export interface DashboardStats {
  totalCustomers: number
  totalOrders: number
  totalRevenue: number
  pendingTasks: number
}

// 快捷操作
export interface QuickAction {
  icon: string
  title: string
  path: string
  color: string
}
