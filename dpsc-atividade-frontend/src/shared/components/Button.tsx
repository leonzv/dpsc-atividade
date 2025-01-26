import { ButtonHTMLAttributes, forwardRef } from 'react'
import { LoadingSpinner } from './LoadingSpinner'
import { cn } from '../lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, children, variant = 'default', isLoading, disabled, ...props },
    ref
  ) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors min-h-[40px]',
          'focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          variant === 'default' &&
            'bg-accent text-text-inverted hover:bg-accent-hover px-4 py-2',
          variant === 'outline' &&
            'border border-surface hover:bg-surface hover:text-accent bg-transparent py-1 px-3',
          variant === 'ghost' &&
            'hover:bg-surface hover:text-accent bg-transparent',
          isLoading && 'opacity-70 pointer-events-none',
          className
        )}
        ref={ref}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center">
            <div className="scale-50">
              <LoadingSpinner />
            </div>
          </div>
        ) : (
          children
        )}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button }
