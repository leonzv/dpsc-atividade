import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BookDetails } from '../components/BookDetails'
import { ErrorMessage } from '../../../shared/components/ErrorMessage'
import { Button } from '../../../shared/components/Button'
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner'
import { useGetBook } from '../hooks/useGetBook'

const BookDetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { book, isLoading, error } = useGetBook(Number(id))

  useEffect(() => {
    if (!id) {
      navigate('/')
    }
  }, [id, navigate])

  if (isLoading) return <LoadingSpinner />

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
