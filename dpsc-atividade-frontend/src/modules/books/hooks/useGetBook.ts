import { useState, useEffect } from 'react'
import { Book } from '../types/book.types'
import { bookService } from '../services/bookService'
import { formatApiErrors } from '../../../shared/utils/formatApiErrors'
import toast from 'react-hot-toast'

export const useGetBook = (id: number) => {
    const [book, setBook] = useState<Book | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchBook = async () => {
            setIsLoading(true)
            try {
                const fetchedBook = await bookService.getById(id)
                setBook(fetchedBook)
            } catch (err) {
                const { genericError } = formatApiErrors(err)
                toast.error(genericError)
                setError(genericError)
                setBook(null)
            } finally {
                setIsLoading(false)
            }
        }

        if (id) {
            fetchBook()
        }
    }, [id])

    return { book, isLoading, error }
}