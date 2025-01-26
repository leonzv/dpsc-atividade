import { FC } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BookForm } from '../components/BookForm'
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner'
import { useBooks } from '../hooks/useBooks'

const EditBookPage: FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { useGetBook } = useBooks()
  const { data: book, isLoading, error } = useGetBook(Number(id))

  if (isLoading) return <LoadingSpinner />
  if (error || !book) {
    navigate('/books')
    return null
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Editar Livro</h1>
      <BookForm initialData={book} bookId={book.id} />
    </div>
  )
}

export default EditBookPage
