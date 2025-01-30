import { useContext } from 'react'
import { BookContext } from '../contexts/BookContext'

export const useBooks = () => {
  const {
    books,
    pagination,
    loading,
    error,
    fetchBooks,
    createBook,
    updateBook,
    deleteBook,
    setSearchQuery
  } = useContext(BookContext)

  return {
    books,
    pagination,
    loading,
    error,
    createBook,
    updateBook,
    deleteBook,
    fetchBooks,
    setSearchQuery
  }
}
