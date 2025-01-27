import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../shared/components/Button'
import { useBooks } from '../hooks/useBooks'
import { Book } from '../types/book.types'
import { toast } from 'react-hot-toast'
import { Dialog } from '../../../shared/components/Dialog'
import { useAuth } from '../../auth/hooks/useAuth'
import { formatApiErrors } from '../../../shared/utils/formatApiErrors'
import { EmptyImage } from '../../../shared/components/EmptyImage'

type BookDetailsProps = {
  book: Book
}

export const BookDetails = ({ book }: BookDetailsProps) => {
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()
  const { deleteBook } = useBooks()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    setShowConfirm(false)
    setIsDeleting(true)
    try {
      await deleteBook(book.id)
      navigate('/books')
    } catch (err) {
      const { genericError } = formatApiErrors(err)
      toast.error(genericError)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <div className="aspect-[3/4] rounded-lg overflow-hidden">
              {book.cover_image ? (
                <img
                  src={typeof book.cover_image === 'string'
                    ? book.cover_image
                    : URL.createObjectURL(book.cover_image)}
                  alt={`Capa do livro ${book.title}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <EmptyImage />
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-gray-600">Autor</h3>
                <p className="font-medium">{book.author}</p>
              </div>
              <div>
                <h3 className="text-gray-600">Gênero</h3>
                <p className="font-medium">{book.genre}</p>
              </div>
              <div>
                <h3 className="text-gray-600">Ano de Publicação</h3>
                <p className="font-medium">{book.published_year}</p>
              </div>
            </div>

            <div className="mb-6 flex-1">
              <h3 className="text-gray-600 mb-2">Resumo</h3>
              <p className="text-text-secondary">{book.summary}</p>
            </div>

            <div className="flex justify-between mt-auto pt-4">
              <Button onClick={() => navigate('/books')} variant="outline">
                Voltar para a lista
              </Button>
              <div className="space-x-2">
                {isLoggedIn && (
                  <>
                    <Button
                      onClick={() => navigate(`/books/${book.id}/edit`)}
                      variant="outline"
                    >
                      Editar
                    </Button>
                    <Button
                      onClick={() => setShowConfirm(true)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Excluindo...' : 'Excluir'}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Tem certeza que deseja excluir este livro?"
        isLoading={isDeleting}
      />
    </div>
  )
}
