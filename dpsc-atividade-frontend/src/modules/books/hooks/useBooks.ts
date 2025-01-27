import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { CreateBookDTO, UpdateBookDTO } from '../types/book.types'
import { bookService } from '../services/bookService'
import { formatApiErrors } from '../../../shared/utils/formatApiErrors'
import { ApiError } from '../../../shared/types/api.types'

export const useBooks = (page: number = 1, perPage: number = 10) => {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['books', { page, perPage }],
    queryFn: () => bookService.getAll({ page, perPage })
  })

  const useGetBook = (id: number) => {
    return useQuery({
      queryKey: ['book', id],
      queryFn: () => bookService.getById(id),
      enabled: !!id
    })
  }

  const createMutation = useMutation({
    mutationFn: (book: CreateBookDTO) => bookService.create(book),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
      toast.success('Livro criado com sucesso!')
    },
    onError: (error) => {
      throw error
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBookDTO }) =>
      bookService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
      toast.success('Livro atualizado com sucesso!')
    },
    onError: (error: unknown) => {
      throw error
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => bookService.delete(id),
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
      queryClient.invalidateQueries({ queryKey: ['book', id] })
      toast.success('Livro excluído com sucesso!')
    },
    onError: (error: ApiError) => {
      const { genericError } = formatApiErrors(error)
      toast.error(genericError)
    }
  })

  return {
    books: data?.results || [],
    pagination: data,
    loading: isLoading,
    error,
    useGetBook,
    createBook: createMutation.mutateAsync,
    updateBook: (id: number, data: UpdateBookDTO) =>
      updateMutation.mutateAsync({ id, data }),
    deleteBook: deleteMutation.mutateAsync,
    fetchBooks: () => queryClient.invalidateQueries({ queryKey: ['books'] })
  }
}
