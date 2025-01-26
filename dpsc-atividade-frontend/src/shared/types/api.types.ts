export type ApiErrorResponse = {
  message: string
  error?: {
    message?:
      | {
          [key: string]: string[]
        }
      | string
    code?: number
  }
}

export interface ApiError extends ApiErrorResponse {
  status: number
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}
