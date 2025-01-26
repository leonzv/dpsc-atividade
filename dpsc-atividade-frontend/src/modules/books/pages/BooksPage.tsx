import { FC, useState } from 'react'
import { BookList } from '../components/BookList'
import { useBooks } from '../hooks/useBooks'
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner'
import { Pagination } from '../../../shared/components/Pagination'
import { useAuth } from '../../auth/hooks/useAuth'

const BooksPage: FC = () => {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const { books, pagination, loading, error, deleteBook } = useBooks(
    page,
    perPage
  )
  const { isLoggedIn } = useAuth()

  if (loading) return <LoadingSpinner />
  if (error) return <div>Erro: {error.message}</div>

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-6">
        <BookList
          books={books}
          onDelete={isLoggedIn ? deleteBook : undefined}
        />
      </div>

      <div className="sticky bottom-0 border-t bg-white p-4 shadow-md">
        <Pagination
          currentPage={page}
          totalPages={
            pagination?.count ? Math.ceil(pagination.count / perPage) : 1
          }
          onPageChange={setPage}
          perPage={perPage}
          onPerPageChange={setPerPage}
          totalItems={pagination?.count || 0}
          showPerPage={false}
        />
      </div>
    </div>
  )
}
export default BooksPage
