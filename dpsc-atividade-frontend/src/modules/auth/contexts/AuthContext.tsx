import { createContext, useCallback, useState, FC, ReactNode } from 'react'

import { authService } from '../services/auth.service'
import { LoginCredentials, RegisterCredentials } from '../types/auth.types'
import { AuthRepository, AuthState } from '../types/auth.types'

export interface AuthContextData extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  isLoggedIn: boolean
  register: (credentials: RegisterCredentials) => Promise<void>
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider: FC<{
  children: ReactNode
  repository?: AuthRepository
}> = ({ children, repository = authService }) => {
  const [state, setState] = useState<AuthState>(() => {
    const token = repository.getStoredToken()
    const storedUser = localStorage.getItem('@BookCatalog:user')
    return {
      user: storedUser ? JSON.parse(storedUser) : null,
      token,
      loading: false,
      error: null
    }
  })

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      try {
        const { user, token } = await repository.login(credentials)
        localStorage.setItem('@BookCatalog:user', JSON.stringify(user))
        setState({ user, token, loading: false, error: null })
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'Erro ao fazer login'
        }))
        throw err
      }
    },
    [repository]
  )

  const logout = useCallback(async () => {
    await repository.logout()
    localStorage.removeItem('@BookCatalog:user')
    setState((prev) => ({
      ...prev,
      user: null,
      token: null,
      error: null
    }))
  }, [repository, setState])

  const checkAuth = useCallback(async () => {
    const token = repository.getStoredToken()
    if (!token) {
      localStorage.removeItem('@BookCatalog:user')
      setState((prev) => ({ ...prev, user: null, loading: false }))
      return
    }

    try {
      const user = await repository.getCurrentUser()
      setState((prev) => ({
        ...prev,
        user,
        token,
        loading: false,
        error: null
      }))
    } catch (err) {
      setState({
        user: null,
        token: null,
        loading: false,
        error: err instanceof Error ? err.message : 'Sessão expirada'
      })
    }
  }, [repository, setState])

  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      try {
        await repository.register(credentials)
        setState((prev) => ({ ...prev, loading: false }))
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'Erro ao criar conta'
        }))
        throw err
      }
    },
    [repository]
  )

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
        checkAuth,
        isLoggedIn: !!state.user
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
