import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '../lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, type = 'text', className, ...props }, ref) => {
    const inputId = id || `input-${label?.replace(/\s+/g, '').toLowerCase()}`
    return (
      <div className="flex flex-col">
        {label && (
          <label htmlFor={inputId} className="block mb-1 text-sm text-text-secondary">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          type={type}
          {...props}
          className={cn(
            'rounded-md border',
            error ? 'border-red-500' : 'border-surface',
            'bg-background-light px-3 py-2 text-sm text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent',
            'h-10',
            className
          )}
        />
        {error && <span className="text-red-500 text-sm">{error}</span>}
      </div>
    )
  }
)

Input.displayName = 'Input'
