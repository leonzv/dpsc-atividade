import { TextareaHTMLAttributes, forwardRef } from 'react'

interface TextAreaInputProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export const TextAreaInput = forwardRef<
  HTMLTextAreaElement,
  TextAreaInputProps
>(({ label, error, id, ...props }, ref) => {
  const inputId = id || `input-${label.replace(/\s+/g, '').toLowerCase()}`
  return (
    <div className="flex flex-col">
      <label htmlFor={inputId} className="block mb-1">
        {label}
      </label>
      <textarea
        id={inputId}
        ref={ref}
        {...props}
        className={`rounded-md border ${
          error ? 'border-red-500' : 'border-surface'
        } bg-background-light px-3 py-2 text-sm text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent`}
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  )
})

TextAreaInput.displayName = 'TextAreaInput'
