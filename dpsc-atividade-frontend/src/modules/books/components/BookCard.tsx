import { useState } from 'react'
import { Button } from '../../../shared/components/Button'
import { Book } from '../types/book.types'
import { formatDate } from '../../../shared/utils/format'
import { Trash, Pencil } from 'lucide-react'
import { useAuth } from '../../auth/hooks/useAuth'
import { Dialog } from '../../../shared/components/Dialog'
import { useNavigate } from 'react-router-dom'
import { EmptyImage } from '../../../shared/components/EmptyImage'
type BookCardProps = {
  book: Book
  onDelete?: (id: number) => Promise<void>
}

export const BookCard = ({ book, onDelete }: BookCardProps) => {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    setShowConfirm(false)
    if (!onDelete) return
    setIsDeleting(true)
    try {
      await onDelete(book.id)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCardClick = () => {
    navigate(`/books/${book.id}`)
  }

  return (
    <div
      className="h-64 min-w-0 group rounded-lg bg-white shadow-md flex flex-col md:flex-row cursor-pointer outline outline-2 outline-transparent hover:outline-accent-hover transition-[outline] duration-200 ease-in-out m-[2px]"
      onClick={handleCardClick}
    >
      <div className="w-full md:w-1/3 aspect-w-3 aspect-h-4 overflow-hidden rounded-l-lg md:min-w-[35%]">
        {book.cover_image ? (
          <img
            src={
              typeof book.cover_image === 'string'
                ? book.cover_image
                : URL.createObjectURL(book.cover_image)
            }
            alt={book.title}
            className="object-cover w-full h-full min-w-[35%]"
          />
        ) : (
          <EmptyImage />
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col min-w-0 w-full">
        <div className="flex items-start gap-2 w-full">
          <div className="min-w-0 flex-1 overflow-hidden">
            <h3 className="text-lg font-semibold text-gray-800 truncate">
              {book.title}
            </h3>
            <p className="text-sm text-gray-500 truncate">por {book.author}</p>
          </div>

          <div className="flex items-start gap-1 flex-shrink-0">
            {isLoggedIn && (
              <Button
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/books/${book.id}/edit`)
                }}
                className="text-blue-500 hover:text-blue-600 text-sm h-8 w-8 p-0 flex items-center justify-center"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {isLoggedIn && onDelete && (
              <Button
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowConfirm(true)
                }}
                isLoading={isDeleting}
                className="text-red-500 hover:text-red-600 text-sm h-8 w-8 p-0 flex items-center justify-center"
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex gap-2 text-xs text-gray-400 mt-2">
          <span>{book.genre}</span>
          <span>•</span>
          <span>{book.published_year}</span>
        </div>
        <p className="text-sm text-gray-600 mt-2 line-clamp-3">
          {book.summary}
        </p>
        <div className="mt-auto text-xs text-gray-400">
          Adicionado em {formatDate(book.created_at)}
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
