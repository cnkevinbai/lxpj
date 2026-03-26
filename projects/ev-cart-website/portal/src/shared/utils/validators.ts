/**
 * 验证工具函数
 */

/**
 * 验证手机号
 */
export const validatePhone = (phone: string): boolean => {
  return /^1[3-9]\d{9}$/.test(phone)
}

/**
 * 验证邮箱
 */
export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * 验证身份证号
 */
export const validateIdCard = (idCard: string): boolean => {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idCard)
}

/**
 * 验证URL
 */
export const validateUrl = (url: string): boolean => {
  return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(url)
}

/**
 * 验证密码强度
 */
export const validatePassword = (password: string): { valid: boolean; strength: 'weak' | 'medium' | 'strong' } => {
  let strength: 'weak' | 'medium' | 'strong' = 'weak'
  
  if (password.length >= 6) {
    strength = 'medium'
  }
  
  if (password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password)) {
    strength = 'strong'
  }
  
  return {
    valid: password.length >= 6,
    strength,
  }
}

/**
 * 验证必填
 */
export const validateRequired = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0
  }
  return value !== null && value !== undefined
}

/**
 * 验证长度
 */
export const validateLength = (value: string, min: number, max: number): boolean => {
  return value.length >= min && value.length <= max
}

/**
 * 验证范围
 */
export const validateRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max
}

/**
 * 验证自定义规则
 */
export const validateCustom = (value: any, rule: (value: any) => boolean): boolean => {
  return rule(value)
}
