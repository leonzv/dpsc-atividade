import { useState } from 'react'

export const useImageUpload = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined)

  const handleFileChange = (file: File) => {
    setSelectedFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const resetImage = () => {
    setSelectedFile(undefined)
    setImagePreview(null)
  }

  return {
    imagePreview,
    selectedFile,
    handleFileChange,
    resetImage,
    setImagePreview
  }
}
