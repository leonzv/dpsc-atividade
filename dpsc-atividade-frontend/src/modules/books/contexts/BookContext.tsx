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
import { formatApiErrors } from '../../../shared/utils/formatApiErrors'

interface BookContextState {
  books: Book[]
  loading: boolean
  error: ApiError | null
  pagination: PaginatedResponse<Book> | null
  searchQuery: string
}

interface BookContextActions {
  fetchBooks: (params?: { page: number; perPage: number; search?: string }) => Promise<void>
  createBook: (book: CreateBookDTO) => Promise<void>
  updateBook: (id: number, book: UpdateBookDTO) => Promise<void>
  deleteBook: (id: number) => Promise<void>
  setSearchQuery: (query: string) => void
}

export type BookContextData = BookContextState & BookContextActions

const initialState: BookContextState = {
  books: [],
  loading: false,
  error: null,
  pagination: null,
  searchQuery: ''
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

  const handleOperation = useCallback(async <T,>(
    operation: () => Promise<T>
  ): Promise<T> => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const result = await operation()
      setState((prev) => ({ ...prev, loading: false }))
      return result
    } catch (err) {
      const { genericError } = formatApiErrors(err as AxiosError)
      toast.error(genericError)
      setState((prev) => ({ ...prev, loading: false, error: err as ApiError }))
      throw err
    }
  }, [])

  const fetchBooks = useCallback(
    async (params?: { page: number; perPage: number; search?: string }): Promise<void> => {
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
    [repository, handleOperation]
  )

  const createBook = useCallback(
    async (book: CreateBookDTO) => {
      await handleOperation(() => repository.create(book))
      await fetchBooks({ page: 1, perPage: state.pagination?.count || 10, search: state.searchQuery })
    },
    [repository, fetchBooks, state.pagination, state.searchQuery, handleOperation]
  )

  const updateBook = useCallback(
    async (id: number, book: UpdateBookDTO) => {
      await handleOperation(() => repository.update(id, book))
      await fetchBooks({ page: 1, perPage: state.pagination?.count || 10, search: state.searchQuery })
    },
    [repository, fetchBooks, state.pagination, state.searchQuery, handleOperation]
  )

  const deleteBook = useCallback(
    async (id: number) => {
      await handleOperation(() => repository.delete(id))
      await fetchBooks({ page: 1, perPage: state.pagination?.count || 10, search: state.searchQuery })
    },
    [repository, fetchBooks, state.pagination, state.searchQuery, handleOperation]
  )

  const setSearchQuery = useCallback((query: string) => {
    setState((prev) => ({ ...prev, searchQuery: query }))
  }, [])

  return (
    <BookContext.Provider
      value={{
        ...state,
        fetchBooks,
        createBook,
        updateBook,
        deleteBook,
        setSearchQuery
      }}
    >
      {children}
    </BookContext.Provider>
  )
}
