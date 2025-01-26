import { Path, UseFormSetError } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { formatApiErrors } from '../utils/formatApiErrors'
import { ApiError } from '../types/api.types'

export const useFormError = <T extends Record<string, unknown>>(
  setError: UseFormSetError<T>
) => {
  const handleError = (error: unknown) => {
    const { fieldErrors, genericError } = formatApiErrors(error as ApiError)

    if (fieldErrors) {
      Object.entries(fieldErrors).forEach(([field, message]) => {
        return setError(field as Path<T>, {
          type: 'manual',
          message
        })
      })
      const firstError = Object.values(fieldErrors)[0]
      if (firstError) {
        toast.error(firstError)
      }
    } else if (genericError) {
      toast.error(genericError)
    }
  }

  return { handleError }
}
