import React, { useState, useEffect, forwardRef } from 'react'
import { Upload } from 'lucide-react'

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
        <label htmlFor={inputId} className="block mb-1 text-sm text-text-secondary">
          {label}
        </label>
        <div className="flex gap-4 items-start">
          {imagePreview ? (
            <div className="relative group">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-24 h-32 object-cover rounded-lg border border-border"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                <span className="text-white text-sm">Alterar imagem</span>
              </div>
            </div>
          ) : null}
          <div className="flex-1">
            <label
              htmlFor={inputId}
              className={`
                flex flex-col items-center justify-center w-full h-32
                border-2 border-dashed rounded-lg cursor-pointer
                transition-colors duration-200
                ${error ? 'border-red-500 bg-red-50' : 'border-border hover:border-accent'}
                ${imagePreview ? 'bg-background' : 'bg-background-light'}
              `}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-text-secondary" />
                <p className="text-sm text-text-secondary">
                  {imagePreview ? 'Trocar imagem' : 'Enviar imagem'}
                </p>
                <p className="text-xs text-text-tertiary mt-1">
                  PNG ou JPG
                </p>
              </div>
              <input
                id={inputId}
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleImageChange}
                ref={ref}
                className="hidden"
              />
            </label>
            {error && (
              <span className="text-red-500 text-xs mt-1 block">
                {error}
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }
)

FileInput.displayName = 'FileInput'
