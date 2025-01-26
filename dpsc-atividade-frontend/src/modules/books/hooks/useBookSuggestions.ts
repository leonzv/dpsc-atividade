import { useState, useRef, useCallback } from 'react'
import { bookService } from '../services/bookService'
import toast from 'react-hot-toast'
import { CreateBookDTO } from '../types/book.types'
import { formatApiErrors } from '../../../shared/utils/formatApiErrors'

export const useBookSuggestions = () => {
  const [suggestions, setSuggestions] = useState<CreateBookDTO[]>([])
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  const handleSuggestions = useCallback((formData: CreateBookDTO) => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current)

    debounceTimeout.current = setTimeout(async () => {
      try {
        if (formData.title.trim()) {
          const found = await bookService.searchSuggestions(formData)
          setSuggestions(found)
        } else {
          setSuggestions([])
        }
      } catch (err) {
        const { genericError } = formatApiErrors(err)
        toast.error(genericError)
      }
    }, 500)
  }, [])

  return {
    suggestions,
    setSuggestions,
    handleSuggestions
  }
}
