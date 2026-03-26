import dayjs from 'dayjs'

/**
 * 格式化工具函数
 */

/**
 * 格式化日期
 */
export const formatDate = (date: string | Date, format: string = 'YYYY-MM-DD'): string => {
  return dayjs(date).format(format)
}

/**
 * 格式化金额
 */
export const formatCurrency = (amount: number, currency: string = 'CNY'): string => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * 格式化数字 (带单位)
 */
export const formatNumber = (num: number): string => {
  if (num >= 100000000) {
    return `${(num / 100000000).toFixed(2)}亿`
  }
  if (num >= 10000) {
    return `${(num / 10000).toFixed(2)}万`
  }
  return num.toString()
}

/**
 * 格式化手机号
 */
export const formatPhone = (phone: string): string => {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/**
 * 格式化邮箱
 */
export const formatEmail = (email: string): string => {
  const [username, domain] = email.split('@')
  if (!domain) return email
  const masked = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1)
  return `${masked}@${domain}`
}

/**
 * 格式化百分比
 */
export const formatPercent = (value: number, decimals: number = 2): string => {
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * 格式化文件大小
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

/**
 * 格式化时间差
 */
export const formatTimeDiff = (date: string | Date): string => {
  const now = dayjs()
  const target = dayjs(date)
  const diff = now.diff(target, 'second')

  if (diff < 60) return '刚刚'
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`
  if (diff < 604800) return `${Math.floor(diff / 86400)}天前`
  return formatDate(date)
}
