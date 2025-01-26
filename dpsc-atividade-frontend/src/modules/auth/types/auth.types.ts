export interface User {
  email: string
  username: string
  is_staff: boolean
  roles: string[]
}

export interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
}

export interface LoginCredentials {
  login: string
  password: string
}

export interface RegisterCredentials {
  username: string
  email: string
  password: string
  password_confirm: string
}

export interface JWTResponse {
  access: string
  refresh: string
  email: string
  username: string
  is_staff: boolean
  roles: string[]
}

export interface AuthResponse {
  user: User
  token: string
}

export interface AuthRepository {
  login: (credentials: LoginCredentials) => Promise<AuthResponse>
  logout: () => Promise<void>
  getCurrentUser: () => Promise<User>
  getStoredToken: () => string | null
  register: (credentials: RegisterCredentials) => Promise<AuthResponse>
}
