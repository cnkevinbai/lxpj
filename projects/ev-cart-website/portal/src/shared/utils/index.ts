// 路由守卫 - 检查登录状态
export const checkAuth = () => {
  const token = localStorage.getItem('access_token')
  if (!token) {
    return false
  }
  return true
}

// 检查权限
export const checkPermission = (requiredPermission: string) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const permissions = user.role?.permissions || []
  
  // 超级管理员拥有所有权限
  if (user.role?.roleCode === 'admin') {
    return true
  }
  
  return permissions.includes(requiredPermission) || permissions.includes('*')
}

// 格式化日期
export const formatDate = (date: string | Date) => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 格式化日期时间
export const formatDateTime = (date: string | Date) => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}`
}

// 格式化金额
export const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
  }).format(amount)
}

// 防抖函数
export const debounce = (fn: Function, delay: number) => {
  let timer: NodeJS.Timeout
  return (...args: any[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

// 节流函数
export const throttle = (fn: Function, interval: number) => {
  let lastTime = 0
  return (...args: any[]) => {
    const now = Date.now()
    if (now - lastTime >= interval) {
      lastTime = now
      fn(...args)
    }
  }
}
