/**
 * 验证工具类
 * 道达智能 CRM+ERP 移动办公平台
 * 渔晓白 ⚙️ · 专业交付
 */

export class ValidateUtils {
  /**
   * 验证手机号
   */
  static validatePhone(phone: string): boolean {
    return /^1[3-9]\d{9}$/.test(phone)
  }

  /**
   * 验证邮箱
   */
  static validateEmail(email: string): boolean {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
  }

  /**
   * 验证身份证
   */
  static validateIdCard(id: string): boolean {
    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(id)
  }

  /**
   * 验证必填
   */
  static validateRequired(value: any): boolean {
    if (typeof value === 'string') return value.trim().length > 0
    if (typeof value === 'number') return !isNaN(value)
    if (Array.isArray(value)) return value.length > 0
    return !!value
  }

  /**
   * 验证长度
   */
  static validateLength(value: string, min?: number, max?: number): boolean {
    if (min !== undefined && value.length < min) return false
    if (max !== undefined && value.length > max) return false
    return true
  }

  /**
   * 验证密码强度
   */
  static validatePassword(password: string): { valid: boolean, strength: 'weak' | 'medium' | 'strong' } {
    if (password.length < 6) return { valid: false, strength: 'weak' }

    let strength = 0
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^a-zA-Z0-9]/.test(password)) strength++

    if (strength <= 1) return { valid: false, strength: 'weak' }
    if (strength <= 3) return { valid: true, strength: 'medium' }
    return { valid: true, strength: 'strong' }
  }
}

export default ValidateUtils
