/**
 * 实时表单验证 Hook
 * 渔晓白 ⚙️ · 专业交付
 */

import { useState, useCallback } from 'react'

interface ValidationRule {
  required?: boolean
  min?: number
  max?: number
  pattern?: RegExp
  validator?: (value: any) => string | null
  message?: string
}

interface ValidationState {
  value: any
  error: string | null
  touched: boolean
  validating: boolean
}

export function useRealTimeValidation<T = any>(
  initialValue: T = '' as T,
  rules: ValidationRule[] = []
) {
  const [state, setState] = useState<ValidationState>({
    value: initialValue,
    error: null,
    touched: false,
    validating: false
  })

  // 验证单个值
  const validate = useCallback((value: any, rules: ValidationRule[]): string | null => {
    for (const rule of rules) {
      // 必填验证
      if (rule.required && !value) {
        return rule.message || '此项为必填项'
      }

      // 最小长度
      if (rule.min !== undefined && String(value).length < rule.min) {
        return rule.message || `至少需要${rule.min}个字符`
      }

      // 最大长度
      if (rule.max !== undefined && String(value).length > rule.max) {
        return rule.message || `最多${rule.max}个字符`
      }

      // 正则验证
      if (rule.pattern && !rule.pattern.test(value)) {
        return rule.message || '格式不正确'
      }

      // 自定义验证器
      if (rule.validator) {
        const error = rule.validator(value)
        if (error) return error
      }
    }

    return null
  }, [])

  // 设置值并验证
  const setValue = useCallback((value: any) => {
    setState(prev => ({
      ...prev,
      value,
      touched: true,
      error: validate(value, rules)
    }))
  }, [rules, validate])

  // 手动验证
  const validateField = useCallback(() => {
    const error = validate(state.value, rules)
    setState(prev => ({
      ...prev,
      touched: true,
      error
    }))
    return !error
  }, [state.value, rules, validate])

  // 重置
  const reset = useCallback(() => {
    setState({
      value: initialValue,
      error: null,
      touched: false,
      validating: false
    })
  }, [initialValue])

  return {
    value: state.value,
    error: state.error,
    touched: state.touched,
    validating: state.validating,
    setValue,
    validateField,
    reset,
    isValid: !state.error
  }
}

export default useRealTimeValidation
