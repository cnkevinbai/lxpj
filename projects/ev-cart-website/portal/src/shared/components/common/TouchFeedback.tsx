import React, { ReactNode } from 'react'

interface TouchFeedbackProps {
  children: ReactNode
  className?: string
  onTap?: () => void
}

/**
 * 触控反馈组件
 * 提供移动端触控反馈效果
 */
const TouchFeedback: React.FC<TouchFeedbackProps> = ({
  children,
  className = '',
  onTap,
}) => {
  return (
    <div
      className={`active:scale-95 active:opacity-80 transition-transform duration-150 cursor-pointer ${className}`}
      onClick={onTap}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onTap?.()
        }
      }}
    >
      {children}
    </div>
  )
}

export default TouchFeedback
