import { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const tagVariants = cva(
  'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 text-gray-800',
        primary: 'bg-brand-blue/10 text-brand-blue',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        error: 'bg-red-100 text-red-800',
        info: 'bg-blue-100 text-blue-800',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface TagProps extends VariantProps<typeof tagVariants> {
  children: ReactNode
  className?: string
  onClose?: () => void
}

export default function Tag({
  children,
  variant,
  size,
  className = '',
  onClose,
}: TagProps) {
  return (
    <span className={tagVariants({ variant, size, className })}>
      {children}
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 text-current hover:opacity-75"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  )
}
