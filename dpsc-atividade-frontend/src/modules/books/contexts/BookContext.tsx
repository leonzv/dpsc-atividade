import { createContext, useState, useCallback, FC } from 'react'
import {
  Book,
  BookRepository,
  CreateBookDTO,
  UpdateBookDTO
} from '../types/book.types'
import { ApiError, PaginatedResponse } from '../../../shared/types/api.types'
import { toast } from 'react-hot-toast'
import { AxiosError } from 'axios'

interface BookContextState {
  books: Book[]
  loading: boolean
  error: ApiError | null
  pagination: PaginatedResponse<Book> | null
}

interface BookContextActions {
  fetchBooks: (params?: { page: number; perPage: number }) => Promise<void>
  getBook: (id: number) => Promise<Book>
  createBook: (book: CreateBookDTO) => Promise<void>
  updateBook: (id: number, book: UpdateBookDTO) => Promise<void>
  deleteBook: (id: number) => Promise<void>
  searchBooks: (query: string) => Promise<void>
}

export type BookContextData = BookContextState & BookContextActions

const initialState: BookContextState = {
  books: [],
  loading: false,
  error: null,
  pagination: null
}

export const BookContext = createContext<BookContextData>({} as BookContextData)

type BookProviderProps = {
  children: React.ReactNode
  repository: BookRepository
}

export const BookProvider: FC<BookProviderProps> = ({
  children,
  repository
}) => {
  const [state, setState] = useState<BookContextState>(initialState)

  const handleOperation = async <T,>(
    operation: () => Promise<T>
  ): Promise<T> => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const result = await operation()
      setState((prev) => ({ ...prev, loading: false }))
      return result
    } catch (err) {
      let errorMessage = 'Erro inesperado'
      let status = 500

      if (err instanceof AxiosError && err.response) {
        errorMessage = err.response.data?.error?.message || errorMessage
        status = err.response.status
      }

      setState((prev) => ({
        ...prev,
        loading: false,
        error: {
          message: errorMessage,
          status,
          errors: {}
        }
      }))
      toast.error(errorMessage)
      throw err
    }
  }

  const fetchBooks = useCallback(
    async (params?: { page: number; perPage: number }): Promise<void> => {
      await handleOperation(async () => {
        const response = await repository.getAll(params)
        setState((prev) => ({
          ...prev,
          books: response.results,
          pagination: response,
          loading: false
        }))
      })
    },
    [repository]
  )

  const searchBooks = useCallback(
    async (query: string): Promise<void> => {
      await handleOperation(async () => {
        const books = await repository.search(query)
        setState((prev) => ({ ...prev, books, error: null }))
      })
    },
    [repository]
  )

  const getBook = useCallback(
    (id: number) => {
      return handleOperation(() => repository.getById(id))
    },
    [repository]
  )

  const createBook = useCallback(
    async (book: CreateBookDTO) => {
      await handleOperation(() => repository.create(book))
      await fetchBooks()
    },
    [repository, fetchBooks]
  )

  const updateBook = useCallback(
    async (id: number, book: UpdateBookDTO) => {
      await handleOperation(() => repository.update(id, book))
      await fetchBooks()
    },
    [repository, fetchBooks]
  )

  const deleteBook = useCallback(
    async (id: number) => {
      await handleOperation(() => repository.delete(id))
      await fetchBooks()
    },
    [repository, fetchBooks]
  )

  return (
    <BookContext.Provider
      value={{
        ...state,
        fetchBooks,
        getBook,
        createBook,
        updateBook,
        deleteBook,
        searchBooks
      }}
    >
      {children}
    </BookContext.Provider>
  )
}
