import { FC, useState, useEffect, useRef, useCallback } from 'react'
import { BookList } from '../components/BookList'
import { useBooks } from '../hooks/useBooks'
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner'
import { Pagination } from '../../../shared/components/Pagination'
import { useAuth } from '../../auth/hooks/useAuth'
import { SearchInput } from '../../../shared/components/SearchInput'

const BooksPage: FC = () => {
  const { books, pagination, loading, deleteBook, fetchBooks, setSearchQuery } = useBooks()
  const { isLoggedIn } = useAuth()
  const [search, setLocalSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const searchTimeoutRef = useRef<NodeJS.Timeout>()
  const isFirstRender = useRef(true)
  const lastSearchRef = useRef<string>('')

  const totalPages = pagination ? Math.ceil(pagination.count / 10) : 1
  const safeTotalPages = totalPages < 1 ? 1 : totalPages

  useEffect(() => {
    if (isFirstRender.current) {
      fetchBooks({ page: 1, perPage: 10 })
      isFirstRender.current = false
    }
  }, [fetchBooks])

  const performSearch = useCallback((searchTerm: string) => {
    if (lastSearchRef.current === searchTerm) return

    lastSearchRef.current = searchTerm
    fetchBooks({ page: 1, perPage: 10, search: searchTerm })
    setCurrentPage(1)
  }, [fetchBooks, setCurrentPage])

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    performSearch(search)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalSearch(value)
    setSearchQuery(value)

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(value)
    }, 500)
  }

  const handlePageChange = (page: number) => {
    if (page < 1 || page > safeTotalPages) return
    setCurrentPage(page)
    fetchBooks({ page, perPage: 10, search })
  }

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 flex justify-end ml-auto pt-6">
        <SearchInput
          search={search}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
          enableButton={false}
        />
      </div>
      <div className="flex-1 p-6 relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
            <LoadingSpinner />
          </div>
        ) : null}
        <BookList
          books={books}
          onDelete={isLoggedIn ? deleteBook : undefined}
        />
      </div>

      <div className="sticky bottom-0 border-t bg-white p-4 shadow-md">
        <Pagination
          currentPage={currentPage}
          totalPages={safeTotalPages}
          onPageChange={handlePageChange}
          perPage={10}
          onPerPageChange={() => { }}
          totalItems={pagination?.count || 0}
          showPerPage={false}
        />
      </div>
    </div>
  )
}

export default BooksPage
