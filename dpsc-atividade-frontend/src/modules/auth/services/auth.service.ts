import axios from 'axios'
import api from '../../../shared/services/api'
import {
  AuthRepository,
  AuthResponse,
  JWTResponse,
  LoginCredentials,
  RegisterCredentials,
  User
} from '../types/auth.types'

const authClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL?.replace('/api', ''),
  headers: {
    'Content-Type': 'application/json'
  }
})

const TOKEN_KEY = '@BookCatalog:token'
const REFRESH_TOKEN_KEY = '@BookCatalog:refresh_token'

const setAuthHeader = (token: string | null): void => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY)
}

const setToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token)
    setAuthHeader(token)
  } catch {
    throw new Error('Failed to save authentication token')
  }
}

const clearToken = (): void => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  setAuthHeader(null)
}

const initializeToken = (): void => {
  const token = getStoredToken()
  if (token) {
    setAuthHeader(token)
  }
}

const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const payload = {
      email: credentials.login.includes('@') ? credentials.login : undefined,
      username: !credentials.login.includes('@')
        ? credentials.login
        : undefined,
      password: credentials.password
    }

    const response = await authClient.post<{ data: JWTResponse }>(
      '/auth/login/',
      payload
    )
    const { access, refresh, email, username, is_staff, roles } =
      response.data.data

    const user: User = { email, username, is_staff, roles }

    setToken(access)
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh)

    return { user, token: access }
  } catch (err) {
    clearToken()
    throw err
  }
}

const register = async (
  credentials: RegisterCredentials
): Promise<AuthResponse> => {
  await authClient.post('/auth/register/', credentials)
  return login({ login: credentials.email, password: credentials.password })
}

const logout = async (): Promise<void> => {
  try {
    simpleLogout()
  } catch (err) {
    clearToken()
    throw err
  }
}

const getCurrentUser = async (): Promise<User> => {
  const token = getStoredToken()
  if (!token) {
    throw new Error('No token found')
  }

  try {
    const response = await api.get<User>('/auth/user/')
    return response.data
  } catch (err) {
    clearToken()
    throw err
  }
}

const simpleLogout = (): void => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

initializeToken()

export const authService: AuthRepository = {
  login,
  logout,
  getCurrentUser,
  getStoredToken,
  register
}
