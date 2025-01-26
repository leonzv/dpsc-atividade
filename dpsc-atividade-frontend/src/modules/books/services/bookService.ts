import api from '../../../shared/services/api'
import { PaginatedResponse } from '../../../shared/types/api.types'
import {
  Book,
  BookRepository,
  CreateBookDTO,
  UpdateBookDTO
} from '../types/book.types'

class BookService implements BookRepository {
  async getAll(params?: {
    page: number
    perPage: number
  }): Promise<PaginatedResponse<Book>> {
    const response = await api.get<PaginatedResponse<Book>>('/books', {
      params
    })
    return response.data
  }

  async getById(id: number): Promise<Book> {
    const response = await api.get<Book>(`/books/${id}`)
    return response.data
  }

  async create(data: CreateBookDTO): Promise<Book> {
    const formData = this.convertToFormData(data)
    const response = await api.post<Book>('/books/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }

  async update(id: number, data: UpdateBookDTO): Promise<Book> {
    const formData = this.convertToFormData(data)
    const response = await api.patch<Book>(`/books/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }

  private convertToFormData(data: CreateBookDTO | UpdateBookDTO): FormData {
    const formData = new FormData()

    if (data.title) formData.append('title', data.title)
    if (data.author) formData.append('author', data.author)
    if (data.published_year !== undefined) {
      formData.append('published_year', data.published_year.toString())
    }
    if (data.genre) formData.append('genre', data.genre)
    if (data.summary) formData.append('summary', data.summary)
    if (data.cover_image instanceof File) {
      formData.append('cover_image', data.cover_image)
    }

    return formData
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/books/${id}/`)
  }

  async search(query: string): Promise<Book[]> {
    const response = await api.get<PaginatedResponse<Book>>('/books', {
      params: { search: query }
    })
    return response.data.results
  }

  async searchSuggestions(data: CreateBookDTO): Promise<CreateBookDTO[]> {
    const formData = this.convertToFormData(data)
    const response = await api.post<{
      success: boolean
      suggestions: CreateBookDTO[]
    }>('/books/search_suggestions/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data.suggestions
  }
}

export const bookService = new BookService()
