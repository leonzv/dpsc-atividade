import { FC, useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { CreateBookDTO } from '../types/book.types'
import { EmptyImage } from '../../../shared/components/EmptyImage'

interface SuggestionCardProps {
  book: CreateBookDTO
  onSelect: (book: CreateBookDTO) => void
}

export const SuggestionCard: FC<SuggestionCardProps> = ({ book, onSelect }) => {
  const [imageSrc, setImageSrc] = useState<string>('/default-cover.jpg')

  useEffect(() => {
    if (book.cover_image) {
      if (typeof book.cover_image === 'string') {
        setImageSrc(book.cover_image)
      } else {
        const objectUrl = URL.createObjectURL(book.cover_image)
        setImageSrc(objectUrl)
        return () => URL.revokeObjectURL(objectUrl)
      }
    } else {
      setImageSrc('/default-cover.jpg')
    }
  }, [book.cover_image])

  return (
    <div
      className="border rounded shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={() => onSelect(book)}
    >
      <div className="relative">
        {imageSrc !== '/default-cover.jpg' ? (
          <img
            src={imageSrc}
            alt={book.title}
            className="w-full aspect-[3/4] object-cover"
          />
        ) : (
          <EmptyImage />
        )}
        <div className="absolute top-2 left-2 flex items-center space-x-1 bg-slate-950 bg-opacity-70 p-1 rounded">
          <Star className="w-5 h-5 text-yellow-500 fill-current" />{' '}
          <span className="text-white text-sm">
            {Math.round((book.ratings_average || 0) * 10) / 10}{' '}
          </span>
        </div>
      </div>
      <div className="p-2">
        <h4 className="flex items-center text-sm font-semibold truncate">
          {book.title}
        </h4>
        <p className="text-xs text-gray-600 truncate">Autor: {book.author}</p>
        <p className="text-xs text-gray-600">Ano: {book.published_year}</p>
      </div>
    </div>
  )
}
