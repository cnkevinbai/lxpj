// 日期格式化工具

export class DateFormat {
  // 格式化为 YYYY-MM-DD
  static formatDate(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // 格式化为 YYYY-MM-DD HH:mm:ss
  static formatDateTime(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hour = String(date.getHours()).padStart(2, '0')
    const minute = String(date.getMinutes()).padStart(2, '0')
    const second = String(date.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
  }

  // 格式化为 HH:mm
  static formatTime(date: Date): string {
    const hour = String(date.getHours()).padStart(2, '0')
    const minute = String(date.getMinutes()).padStart(2, '0')
    return `${hour}:${minute}`
  }

  // 格式化相对时间
  static formatRelative(date: Date): string {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor(diff / (1000 * 60))

    if (days > 0) {
      return `${days}天前`
    } else if (hours > 0) {
      return `${hours}小时前`
    } else if (minutes > 0) {
      return `${minutes}分钟前`
    } else {
      return '刚刚'
    }
  }

  // 解析日期字符串
  static parseDate(dateStr: string): Date {
    return new Date(dateStr)
  }

  // 检查是否今天
  static isToday(date: Date): boolean {
    const now = new Date()
    return date.getFullYear() === now.getFullYear() &&
           date.getMonth() === now.getMonth() &&
           date.getDate() === now.getDate()
  }

  // 检查是否本周
  static isThisWeek(date: Date): boolean {
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    return date >= oneWeekAgo
  }
}

// 导出便捷函数
export const formatDate = DateFormat.formatDate
export const formatDateTime = DateFormat.formatDateTime
export const formatTime = DateFormat.formatTime
export const formatRelative = DateFormat.formatRelative
