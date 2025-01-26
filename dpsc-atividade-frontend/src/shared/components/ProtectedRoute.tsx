import { FC } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../modules/auth/hooks/useAuth'

interface ProtectedRouteProps {
  children: JSX.Element
  requiredRoles?: string[]
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  requiredRoles
}) => {
  const { user, token } = useAuth()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(
      (role) =>
        user?.roles?.includes(role) || (role === 'admin' && user?.is_staff)
    )
    if (!hasRequiredRole) {
      return <Navigate to="/" replace />
    }
  }

  return children
}
