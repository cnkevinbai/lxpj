'use client'

import { Fragment, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const modalVariants = cva(
  'fixed inset-0 z-50 flex items-center justify-center',
  {
    variants: {
      size: {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-full mx-4',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

export interface ModalProps extends VariantProps<typeof modalVariants> {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  footer?: ReactNode
  showClose?: boolean
  closeOnOverlay?: boolean
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size,
  showClose = true,
  closeOnOverlay = true,
}: ModalProps) {
  if (!isOpen) return null

  const handleOverlayClick = () => {
    if (closeOnOverlay) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={handleOverlayClick}
      />

      {/* 模态框 */}
      <div className={modalVariants({ size })}>
        <div className="relative bg-white rounded-xl shadow-xl w-full m-4">
          {/* 头部 */}
          {(title || showClose) && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              {title && (
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              )}
              {showClose && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* 内容 */}
          <div className="px-6 py-4">{children}</div>

          {/* 底部 */}
          {footer && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
