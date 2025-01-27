import { z } from 'zod'
import { PaginatedResponse } from '../../../shared/types/api.types'

export const BookSchema = z.object({
  id: z.number(),
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  published_year: z.number().min(1800).max(new Date().getFullYear()),
  genre: z.string(),
  summary: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  cover_image: z
    .instanceof(File)
    .refine(
      (file) => ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type),
      {
        message: 'Invalid file type'
      }
    )
    .optional()
})

export type Book = z.infer<typeof BookSchema>

export interface CreateBookDTO {
  title: string
  author: string
  published_year: number
  genre: string
  summary: string
  cover_image?: File | string
  ratings_average?: number
}

export type UpdateBookDTO = Partial<CreateBookDTO>

export interface BookRepository {
  getAll(params?: {
    page: number
    perPage: number
    search?: string
  }): Promise<PaginatedResponse<Book>>
  getById(id: number): Promise<Book>
  create(data: CreateBookDTO): Promise<Book>
  update(id: number, data: UpdateBookDTO): Promise<Book>
  delete(id: number): Promise<void>
}
