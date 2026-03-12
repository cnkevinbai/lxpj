// 常量定义

// API 配置
export const API_CONFIG = {
  BASE_URL: 'https://api.evcart.com/api/v1',
  TIMEOUT: 30000,
}

// 存储键名
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  USER_INFO: 'user_info',
  SETTINGS: 'settings',
}

// 路由路径
export const ROUTES = {
  LOGIN: '/pages/Login',
  INDEX: '/pages/Index',
  CUSTOMERS: '/pages/Customers',
  CUSTOMER_DETAIL: '/pages/CustomerDetail',
  ORDERS: '/pages/Orders',
  ORDER_DETAIL: '/pages/OrderDetail',
  INVENTORY: '/pages/Inventory',
  FINANCE: '/pages/Finance',
  PROFILE: '/pages/Profile',
}

// 颜色配置
export const COLORS = {
  PRIMARY: '#1890ff',
  SUCCESS: '#52c41a',
  WARNING: '#faad14',
  ERROR: '#ff4d4f',
  TEXT_PRIMARY: '#333333',
  TEXT_SECONDARY: '#666666',
  TEXT_DISABLED: '#999999',
  BORDER: '#d9d9d9',
  BACKGROUND: '#f5f5f5',
}

// 字体配置
export const FONTS = {
  SIZE_SMALL: 12,
  SIZE_NORMAL: 14,
  SIZE_MEDIUM: 16,
  SIZE_LARGE: 18,
  SIZE_XLARGE: 20,
  SIZE_TITLE: 24,
}

// 间距配置
export const SPACING = {
  SMALL: 8,
  NORMAL: 16,
  MEDIUM: 24,
  LARGE: 32,
}

// 客户级别
export const CUSTOMER_LEVELS = {
  A: { label: 'A 级 - 重点客户', color: '#ff4d4f' },
  B: { label: 'B 级 - 普通客户', color: '#1890ff' },
  C: { label: 'C 级 - 潜在客户', color: '#d9d9d9' },
}

// 订单状态
export const ORDER_STATUS = {
  PENDING: { label: '待处理', color: '#faad14' },
  PROCESSING: { label: '处理中', color: '#1890ff' },
  COMPLETED: { label: '已完成', color: '#52c41a' },
  CANCELLED: { label: '已取消', color: '#ff4d4f' },
}

// 库存状态
export const STOCK_STATUS = {
  NORMAL: { label: '正常', color: '#52c41a' },
  LOW: { label: '库存不足', color: '#faad14' },
  OUT: { label: '缺货', color: '#ff4d4f' },
}
