import { useContext, useState, useEffect } from 'react'
import { BookContext } from '../contexts/BookContext'
import { Book } from '../types/book.types'
import { formatApiErrors } from '../../../shared/utils/formatApiErrors'
import toast from 'react-hot-toast'

export const useBooks = () => {
  const {
    books,
    pagination,
    loading,
    createBook,
    updateBook,
    deleteBook,
    fetchBooks,
    setSearchQuery
  } = useContext(BookContext)

  const useGetBook = (id: number) => {
    const { getBook } = useContext(BookContext)
    const [data, setData] = useState<Book | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
      const fetchBook = async () => {
        setIsLoading(true)
        try {
          const fetchedBook = await getBook(id)
          setData(fetchedBook)
        } catch (err) {
          const { genericError } = formatApiErrors(err)
          toast.error(genericError)
        } finally {
          setIsLoading(false)
        }
      }

      if (id) {
        fetchBook()
      }
    }, [id, getBook])

    return { data, isLoading }
  }

  return {
    books,
    pagination,
    loading,
    useGetBook,
    createBook,
    updateBook,
    deleteBook,
    fetchBooks,
    setSearchQuery
  }
}
