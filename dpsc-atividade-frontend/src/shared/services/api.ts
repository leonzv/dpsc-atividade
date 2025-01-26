import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { formatApiErrors } from '../utils/formatApiErrors'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

let isRefreshing = false
let failedQueue: {
  resolve: (token: string) => void
  reject: (error: unknown) => void
}[] = []

const processQueue = (error: unknown | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve(token!)
    }
  })

  failedQueue = []
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('@BookCatalog:token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => {
    if (response.data && response.data.data) {
      response.data = response.data.data
    }
    return response
  },
  async (error: AxiosError) => {
    if (!error.config) {
      return Promise.reject(error)
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (
      error.response?.status === 401 &&
      originalRequest.url?.includes('/api/auth/refresh/')
    ) {
      localStorage.removeItem('@BookCatalog:token')
      localStorage.removeItem('@BookCatalog:refresh_token')
      window.location.href = '/login'
      const { genericError, fieldErrors } = formatApiErrors(error)
      if (fieldErrors) {
        return Promise.reject(fieldErrors)
      } else {
        return Promise.reject(new Error(genericError))
      }
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      return new Promise((resolve, reject) => {
        const refreshToken = localStorage.getItem('@BookCatalog:refresh_token')
        if (!refreshToken) {
          reject(new Error('No refresh token'))
          return
        }

        axios
          .post<{ access: string }>(
            `${import.meta.env.VITE_API_URL?.replace(
              '/api',
              ''
            )}/auth/refresh/`,
            { refresh: refreshToken }
          )
          .then((response) => {
            const { access: newToken } = response.data
            localStorage.setItem('@BookCatalog:token', newToken)
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            processQueue(null, newToken)
            resolve(api(originalRequest))
          })
          .catch((err) => {
            processQueue(err, null)
            localStorage.removeItem('@BookCatalog:token')
            localStorage.removeItem('@BookCatalog:refresh_token')
            window.location.href = '/login'
            const { genericError } = formatApiErrors(err)
            reject(new Error(genericError))
          })
          .finally(() => {
            isRefreshing = false
          })
      })
    }

    return Promise.reject(error)
  }
)

export default api
