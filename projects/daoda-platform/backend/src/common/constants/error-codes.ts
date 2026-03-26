// 系统级错误码 (1xxxxx)
export const SystemErrors = {
  UNKNOWN_ERROR: { code: 100000, message: '未知错误' },
  SERVICE_UNAVAILABLE: { code: 100001, message: '服务不可用' },
  DATABASE_ERROR: { code: 100002, message: '数据库错误' },
}

// 认证错误码 (2xxxxx)
export const AuthErrors = {
  UNAUTHORIZED: { code: 200001, message: '未授权访问' },
  TOKEN_EXPIRED: { code: 200002, message: 'Token已过期' },
  TOKEN_INVALID: { code: 200003, message: 'Token无效' },
  LOGIN_FAILED: { code: 200004, message: '登录失败' },
  ACCOUNT_DISABLED: { code: 200005, message: '账号已禁用' },
}

// 参数错误码 (3xxxxx)
export const ParamErrors = {
  INVALID_PARAM: { code: 300001, message: '参数错误' },
  MISSING_PARAM: { code: 300002, message: '缺少参数' },
  PARAM_TYPE_ERROR: { code: 300003, message: '参数类型错误' },
}

// 业务错误码 (4xxxxx)
export const BusinessErrors = {
  NOT_FOUND: { code: 400001, message: '资源不存在' },
  ALREADY_EXISTS: { code: 400002, message: '资源已存在' },
  OPERATION_FAILED: { code: 400003, message: '操作失败' },
  PERMISSION_DENIED: { code: 400004, message: '权限不足' },
}

// CRM 错误码 (5xxxxx)
export const CRMErrors = {
  CUSTOMER_NOT_FOUND: { code: 500001, message: '客户不存在' },
  LEAD_NOT_FOUND: { code: 500002, message: '线索不存在' },
  OPPORTUNITY_NOT_FOUND: { code: 500003, message: '商机不存在' },
  ORDER_NOT_FOUND: { code: 500004, message: '订单不存在' },
}

// ERP 错误码 (6xxxxx)
export const ERPErrors = {
  PRODUCT_NOT_FOUND: { code: 600001, message: '产品不存在' },
  INVENTORY_NOT_FOUND: { code: 600002, message: '库存不存在' },
  INSUFFICIENT_STOCK: { code: 600003, message: '库存不足' },
}
