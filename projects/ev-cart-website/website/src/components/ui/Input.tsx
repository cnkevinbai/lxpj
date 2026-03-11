import { InputHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

/**
 * 输入框组件 - 符合大厂设计规范
 * 
 * 设计原则:
 * - 清晰：明确的标签和提示
 * - 反馈：实时的验证状态
 * - 可访问：支持键盘操作
 * - 一致：统一的视觉风格
 */

const inputVariants = cva(
  // 基础样式
  'w-full px-4 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-gray-50 disabled:cursor-not-allowed',
  {
    variants: {
      // 状态
      state: {
        default: 'border-gray-300 focus:border-brand-blue focus:ring-brand-blue/20',
        error: 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
        success: 'border-green-500 focus:border-green-500 focus:ring-green-500/20',
      },
      // 尺寸
      size: {
        sm: 'px-3 py-1.5 text-sm min-h-[36px]',
        md: 'px-4 py-2 text-base min-h-[40px]',
        lg: 'px-6 py-3 text-lg min-h-[44px]',
      },
    },
    defaultVariants: {
      state: 'default',
      size: 'md',
    },
  }
)

export interface InputProps 
  extends InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string
  error?: string
  success?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      success,
      leftIcon,
      rightIcon,
      state,
      size,
      className = '',
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputState = error ? 'error' : success ? 'success' : state
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className="w-full">
        {/* 标签 */}
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}

        {/* 输入框容器 */}
        <div className="relative">
          {/* 左侧图标 */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}

          {/* 输入框 */}
          <input
            ref={ref}
            id={inputId}
            className={inputVariants({ state: inputState, size, className })}
            disabled={disabled}
            {...props}
            style={{ paddingLeft: leftIcon ? '2.75rem' : undefined, paddingRight: rightIcon ? '2.75rem' : undefined }}
          />

          {/* 右侧图标 */}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {/* 错误提示 */}
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}

        {/* 成功提示 */}
        {success && (
          <p className="mt-1 text-sm text-green-600">{success}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input, inputVariants }
export default Input
