import { ApiError } from './api.types'

export interface BaseRepository<T, CreateDTO, UpdateDTO> {
  getAll(): Promise<T[]>
  getById(id: number): Promise<T>
  create(data: CreateDTO): Promise<T>
  update(id: number, data: UpdateDTO): Promise<T>
  delete(id: number): Promise<void>
}

export interface ErrorHandler {
  handle(error: unknown): ApiError
}
