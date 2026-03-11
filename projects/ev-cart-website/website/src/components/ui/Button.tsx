import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

/**
 * 按钮组件 - 符合大厂设计规范
 * 
 * 设计原则:
 * - 一致性：统一的视觉语言
 * - 可用性：清晰的交互反馈
 * - 可访问性：支持键盘操作
 * - 响应式：适配多端屏幕
 */

const buttonVariants = cva(
  // 基础样式
  'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      // 变体
      variant: {
        primary: 'bg-brand-blue text-white hover:bg-blue-700 focus:ring-brand-blue shadow-sm hover:shadow-md',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
        outline: 'border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white focus:ring-brand-blue',
        ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
      },
      // 尺寸
      size: {
        sm: 'px-3 py-1.5 text-sm min-h-[36px] min-w-[36px]',
        md: 'px-4 py-2 text-base min-h-[40px] min-w-[40px]',
        lg: 'px-6 py-3 text-lg min-h-[44px] min-w-[44px]',
        xl: 'px-8 py-4 text-xl min-h-[48px] min-w-[48px]',
      },
      // 加载状态
      loading: {
        true: 'cursor-wait pointer-events-none',
      },
      // 全宽
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps 
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant,
      size,
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, loading, fullWidth, className })}
        disabled={disabled || loading}
        {...props}
      >
        {/* 加载动画 */}
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        
        {/* 左侧图标 */}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        
        {/* 按钮文字 */}
        {children}
        
        {/* 右侧图标 */}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
export default Button
