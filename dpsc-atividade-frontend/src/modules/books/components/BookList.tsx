import { FC } from 'react'
import { BookCard } from './BookCard'
import { Book } from '../types/book.types'

interface BookListProps {
  books: Book[]
  onDelete?: (id: number) => Promise<void>
}

export const BookList: FC<BookListProps> = ({ books, onDelete }) => (
  <div className="flex flex-col h-full">
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 flex-1">
      {books.length > 0 ? (
        books.map((book) => (
          <BookCard key={book.id} book={book} onDelete={onDelete} />
        ))
      ) : (
        <div className="col-span-full text-center text-text-tertiary flex items-center justify-center">
          Nenhum livro encontrado.
        </div>
      )}
    </div>
  </div>
)
