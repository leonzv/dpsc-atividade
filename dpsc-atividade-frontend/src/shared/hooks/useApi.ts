import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiError } from '../types/api.types'
import { useAuth } from '../../modules/auth/hooks/useAuth'

export const useApi = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleError = useCallback(
    async (error: ApiError) => {
      if (error.status === 401) {
        await logout()
        navigate('/login')
      }
      throw error
    },
    [logout, navigate]
  )

  return { handleError }
}
