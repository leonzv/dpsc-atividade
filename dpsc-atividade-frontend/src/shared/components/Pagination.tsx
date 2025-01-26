import { FC } from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  perPage: number
  onPerPageChange: (perPage: number) => void
  totalItems: number
  showPerPage?: boolean
}

export const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  perPage,
  onPerPageChange,
  totalItems,
  showPerPage = true
}) => {
  const perPageOptions = [10, 20, 50, 100]

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        {showPerPage && (
          <select
            value={perPage}
            onChange={(e) => {
              onPerPageChange(Number(e.target.value))
              onPageChange(1)
            }}
            className="h-8 rounded-md border border-border bg-background px-2 text-sm text-text-secondary min-w-[120px]"
          >
            {perPageOptions.map((option) => (
              <option key={option} value={option}>
                {option} por página
              </option>
            ))}
          </select>
        )}
        {totalItems > 0 && (
          <span className="text-sm text-text-tertiary whitespace-nowrap">
            Total: {totalItems} itens
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 justify-between sm:justify-end w-full sm:w-auto">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2 py-1 rounded-md text-text-secondary hover:text-text disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <span className="text-text-secondary whitespace-nowrap">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2 py-1 rounded-md text-text-secondary hover:text-text disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Próxima
        </button>
      </div>
    </div>
  )
}
