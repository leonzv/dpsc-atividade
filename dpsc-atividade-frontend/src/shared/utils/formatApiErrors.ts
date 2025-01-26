import { AxiosError } from 'axios'
import { ApiErrorResponse } from '../types/api.types'

export const formatApiErrors = (
  error: unknown
): {
  fieldErrors?: Record<string, string>
  genericError: string
} => {
  if (error instanceof AxiosError) {
    const errorData = error.response?.data as ApiErrorResponse | undefined

    if (
      errorData?.error?.message &&
      typeof errorData.error.message === 'object'
    ) {
      const fieldErrors: Record<string, string> = {}
      Object.entries(errorData.error.message).forEach(([field, messages]) => {
        if (Array.isArray(messages)) {
          fieldErrors[field] = messages[0]
        }
      })

      if (Object.keys(fieldErrors).length > 0) {
        return {
          fieldErrors,
          genericError: 'Corrija os erros nos campos destacados'
        }
      }
    }

    return {
      genericError:
        typeof errorData?.error?.message === 'string'
          ? errorData.error.message
          : 'Erro desconhecido'
    }
  }

  return { genericError: 'Erro desconhecido' }
}
