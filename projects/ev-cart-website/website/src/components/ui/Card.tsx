import { HTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

/**
 * 卡片组件 - 符合大厂设计规范
 * 
 * 设计原则:
 * - 层次分明：清晰的视觉层次
 * - 简洁优雅：去除多余装饰
 * - 交互友好：Hover 状态反馈
 * - 响应式：适配多端屏幕
 */

const cardVariants = cva(
  // 基础样式
  'bg-white rounded-xl transition-all duration-200',
  {
    variants: {
      // 变体
      variant: {
        default: 'shadow-sm hover:shadow-md border border-gray-100',
        elevated: 'shadow-md hover:shadow-lg',
        outlined: 'border-2 border-gray-200',
        ghost: 'bg-transparent shadow-none',
      },
      // 尺寸
      size: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
      // 可点击
      clickable: {
        true: 'cursor-pointer hover:scale-[1.02]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface CardProps 
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  clickable?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant,
      size,
      clickable,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cardVariants({ variant, size, clickable, className })}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

/**
 * 卡片头部组件
 */
const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      className={`px-6 py-4 border-b border-gray-100 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
)

CardHeader.displayName = 'CardHeader'

/**
 * 卡片内容组件
 */
const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={`px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  )
)

CardContent.displayName = 'CardContent'

/**
 * 卡片底部组件
 */
const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      className={`px-6 py-4 border-t border-gray-100 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
)

CardFooter.displayName = 'CardFooter'

export { Card, cardVariants, CardHeader, CardContent, CardFooter }
export default Card
