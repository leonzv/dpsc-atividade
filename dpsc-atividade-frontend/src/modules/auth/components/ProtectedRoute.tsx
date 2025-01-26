import { Navigate, useLocation } from 'react-router-dom'
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner'
import { useAuth } from '../hooks/useAuth'

type ProtectedRouteProps = {
  children: JSX.Element
  allowUnauthorized?: boolean
}

export const ProtectedRoute = ({
  children,
  allowUnauthorized = false
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <LoadingSpinner />
  }

  if (allowUnauthorized) {
    return children
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
