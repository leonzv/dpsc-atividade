import React, { useState, useEffect, forwardRef } from 'react'

interface FileInputProps {
  label: string
  initialImage?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
}

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({ label, initialImage, onChange, error }, ref) => {
    const [imagePreview, setImagePreview] = useState<string | undefined>(
      initialImage
    )

    useEffect(() => {
      if (initialImage) {
        setImagePreview(initialImage)
      }
    }, [initialImage])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e)
      const file = e.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    }

    const inputId = `file-input-${label.replace(/\s+/g, '').toLowerCase()}`

    return (
      <div className="flex flex-col">
        <label htmlFor={inputId} className="block mb-1">
          {label}
        </label>
        <div className="flex gap-4 items-start">
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg"
            />
          )}
          <input
            id={inputId}
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleImageChange}
            ref={ref}
            multiple={false}
            className={`flex-1  ${
              error ? 'border-red-500' : 'border-surface'
            } bg-background-light px-3 py-2 text-sm text-text-secondary`}
          />
        </div>
        {error && (
          <span className="text-red-500 text-xs mt-1 block col-span-2">
            {error}
          </span>
        )}
      </div>
    )
  }
)

FileInput.displayName = 'FileInput'
