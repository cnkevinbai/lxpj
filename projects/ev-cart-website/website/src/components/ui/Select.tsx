'use client'

import { SelectHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const selectVariants = cva(
  'w-full px-4 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-gray-50 disabled:cursor-not-allowed',
  {
    variants: {
      state: {
        default: 'border-gray-300 focus:border-brand-blue focus:ring-brand-blue/20',
        error: 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
        success: 'border-green-500 focus:border-green-500 focus:ring-green-500/20',
      },
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

export interface SelectProps 
  extends SelectHTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof selectVariants> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      state,
      size,
      options,
      className = '',
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const selectState = error ? 'error' : state
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}

        <select
          ref={ref}
          id={selectId}
          className={selectVariants({ state: selectState, size, className })}
          disabled={disabled}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export { Select, selectVariants }
export default Select
