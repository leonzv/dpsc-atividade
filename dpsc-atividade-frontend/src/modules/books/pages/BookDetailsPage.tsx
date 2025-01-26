import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BookDetails } from '../components/BookDetails'
import { ErrorMessage } from '../../../shared/components/ErrorMessage'
import { Button } from '../../../shared/components/Button'
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner'
import { Book } from '../types/book.types'
import { bookService } from '../services/bookService'
import toast from 'react-hot-toast'
import { formatApiErrors } from '../../../shared/utils/formatApiErrors'

const BookDetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      navigate('/')
      return
    }

    const fetchBook = async () => {
      try {
        const data = await bookService.getById(parseInt(id, 10))
        setBook(data)
      } catch (err) {
        const { genericError } = formatApiErrors(err)
        toast.error(genericError)
        setError(genericError)
        setBook(null)
      } finally {
        setLoading(false)
      }
    }

    fetchBook()
  }, [id, navigate])

  if (loading) return <LoadingSpinner />

  if (error || !book) {
    return (
      <div className="text-center">
        <ErrorMessage message={error || 'Livro não encontrado'} />
        <div className="mt-4">
          <Button onClick={() => navigate('/books')}>
            Voltar para a lista
          </Button>
        </div>
      </div>
    )
  }

  return <BookDetails book={book} />
}

export default BookDetailsPage
